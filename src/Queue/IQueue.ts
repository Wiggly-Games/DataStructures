/*
    interface to a queue.
*/
export interface IQueue<T> {
    Add(element: T): void;
    Remove(): T;
    Peek(): T;
    Any(): void;
}
