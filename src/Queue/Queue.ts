/*
    Push, push, push
        [1, 2, 3, 4, 5]
         ^

    Dequeue - remove an element from the queue
        []

        With Shift:
        1. [2, 2, 3, 4, 5]
        2. [2, 3, 3, 4, 5]
        3. [2, 3, 4, 4, 5]
        4. [2, 3, 4, 5, 5]
        5. [2, 3, 4, 5]

        With an optimal queue:
            [1, 2, 3, 4, 5]
            Dequeue: 1. [2, 3, 4, 5]
            Dequeue: 1. [3, 4, 5]
            Dequeue: 1. [4, 5]
            Dequeue: 1. [5]

        Each takes a single step, O(1) time to run.  
*/

import { IQueue } from "./IQueue";

export class Queue<T> implements IQueue<T> {
    _array: T[];
    _startingIndex: number;
    
    constructor() {
        this._array = [];
        this._startingIndex = 0;
    }

    // Adds a new item to the queue.
    Add(element: T): void {
        this._array.push(element);
    }

    // Removes an element from the queue. Returns the removed element.
    Remove(): T {
        const removedElement = this._array[this._startingIndex];
        this._startingIndex += 1;

        if (this._startingIndex > this._array.length / 2) {
            this._resize();
        }

        return removedElement;
    }
    
    // Peeks at the first element of the queue without removing it.
    Peek() {
        return this._array[this._startingIndex];
    }

    // Returns true if there are any elements in the queue.
    Any(): boolean {
        return this._array.length - this._startingIndex > 0;
    }

    private _resize() {
        // Copy the elements into a new array
        const newArray = Array(this._array.length - this._startingIndex);
        for (let i = this._startingIndex; i < this._array.length; i++) {
            newArray[i - this._startingIndex] = this._array[i];
        }

        // Set our new array.
        this._array = newArray;
        this._startingIndex = 0;
    }
}