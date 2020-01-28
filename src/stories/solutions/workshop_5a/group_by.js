// @flow

const groupBy = (arr: any[], key: string): Map<string, any[]> =>
  arr.reduce(
    (entryMap, e) => entryMap.set(e[key], [...(entryMap.get(e[key]) || []), e]),
    new Map()
  );

export default groupBy;
