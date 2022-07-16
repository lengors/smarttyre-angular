import { ObservableObject } from './observable-object';
import { Optional } from './optional';
import { Action } from './action';

// Define the ObservableList notification.
export module ObservableList {
  export type Notification<T> =
    | [ReadonlyArray<T>, Action.Add, number]
    | [ReadonlyArray<T>, Action.Remove, Optional<number>];
}

// Define the ObservableList class.
export class ObservableList<T> extends ObservableObject<
  ObservableList.Notification<T>
> {
  // Define the internal items array.
  private readonly __items = Array<T>();

  add(item: T): void {
    // Add the item to the list.
    this.__items.push(item);

    // Notify all the callbacks.
    this.notify([this.__items, Action.Add, this.__items.length - 1]);
  }

  clear(): void {
    // Notify all the callbacks.
    this.notify([this.__items, Action.Remove, undefined]);

    // Clear the list.
    this.__items.splice(0, this.__items.length);
  }

  insert(index: number, item: T): void {
    // Insert the item at the index.
    this.__items.splice(index, 0, item);

    // Notify all the callbacks.
    this.notify([this.__items, Action.Add, index]);
  }

  get items(): ReadonlyArray<T> {
    return this.__items;
  }

  remove(item: T): void {
    // Find the index of the item.
    let index = this.__items.lastIndexOf(item);

    // Remove the item if found.
    while (index !== -1) {
      // Notify all the callbacks.
      this.notify([this.__items, Action.Remove, index]);

      // Remove the item
      this.__items.splice(index, 1);

      // Find the next item
      index = this.__items.lastIndexOf(item);
    }
  }
}
