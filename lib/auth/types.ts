export interface IDataContext<T> {
  getAll(): Promise<T[]>;
  getById(id: number): Promise<T | null>;
  post(item: T): Promise<T>;
  //delete(id: string): Promise<T>;
  //put(item: T): Promise<T>;
}

export interface IPubSub {
  publish(triggerName: string, payload: any): Promise<void>;
  asyncIterator<T>(triggers: string | string[]): AsyncIterator<T, any, undefined>;
}
