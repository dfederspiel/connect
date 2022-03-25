export interface IDataContext<T> {
  getAll(): Promise<T[]>;
  getById(id: number): Promise<T | null>;
  post(item: T): Promise<T>;
}

export interface IPubSub {
  publish(triggerName: string, payload: any): Promise<void>;
  subscribe(trigger: string, onMessage: any, options?: unknown): Promise<number>;
  asyncIterator<T>(triggers: string | string[]): AsyncIterator<T, any, undefined>;
}
