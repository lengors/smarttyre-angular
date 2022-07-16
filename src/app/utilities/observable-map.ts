import { ObservableObject } from './observable-object';
import { Optional } from './optional';
import { Action } from './action';

// Define the ObservableList notification.
export module ObservableMap {
  export type Notification<K, V> =
    | [ReadonlyMap<K, V>, Action.Add, K]
    | [ReadonlyMap<K, V>, Action.Remove, Optional<K>];
}

// Define the ObservableMap class.
export class ObservableMap<K, V> extends ObservableObject<
  ObservableMap.Notification<K, V>
> {
  // Define the internal items map.
  private readonly __items = new Map<K, V>();

  clear(): void {
    // Notify all the callbacks.
    this.notify([this.__items, Action.Remove, undefined]);

    // Clear the list.
    this.__items.clear();
  }

  get items(): ReadonlyMap<K, V> {
    return this.__items;
  }

  remove(key: K): void {
    // Notify all the callbacks.
    this.notify([this.__items, Action.Remove, key]);

    // Remove the item from the list.
    this.__items.delete(key);
  }

  set(key: K, value: V): void {
    // Insert the item at the index.
    this.__items.set(key, value);

    // Notify all the callbacks.
    this.notify([this.__items, Action.Add, key]);
  }
}
