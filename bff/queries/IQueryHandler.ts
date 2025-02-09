export interface IQueryHander<TQuery, TResult> {
  handle(command: TQuery): Promise<TResult>;
}
