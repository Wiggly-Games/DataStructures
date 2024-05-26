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

import { IBag } from "./IBag";

type InputTypes<T> = ([any, number])[] | Map<T, number> | undefined;

export class Bag<T> implements IBag<T> {
    private _data: Map<T, number>;
    private _count: number;

    // Creates a new ProbabilityBag.
    constructor(data?: InputTypes<T>){
        this._data = Bag.ConvertInputData<T>(data);

        let counter = 0;
        if (data) {
            for (const [key, numberSeen] of this._data.entries()){
                counter += numberSeen;
            }
        }

        this._count = counter;
    }

    // Converts the input data into a map, so that it can be stored within a bag.
    static ConvertInputData<T>(inputData: InputTypes<T>) {
        // 1. If no input data is provided, we just use an empty map.
        if (inputData === undefined) {
            return new Map<T, number>();
        }

        // 2. If we have a map, we can just use the map directly.
        if (inputData instanceof Map) {
            return inputData;
        }

        // 3. Otherwise, we need to convert it to a map. This is an array of elements.
        return new Map(inputData);
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
    
    // Always true. Can be used to check if a class is a Probability Bag.
    IsBag(){
        return true;
    }
}