export const omit = (object, key) => {
  const remains = { ...object };
  delete remains[key];
  return remains;
};
