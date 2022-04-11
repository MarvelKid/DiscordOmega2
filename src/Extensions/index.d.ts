declare interface Set<T> {
  map(fn: (value: string) => string): Set<unknown>;
}
