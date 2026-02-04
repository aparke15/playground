
const depthFirstPrint = (graph: Record<string, string[]>, source: string) => {
  const visited = [source];

  while (visited.length) {
    const current = visited.pop();
    if (current) {
      console.log(current);
      graph[current].forEach((neighbor) => visited.push(neighbor));
    }
  }
};

const depthFirstRec = (graph: Record<string, string[]>, source: string) => {
  console.log(source);
  graph[source].forEach((neighbor) => depthFirstRec(graph, neighbor));
};

const breadthFirstPrint = (
  graph: Record<string, string[]>,
  source: string
) => {
  let visited = [source];

  while (visited.length) {
    const current = visited[0];
    visited = visited.slice(1, visited.length);
    console.log(current);
    graph[current].forEach((neighbor) => visited.push(neighbor));
  }
};

const hasPath = (graph: Record<string, string[]>, source: string, destination: string) => {
  let visited = [source];

  while (visited.length) {
    const current = visited[0];
    if (current === destination) {
      console.log('TRUE!');
      return true;
    }
    visited = visited.slice(1, visited.length);
    graph[current].forEach((neighbor) => visited.push(neighbor));
  }
  console.log('FALSE!');
}

export { breadthFirstPrint, depthFirstPrint, depthFirstRec, hasPath }