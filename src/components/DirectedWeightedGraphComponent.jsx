import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdjacencyListComponent from "./AdjacencyListComponent";
import BellmanFordComponent from "./BellmanFordComponent";
import CanvasComponent from "./CanvasComponent";
import { calculateBellmanFord } from "../logic/bellmanFordLogic";

function DirectedWeightedGraphComponent() {
  const navigate = useNavigate();
  const [adjacencyList, setAdjacencyList] = useState(new Map());
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [startNode, setStartNode] = useState(null);
  const [distances, setDistances] = useState(new Map());
  const [predecessors, setPredecessors] = useState(new Map());
  const [currentStep, setCurrentStep] = useState(0);
  const [animationQueue, setAnimationQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [iterationDistances, setIterationDistances] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    const nodes = [];
    const links = [];

    adjacencyList.forEach((edges, node) => {
      nodes.push({ id: node, x: Math.random() * 900, y: Math.random() * 480 });
      edges.forEach((weight, neighbor) => {
        links.push({ source: node, target: neighbor, weight });
      });
    });

    setGraphData({ nodes, links });
  }, [adjacencyList]);

  useEffect(() => {
    if (isPlaying && currentStep < animationQueue.length) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prevStep) => prevStep + 1);
      }, speed);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed, currentStep, animationQueue]);

  const navigateApp = () => {
    navigate("/");
  };

  const runBellmanFord = () => {
    if (!startNode) {
      alert("Будь ласка, виберіть стартовий вузол.");
      return;
    }

    const result = calculateBellmanFord(adjacencyList, startNode);
    if (result) {
      setDistances(result.distances);
      setPredecessors(result.predecessors);
      setIterationDistances(result.iterationDistances);

      const queue = [];

      for (let i = 0; i < adjacencyList.size - 1; i++) {
        for (const [node, edges] of adjacencyList.entries()) {
          for (const [neighbor, weight] of edges.entries()) {
            if (result.relaxedEdges[i].has(`${node}-${neighbor}`)) {
              queue.push([node, neighbor, weight]);
            }
          }
        }
      }

      setAnimationQueue(queue);
      setCurrentStep(0);
      setIsPlaying(true);
    }
  };

  const pauseAnimation = () => {
    setIsPlaying(false);
  };

  const resumeAnimation = () => {
    setIsPlaying(true);
  };

  const goBack = () => {
    setIsPlaying(false);
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const goForward = () => {
    setIsPlaying(false);
    setCurrentStep((prevStep) =>
      Math.min(prevStep + 1, animationQueue.length - 1)
    );
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const onReset = () => {
    setAdjacencyList(new Map());
    setGraphData({ nodes: [], links: [] });
    setStartNode(null);
    setDistances(new Map());
    setPredecessors(new Map());
    setCurrentStep(0);
    setAnimationQueue([]);
    setIsPlaying(false);
    setIterationDistances([]);
  };

  const handleSpeedChange = (event) => {
    setSpeed(Number(event.target.value));
  };

  return (
    <div className="flex flex-col overflow-hidden-x">
      <div className="flex">
        <div className="flex flex-col w-[600px] p-4">
          <div className="flex flex-col">
            <AdjacencyListComponent
              adjacencyList={adjacencyList}
              setAdjacencyList={setAdjacencyList}
              setStartNode={setStartNode}
            />
          </div>
        </div>

        <div className="flex flex-col py-4 px-8">
          <CanvasComponent
            graphData={graphData}
            setGraphData={setGraphData}
            currentStep={currentStep}
            animationQueue={animationQueue}
            isPlaying={isPlaying}
          />

          <div className="flex flex-col gap-y-4 items-center justify-center mt-4">
            <div className="flex gap-x-4">
              <button
                className="px-4 py-2 text-white rounded"
                onClick={runBellmanFord}
              >
                Запустити
              </button>
              <button
                className="px-4 py-2 text-white rounded"
                onClick={onReset}
              >
                Скинути
              </button>
              <button
                className="px-4 py-2 text-white rounded"
                onClick={navigateApp}
              >
                Додому
              </button>
            </div>
            <div className="flex gap-x-4">
              <button
                className="px-4 py-2 text-white rounded"
                onClick={resumeAnimation}
              >
                Продовжити
              </button>
              <button
                className="px-4 py-2 text-white rounded"
                onClick={pauseAnimation}
              >
                Пауза
              </button>
              <button className="px-4 py-2 text-white rounded" onClick={goBack}>
                Назад
              </button>
              <button
                className="px-4 py-2 text-white rounded"
                onClick={goForward}
              >
                Вперед
              </button>
              <button
                className="px-4 py-2 text-white rounded"
                onClick={resetAnimation}
              >
                Скинути
              </button>
            </div>
            <div className="flex flex-col gap-y-4">
              <div>Затримка анімації: {speed}мс</div>
              <label>
                <input
                  className="slider"
                  type="range"
                  min="100"
                  max="3000"
                  value={speed}
                  onChange={handleSpeedChange}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="p-8">
        <p className="text-center font-bold text-lg m-4">Беллман-Форд</p>

        <BellmanFordComponent
          distances={distances}
          predecessors={predecessors}
          currentStep={currentStep}
          iterationDistances={iterationDistances}
        />
      </div>
    </div>
  );
}

export default DirectedWeightedGraphComponent;
