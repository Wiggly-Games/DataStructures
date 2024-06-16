import { Bag, Queue } from "./src";
import * as Files from "@wiggly-games/files"

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

async function TestBag(){
    const bag = new Bag<number>();
    const bag2 = new Bag<number>();

    for (let i = 0; i < 50; i++) {
        bag.Add(1);
    }
    for (let i = 0; i < 25; i++) {
        bag.Add(2);
    }
    for (let i = 0; i < 10; i++) {
        bag.Add(3);
    }
    
    await Files.WithWriteStream("./Test.txt", (stream) => {
        return bag.Write("=", stream);
    })

    await Files.WithReadStream("./Test.txt", (stream) => {
        return bag2.Read("=", stream, (data) => parseInt(data));
    });

    console.log(bag2);
}


//TestQueue();
TestBag();