import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AdjacencyListComponent from "./AdjacencyListComponent";
import BellmanFordComponent from "./BellmanFordComponent";
import CanvasComponent from "./CanvasComponent";

function DirectedWeightedGraphComponent() {
  const navigate = useNavigate();
  const [adjacencyList, setAdjacencyList] = useState(new Map());
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [startNode, setStartNode] = useState(null);
  const [shortestPaths, setShortestPaths] = useState(null);

  useEffect(() => {
    const nodes = [];
    const links = [];

    adjacencyList.forEach((edges, node) => {
      nodes.push({ id: node, x: Math.random() * 900, y: Math.random() * 480 }); // Random positions for nodes
      edges.forEach((weight, neighbor) => {
        links.push({ source: node, target: neighbor, weight });
      });
    });

    setGraphData({ nodes, links });
  }, [adjacencyList]);

  const navigateApp = () => {
    navigate("/");
  };

  const runBellmanFord = () => {
    if (!startNode) {
      alert("Please select a start node.");
      return;
    }
    setShortestPaths(startNode);
  };

  const onReset = () => {
    setStartNode(null);
    setShortestPaths(null);
  };

  return (
    <div className="flex flex-col overflow-hidden-x">
      <div className="flex">
        {/* Adjacency List Area*/}
        <div className="flex flex-col w-[600px] p-4">
          {/* Adjacency List */}
          <div className="flex flex-col">
            <AdjacencyListComponent
              adjacencyList={adjacencyList}
              setAdjacencyList={setAdjacencyList}
              setStartNode={setStartNode}
            />
            <p className="text-center font-bold text-lg m-4">Bellman-Ford</p>

            {shortestPaths && (
              <BellmanFordComponent
                adjacencyList={adjacencyList}
                startNode={startNode}
              />
            )}
          </div>
        </div>

        {/* Graph Area */}
        <div className="flex flex-col py-4 px-8">
          {/* Modelling Area */}
          <CanvasComponent graphData={graphData} setGraphData={setGraphData} />

          {/* Buttons Area */}
          <div className="flex gap-x-4 items-center justify-center mt-4">
            <button
              className="px-4 py-2 text-white rounded"
              onClick={runBellmanFord}
            >
              Run
            </button>
            <button className="px-4 py-2 text-white rounded" onClick={onReset}>
              Reset
            </button>
            <button
              className="px-4 py-2 text-white rounded"
              onClick={navigateApp}
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DirectedWeightedGraphComponent;
