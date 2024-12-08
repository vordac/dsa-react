// bellmanFord.js
export const bellmanFord = (adjacencyList, startNode) => {
  const distances = new Map();
  const predecessors = new Map();

  // Инициализация расстояний
  for (const node of adjacencyList.keys()) {
    distances.set(node, Infinity);
    predecessors.set(node, null);
  }
  distances.set(startNode, 0);

  // Релаксация ребер
  for (let i = 0; i < adjacencyList.size - 1; i++) {
    for (const [node, edges] of adjacencyList.entries()) {
      for (const [neighbor, weight] of edges.entries()) {
        if (distances.get(node) + parseInt(weight) < distances.get(neighbor)) {
          distances.set(neighbor, distances.get(node) + parseInt(weight));
          predecessors.set(neighbor, node);
        }
      }
    }
  }

  // Проверка на отрицательные циклы
  for (const [node, edges] of adjacencyList.entries()) {
    for (const [neighbor, weight] of edges.entries()) {
      if (distances.get(node) + parseInt(weight) < distances.get(neighbor)) {
        console.error("Graph contains a negative weight cycle");
        return null;
      }
    }
  }

  return { distances, predecessors };
};
