export interface IDataContext<T> {
  getAll(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  post(item: T): Promise<T>;
  //delete(id: string): Promise<T>;
  //put(item: T): Promise<T>;
}
