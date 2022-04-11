Set.prototype.map = function map(fn: (value: string) => string): Set<unknown> {
  const newSet = new Set();

  for (const v of this.values()) newSet.add(fn(v));

  return newSet;
};
