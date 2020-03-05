export const omit = (object, key) => {
  const remains = { ...object };
  delete remains[key];
  return remains;
};

export const arrayToObjectWithId = array => {
  const obj = new Map();
  array.forEach(e => {
    obj[e.id] = e;
  });
  return obj;
};

export const setDifference = (a, b) => new Set([...a].filter(e => !b.has(e)));
