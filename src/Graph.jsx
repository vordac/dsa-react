import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AdjacencyList from "./AdjacencyList";
import ForceGraph2D from "react-force-graph-2d";

function Graph() {
  const navigate = useNavigate();
  const [adjacencyList, setAdjacencyList] = useState(new Map());
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    const nodes = [];
    const links = [];

    adjacencyList.forEach((edges, node) => {
      nodes.push({ id: node });
      edges.forEach((weight, neighbor) => {
        links.push({ source: node, target: neighbor, weight });
      });
    });

    setGraphData({ nodes, links });
  }, [adjacencyList]);

  const navigateApp = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex">
        {/* Adjacency List Area*/}
        <div className="flex flex-col w-[600px] p-4">
          {/* Adjacency List */}
          <div className="flex flex-col">
            <AdjacencyList
              adjacencyList={adjacencyList}
              setAdjacencyList={setAdjacencyList}
            />
          </div>
        </div>

        {/* Graph Area */}
        <div className="flex flex-col py-4 px-8">
          {/* Modelling Area */}
          <ForceGraph2D
            graphData={graphData}
            backgroundColor="white"
            width={1200}
            height={720}
            nodeLabel="id"
            nodeRelSize={6}
            linkDirectionalParticles={2}
            linkDirectionalParticleSpeed={0.01}
            linkWidth={(link) => link.weight}
            linkDirectionalArrowLength={6}
            linkDirectionalArrowRelPos={1}
            nodeAutoColorBy="group"
            linkCanvasObject={(link, ctx, globalScale) => {
              const { source, target, weight } = link;
              const midX = (source.x + target.x) / 2;
              const midY = (source.y + target.y) / 2;
              const fontSize = 18 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;

              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillStyle = "black";
              ctx.fillText(weight, midX, midY);
            }}
            linkCanvasObjectMode={() => "after"}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.id;
              const fontSize = 16 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              const textWidth = ctx.measureText(label).width;
              const bckgDimensions = [textWidth, fontSize].map(
                (n) => n + fontSize * 0.2
              ); // some padding

              // Set the background color
              ctx.fillStyle = "rgba(255, 255, 255, 0.1)"; // Blue with some transparency

              // Calculate the node's radius
              const radius = Math.sqrt(node.val) * 4; // Adjust the multiplier as needed

              // Draw the background rectangle to fully fill the node
              ctx.beginPath();
              ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
              ctx.fill();

              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillStyle = "black";
              ctx.fillText(label, node.x, node.y);

              node.__bckgDimensions = bckgDimensions;
            }}
            nodeCanvasObjectMode={() => "after"}
          />

          {/* Buttons Area */}
          <div className="flex gap-x-4 items-center justify-center mt-4">
            <button className="px-4 py-2 text-white rounded">Start</button>
            <button className="px-4 py-2 text-white rounded">Stop</button>
            <button className="px-4 py-2 text-white rounded">Back</button>
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

export default Graph;
