/*
    Probability Map is designed to add elements, and pull them out later based on how common the element is.

    For example, assume we have a bag of:
        - 10 Red
        - 3 blue
        - 5 yellow

    If we pull one element, we'll have 10/18 chance of pulling a Red, 3/18 chance of Blue, 5/18 chance of Yellow.

    Pulling an element does not remove the element from the bag, so the probability will remain the same afterwards.
    Probability can be reduced by calling Remove on that element, which will remove one of it from the bag.
*/

import { Readable, Writable } from "stream";
import { IBag } from "./IBag";
import { createInterface } from "readline/promises";

export class Bag<T> implements IBag<T> {
    private _data: Map<T, number>;
    private _count: number;

    // Creates a new ProbabilityBag.
    constructor(data?: Iterable<readonly [T, number]> | undefined){
        this._data = new Map<T, number>(data);

        let counter = 0;
        if (data) {
            for (const [key, numberSeen] of this._data.entries()){
                counter += numberSeen;
            }
        }

        this._count = counter;
    }

    // Adds a key to the map, either increasing its probability or setting it as an option.
    Add(key: T){
        if (this._data.has(key)) {
            // If the key is already in the map, increase its probability.
            this._data.set(key, this._data.get(key) + 1);
        } else {
            // Otherwise, set it as a new option with a starting probability = 1.
            this._data.set(key, 1);
        }

        this._count += 1;
    }

    // Retrieves all items that are within the bag.
    GetItems(): IterableIterator<T> {
        return this._data.keys();
    }

    // Retrieves the count of all items within the bag.
    CountContents(): number {
        return this._count;
    }

    // Pulls a random item from the bag.
    Pull(): T {
        // 1. We need to create a list of all the keys that we've seen with their probabilities of occurring.
        let counter = 0;
        let list = [ ];
        for (const [key, numberSeen] of this._data.entries()){
            counter += numberSeen;
            list.push({
                size: counter,
                key: key
            });
        }
    
        // 2. Pick a random number from 0 - Counter-1
        let rand = Math.floor(Math.random() * counter)
    
        // Walk through the list until we find the first key where size > our random number.
        let index = 0;
        while (index < list.length && list[index].size <= rand) {
            index ++;
        }
    
        // Return the element at this index.
        return index >= list.length ? undefined : list[index].key;
    }

    // Removes one of an item from the bag.
    Remove(item: T): boolean {
        if (!this._data.has(item)) {
            return false;
        }

        const inBag = this._data.get(item);
        if (inBag === 0) {
            return false;
        }

        this._data.set(item, inBag - 1);
    }

    // Retrieves the data as a read-only map.
    ConvertToMap(): ReadonlyMap<T, number> {
        return this._data;
    }

    // Removes all items from the bag.
    Clear() {
        this._data.clear();
    }
    
    // Writes the bag to a WritableStream.
    async Write(separator: string, writeStream: Writable): Promise<void> {
        for (var [key, value] of this._data) {
            await writeStream.write(`${key}${separator}${value}\n`);
        }
    }

    // Reads the bag from an input stream.
    // Also takes in a parseKey argument, which is used to convert from a string to the expected key type (T).
    Read(separator: string, readStream: Readable, parseKey: (key: string)=>T) {
        const matchLine = new RegExp(`(.+)${separator}(.+)`);
        return new Promise<void>((fulfill, reject) => {
            // Read through the read stream line by line;
            // That way we can retrieve all the files that we saved earlier.
            const reader = createInterface(readStream);
            let count = 0;

            reader.on('line', (line) => {
                // The line format is KEY VALUE, with the null character (\0) as the separator.
                const [_, key, value] = matchLine.exec(line);

                // The values will be retrieved here as strings.
                // We need to parse the key into the expected format using parseKey,
                // And the value will always be a number, so we can parse it with parseInt.
                const parsedKey = parseKey(key);
                const parsedValue = parseInt(value);

                // If the value already exists, this is an unexpected behaviour and something went wrong in saving earlier.
                // Throw an error.
                if (this._data.has(parsedKey)) {
                    reject(`Parsed key: ${key}, which was already set in the bag (has current value ${this._data.get(parsedKey)} and new value ${value}).`);
                }

                // Otherwise, we can update our map with this value & update our counter
                this._data.set(parsedKey, parsedValue);
                count += parsedValue;
            });
            reader.on('close', () => {
                // At this point, all the data was loaded, set our counter and return back
                this._count = count;
                fulfill();
            });
        });
    }

}