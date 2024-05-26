import { Queue } from "./src";

function TestQueue(){
    const queue = new Queue<number>();

    for (let i = 0; i < 100000000; i++) {
        queue.Add(i);
    }

    for (let i = 0; i < 100000000; i++) {
        let removed = queue.Remove();
        if (removed !== i) {
            throw `Removed element ${i} is actually: ${removed}`;
        }
    }
}

TestQueue();