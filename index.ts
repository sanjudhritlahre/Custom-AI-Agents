import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { MemorySaver, MessagesAnnotation, StateGraph } from '@langchain/langgraph';
import { ChatGroq } from "@langchain/groq";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from '@langchain/tavily';
import { AIMessage } from "@langchain/core/messages";

const checkpointer = new MemorySaver();

const tool = new TavilySearch({
    maxResults: 3,
    topic: "general",
    // includeAnswer: false,
    // includeRawContent: false,
    // includeImages: false,
    // includeImageDescriptions: false,
    // searchDepth: "basic",
    // timeRange: "day",
    // includeDomains: [],
    // excludeDomains: [],
});

/*
* Initialize the Tool Node!
*/
const tools = [tool];
const toolNode = new ToolNode(tools);

/*
* 1. Define Node Functions.
* 2. Build the Graph.
* 3. Compile and Invoke the Graph.
*/

/* 
 * Initialize the LLM | Instantiation!
 * Now we can instantiate our model object and generate chat completions:
*/
const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
}).bindTools(tools);

async function callModal(state: typeof MessagesAnnotation.State) {
    // Call the LLM using APIs
    console.log("Calling LLM...");
    const response = await llm.invoke(state.messages);

    return { messages: [response] };
}

/**
 * Put your condition!
 * Whether to call a tool or end!
*/
function shouldContinue(state: typeof MessagesAnnotation.State) {
    const lastMessage = state.messages.at(-1);

    // TODO: Debug the Code
    // console.log("State: ", state);

    // No messages → end
    if (!lastMessage) {
        return "__end__";
    }

    // Continue only if the last message is an AI message with tool calls
    if (
        lastMessage instanceof AIMessage &&
        lastMessage.tool_calls &&
        lastMessage.tool_calls.length > 0
    ) {
        return "tools";
    }

    // Instead of instanceof, you can use the type guard:
    //  if (
    //     isAIMessage(lastMessage) &&
    //     lastMessage.tool_calls?.length
    // ) {
    //     return "tools";
    // }

    return "__end__";
}

/** Build the Graph! **/
const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModal)
    .addNode("tools", toolNode)
    .addEdge("__start__", "agent")
    .addConditionalEdges("agent", shouldContinue)
    // After tools execute, call the agent again
    .addEdge("tools", "agent");

/** Compile the Graph! **/
const app = workflow.compile({ checkpointer });

async function main() {
    const rl = readline.createInterface({ input, output });

    while (true) {
        const userInput = await rl.question("You: ");
        if (userInput === "/bye") break;

        /** Invoke the App! **/
        const finalState = await app.invoke({
            messages: [{ role: "user", content: userInput }]
        }, { configurable: { thread_id: "1" } });

        const lastMessage = finalState.messages[finalState.messages.length - 1];
        console.log(`Ai: ${lastMessage?.content}`);
    }

    rl.close();
}

main();