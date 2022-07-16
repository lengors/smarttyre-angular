import { Comparator } from './comparator';

export class OrderedSet<T> {
  private readonly __items = Array<T>();
  private __comparator: Comparator<T>;

  constructor(comparator?: Comparator<T>) {
    this.__comparator = comparator
      ? comparator
      : (a: T, b: T) => {
          if (a < b) return -1;
          else if (a > b) return 1;
          else return 0;
        };
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.__items[Symbol.iterator]();
  }

  add(item: T): number {
    // Get the index.
    const index = this.search(item);

    // Search the actual item.
    if (this.find(item, index) !== -1)
      // Return the index.
      return -1;

    // Insert the item at the index.
    this.__items.splice(index, 0, item);

    // Return the index.
    return index;
  }

  clear(): void {
    this.__items.splice(0, this.__items.length);
  }

  set comparator(value: Comparator<T>) {
    this.__comparator = value;
    this.__items.sort(value);
  }

  find(item: T, index?: number): number {
    if (index === undefined) index = this.search(item);
    for (
      let i = index;
      i >= 0 &&
      i < this.__items.length &&
      this.__comparator(item, this.__items[i]) === 0;
      --i
    )
      if (item === this.__items[i]) return i;
    for (
      let i = index + 1;
      i >= 0 &&
      i < this.__items.length &&
      this.__comparator(item, this.__items[i]) === 0;
      ++i
    )
      if (item === this.__items[i]) return i;
    return -1;
  }

  remove(item: T): number {
    // Find the index of the item.
    let index = this.search(item);

    // Check if the item is found.
    index = this.find(item, index);

    // Remove the item if found.
    if (index !== -1)
      // Remove the item.
      this.__items.splice(index, 1);

    // Return the index.
    return index;
  }

  protected search(item: T): number {
    // Binary search the tyre index.
    let start = 0,
      end = this.size;

    // While the start is less than the end.
    while (start < end) {
      // Get the middle index.
      const middle = Math.floor((start + end) / 2);

      // Get the middle item.
      const compare = this.__comparator(item, this.__items[middle]);

      // Check if the tyre is smaller than the middle tyre.
      if (compare < 0) end = middle;
      else if (compare > 0) start = middle + 1;
      else return middle;
    }

    // Return the index.
    return start;
  }

  get size(): number {
    return this.__items.length;
  }
}
