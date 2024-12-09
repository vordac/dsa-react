// AdjacencyList.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const AdjacencyList = ({ adjacencyList, setAdjacencyList, setStartNode }) => {
  const addNode = () => {
    if (adjacencyList.size >= 15) {
      alert("Maximum number of nodes (15) reached.");
      return;
    }
    const node = prompt("Enter Node");
    if (node && !adjacencyList.has(node)) {
      setAdjacencyList((prevList) => {
        const newList = new Map(prevList);
        newList.set(node, new Map());
        return newList;
      });
    } else {
      alert("Node already exists or input is invalid.");
    }
  };

  const addEdge = () => {
    if (countEdges(adjacencyList) >= 14) {
      alert("Maximum number of edges (14) reached.");
      return;
    }
    const node1 = prompt("Enter Node 1");
    const node2 = prompt("Enter Node 2");
    const weight = prompt("Enter Weight");
    if (node1 && node2 && weight && node1 !== node2) {
      setAdjacencyList((prevList) => {
        const newList = new Map(prevList);
        const node1Edges = newList.get(node1) || new Map();
        node1Edges.set(node2, weight);
        newList.set(node1, node1Edges);
        return newList;
      });
    } else {
      alert("Invalid input or nodes are the same.");
    }
  };

  const removeNode = () => {
    const node = prompt("Enter Node");
    if (node) {
      setAdjacencyList((prevList) => {
        const newList = new Map(prevList);
        newList.delete(node);
        for (const [key, value] of newList) {
          value.delete(node);
        }
        return newList;
      });
    } else {
      alert("Invalid input.");
    }
  };

  const removeEdge = () => {
    const node1 = prompt("Enter Node 1");
    const node2 = prompt("Enter Node 2");
    if (node1 && node2 && node1 !== node2) {
      setAdjacencyList((prevList) => {
        const newList = new Map(prevList);
        const node1Edges = newList.get(node1);
        if (node1Edges) node1Edges.delete(node2);
        return newList;
      });
    } else {
      alert("Invalid input or nodes are the same.");
    }
  };

  const countEdges = (adjList) => {
    let edgeCount = 0;
    for (const [node, edges] of adjList) {
      edgeCount += edges.size;
    }
    return edgeCount; // Each edge is counted once
  };

  const selectStartNode = () => {
    const node = prompt("Enter Start Node");
    if (node && adjacencyList.has(node)) {
      setStartNode(node);
      alert("Start Node: " + node);
    } else {
      alert("Invalid input or node does not exist.");
    }
  };

  return (
    <div>
      {/* AdjacencyList Area */}
      <p className="text-center font-bold text-lg mb-4">Adjacency List</p>
      <div className="text-white w-full flex flex-col items-start overflow-auto rounded text-center">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-white p-2">Node</th>
              <th className="border border-white p-2">Neighbor</th>
              <th className="border border-white p-2">Weight</th>
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
      {/* Buttons Area */}
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex gap-4 flex-1">
          <button
            className="px-4 py-2 text-white rounded flex-1"
            onClick={addNode}
          >
            Add Node
          </button>
          <button
            className="px-4 py-2 text-white rounded flex-1"
            onClick={removeNode}
          >
            Remove Node
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 flex-1">
          <button
            className="px-4 py-2 text-white rounded flex-1"
            onClick={addEdge}
          >
            Add Edge
          </button>
          <button
            className="px-4 py-2 text-white rounded flex-1"
            onClick={removeEdge}
          >
            Remove Edge
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 flex-1">
          <button
            className="px-4 py-2 text-white rounded flex-1"
            onClick={selectStartNode}
          >
            Select Start Node
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdjacencyList;
