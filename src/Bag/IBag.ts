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

export interface IBag<T> {
    Add(item: T): void;
    Remove(item: T): boolean;
    Pull(): T;

    GetItems(): IterableIterator<T>;
    CountContents(): number;

    Clear(): void;

    Entries(): IterableIterator<[T, number]>;
}