import React from "react";
import { useNavigate } from "react-router-dom";
import {
  addNode,
  addEdge,
  removeNode,
  removeEdge,
  countEdges,
  selectStartNode,
} from "../logic/adjacencyListLogic";

const AdjacencyListComponent = ({
  adjacencyList,
  setAdjacencyList,
  setStartNode,
}) => {
  return (
    <div>
      <p className="text-center font-bold text-lg mb-4">Список суміжності</p>
      <div className="text-white w-full flex flex-col items-start overflow-auto rounded text-center">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-white p-2">Вузол</th>
              <th className="border border-white p-2">Сусід</th>
              <th className="border border-white p-2">Вага</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(adjacencyList.entries()).map(([node, edges]) => (
              <React.Fragment key={node}>
                <tr>
                  <td
                    className="border border-white p-2"
                    rowSpan={edges.size + 1}
                  >
                    {node}
                  </td>
                </tr>
                {Array.from(edges.entries()).map(
                  ([neighbor, weight], index) => (
                    <tr key={index}>
                      <td className="border border-white p-2">{neighbor}</td>
                      <td className="border border-white p-2">{weight}</td>
                    </tr>
                  )
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex gap-4 flex-1">
          <button
            className="px-4 py-2 text-white rounded flex-1"
            onClick={() => addNode(adjacencyList, setAdjacencyList)}
          >
            Додати вузол
          </button>
          <button
            className="px-4 py-2 text-white rounded flex-1"
            onClick={() => removeNode(adjacencyList, setAdjacencyList)}
          >
            Видалити вузол
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 flex-1">
          <button
            className="px-4 py-2 text-white rounded flex-1"
            onClick={() => addEdge(adjacencyList, setAdjacencyList)}
          >
            Додати ребро
          </button>
          <button
            className="px-4 py-2 text-white rounded flex-1"
            onClick={() => removeEdge(adjacencyList, setAdjacencyList)}
          >
            Видалити ребро
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 flex-1">
          <button
            className="px-4 py-2 text-white rounded flex-1"
            onClick={() => selectStartNode(adjacencyList, setStartNode)}
          >
            Вибрати стартовий вузол
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdjacencyListComponent;
