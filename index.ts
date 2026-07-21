import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { MessagesAnnotation, StateGraph } from '@langchain/langgraph';
import { HumanMessage } from 'langchain';

/*
* 1. Define Node Functions.
* 2. Build the Graph.
* 3. Compile and Invoke the Graph.
*/

function callModal(state: any) {
    // Call the LLM using APIs
    console.log("Calling LLM...");

    return state;
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

        console.log(`Final: ${finalState}`);
    }

    rl.close();
}

main();