import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { MessagesAnnotation, StateGraph } from '@langchain/langgraph';
import { ChatGroq } from "@langchain/groq";

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
});

async function callModal(state: typeof MessagesAnnotation.State) {
    // Call the LLM using APIs
    console.log("Calling LLM...");
    const response = await llm.invoke(state.messages);

    return {messages: [response]};
}

/** Build the Graph! **/
const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModal)
    .addEdge("__start__", "agent")
    .addEdge("agent", "__end__");

/** Compile the Graph! **/
const app = workflow.compile();

async function main() {
    const rl = readline.createInterface({ input, output });

    while (true) {
        const userInput = await rl.question("You: ");
        if (userInput === "/bye") break;

        /** Invoke the App! **/
        const finalState = await app.invoke({
            messages: [{ role: "user", content: userInput }]
        });

        const lastMessage = finalState.messages[finalState.messages.length - 1];
        console.log(`Ai: ${lastMessage?.content}`);
    }

    rl.close();
}

main();