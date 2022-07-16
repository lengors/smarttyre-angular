import { Observable } from 'rxjs';

import { Consumer } from './consumer';

export class ObservableObject<T extends any[]> {
  // List of observers.
  private readonly __observers = Array<Consumer<T>>();

  // Construct the observable object.
  readonly observable = new Observable<T>((observer) => {
    // Define the callback function.
    const callback = observer.next.bind(observer);

    // Add the callback to the list of callbacks.
    this.__observers.push(callback);

    // Return a function to unsubscribe.
    return () => {
      // Find the index of the callback
      let index = this.__observers.lastIndexOf(callback);

      // Remove the callback if found
      while (index !== -1) {
        // Remove the callbacl
        this.__observers.splice(index, 1);

        // Find the next callback
        index = this.__observers.lastIndexOf(callback);
      }
    };
  });

  // Notify all the observers.
  protected notify(args: T): void {
    this.__observers.forEach((callback) => callback(args));
  }
}
