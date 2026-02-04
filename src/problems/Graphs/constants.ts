
export const graph = {
  a: ["b", "c"],
  b: ["d"],
  c: ["e"],
  d: ["f"],
  e: [],
  f: [],
};

export const pathGraph = {
  f: ["g", "i"],
  g: ["h"],
  h: [],
  i: ["g", "k"],
  j: ["i"],
  k: [],
};

export const coolGraph = {
  'a': ['b','c'],
  'b': ['a'],
  'c': ['a'],
  'd': ['e','f'],
  'e': ['d','f'],
  'f': ['e','f']
}