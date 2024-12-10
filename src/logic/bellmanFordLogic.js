export const calculateBellmanFord = (adjacencyList, startNode) => {
  const distances = new Map();
  const predecessors = new Map();
  const iterationDistances = []; // To store distances at each iteration
  const relaxedEdges = []; // To store relaxed edges at each iteration

  // Initialize distances and predecessors
  for (const node of adjacencyList.keys()) {
    distances.set(node, Infinity);
    predecessors.set(node, null);
  }
  distances.set(startNode, 0);

  // Relax all edges |V| - 1 times
  for (let i = 0; i < adjacencyList.size - 1; i++) {
    const currentDistances = new Map(distances); // Store distances at this iteration
    const currentRelaxedEdges = new Set(); // Store relaxed edges at this iteration
    iterationDistances.push(currentDistances);

    for (const [node, edges] of adjacencyList.entries()) {
      for (const [neighbor, weight] of edges.entries()) {
        if (distances.get(node) + parseInt(weight) < distances.get(neighbor)) {
          distances.set(neighbor, distances.get(node) + parseInt(weight));
          predecessors.set(neighbor, node);
          currentRelaxedEdges.add(`${node}-${neighbor}`);
        }
      }
    }
    relaxedEdges.push(currentRelaxedEdges);
  }

  // Check for negative weight cycles
  for (const [node, edges] of adjacencyList.entries()) {
    for (const [neighbor, weight] of edges.entries()) {
      if (distances.get(node) + parseInt(weight) < distances.get(neighbor)) {
        console.error("Graph contains a negative weight cycle");
        return null;
      }
    }
  }

  return { distances, predecessors, iterationDistances, relaxedEdges };
};
