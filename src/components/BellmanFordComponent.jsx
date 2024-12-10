import React from "react";
import { calculateBellmanFord } from "../logic/bellmanFordLogic";

const BellmanFordComponent = ({ adjacencyList, startNode }) => {
  const { distances, predecessors } = calculateBellmanFord(
    adjacencyList,
    startNode
  );

  if (!distances) {
    return <div>Graph contains a negative weight cycle</div>;
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

export default BellmanFordComponent;
