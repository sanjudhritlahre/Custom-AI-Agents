import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

async function main() {
    const rl = readline.createInterface({ input, output });

    while (true) {
        const userInput = await rl.question("You: ");
        if (userInput === "/bye") break;

        console.log(`You said: ${userInput}`);
    }

    rl.close();
}

main();