import { Bag, Queue } from "./src";
import * as Files from "@wiggly-games/files"
import { Reader } from "@wiggly-games/node-readline";

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
    const bag3 = new Bag<number>();

    for (let i = 0; i < 50; i++) {
        bag.Add(1);
    }
    for (let i = 0; i < 25; i++) {
        bag.Add(2);
    }
    for (let i = 0; i < 10; i++) {
        bag.Add(3);
    }
    
    // Write twice, so that we can push it into two separate bags.
    await Files.WithWriteStream("./Test.txt", (stream) => {
        return bag.Write(stream);
    })
    await Files.WithAppendStream("./Test.txt", (stream) => {
        return bag.Write(stream);
    })

    const fileReader = new Reader("./Test.txt");
    bag2.Read(fileReader, (data) => parseInt(data));
    bag3.Read(fileReader, (data) => parseInt(data));

    console.assert(bag.Equals(bag2), `ERROR: Bag and Bag2 are different.`);
    console.assert(bag.Equals(bag3), `ERROR: Bag and Bag3 are different.`);
    console.assert(bag2.Equals(bag3), `ERROR: Bag2 and Bag3 are different.`);
}


//TestQueue();
TestBag();