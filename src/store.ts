import { StoreUpdater } from "./types";

export class GenericStateStore<T extends object> {
  private state: T;
  private listeners = new Set<() => void>();

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  setState(updater: StoreUpdater<T>): void {
    const nextState: T =
      typeof updater === 'function'
        ? (updater as (current: T) => T)(this.state)
        : ({ ...this.state, ...(updater as Partial<T>) } as T);

    this.state = nextState;
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }
}
