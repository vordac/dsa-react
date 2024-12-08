// BellmanFord.jsx
import React from "react";

const BellmanFord = ({ adjacencyList, startNode }) => {
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

  return (
    <div className="text-white w-full flex flex-col items-start overflow-auto rounded shadow-md text-center ">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-white p-2">Node</th>
            <th className="border border-white p-2">Distance</th>
            <th className="border border-white p-2">Predecessor</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(distances.entries()).map(([node, distance]) => (
            <tr key={node}>
              <td className="border border-white p-2">{node}</td>
              <td className="border border-white p-2">{distance}</td>
              <td className="border border-white p-2">
                {predecessors.get(node)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BellmanFord;
