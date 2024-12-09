import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { hierarchy, tree } from "d3";
import BinarySearchTree from "./logic/BinarySearchTree";

const BinTree = () => {
  const navigate = useNavigate();
  const [outputStr, setOutputStr] = useState("");
  const [nodes, setNodes] = useState([4, 2, 1, 5, 8, 3]);
  const [bst, setBst] = useState(new BinarySearchTree(nodes));
  const [animationQueue, setAnimationQueue] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1000);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    setBst(new BinarySearchTree(nodes));
  }, [nodes]);

  useEffect(() => {
    if (isPlaying && animationQueue.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prevStep) => {
          if (prevStep < animationQueue.length - 1) {
            console.log("Current Step:", prevStep + 1); // Debugging statement
            return prevStep + 1;
          } else {
            clearInterval(intervalRef.current);
            setIsPlaying(false);
            return prevStep;
          }
        });
      }, speed);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed, animationQueue]);

  const navigateApp = () => {
    navigate("/");
  };

  const traverse = (traverseFunction) => {
    let queue = [];
    traverseFunction((nodeValue) => {
      queue.push(nodeValue);
    });
    console.log("Animation Queue:", queue);
    setAnimationQueue(queue);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const preOrderTraverse = () => {
    setOutputStr("");
    traverse(bst.preOrderTraverse.bind(bst));
  };

  const postOrderTraverse = () => {
    setOutputStr("");
    traverse(bst.postOrderTraverse.bind(bst));
  };

  const inOrderTraverse = () => {
    setOutputStr("");
    traverse(bst.inOrderTraverse.bind(bst));
  };

  const clearBst = () => {
    setNodes([]);
    bst.clear();
  };

  const drawVerticalTree = (nodeArrs) => {
    const bst = new BinarySearchTree(nodeArrs);
    if (!bst.root) return <span />;

    const margin = { top: 40, right: 120, bottom: 20, left: 120 };
    const width = 960 - margin.right - margin.left;
    const height = 300 - margin.top - margin.bottom;

    const treemap = tree().size([width, height]);
    let nodes = hierarchy(bst.root, (d) => {
      if (d.left || d.right) return [d.left || {}, d.right || {}];
      return [];
    });
    nodes = treemap(nodes)
      .descendants()
      .filter((e) => Object.keys(e.data).length);

    const genPaths = () => {
      return nodes.slice(1).map((data) => (
        <path
          key={data.id}
          className="link"
          d={`
          M ${data.x}, ${data.y}
          L ${data.parent.x} ${data.parent.y}
        `}
        />
      ));
    };

    const genNodes = () => {
      return nodes.map((data) => {
        const isHighlighted =
          animationQueue.includes(data.data.value) &&
          animationQueue.indexOf(data.data.value) === currentStep;

        console.log(
          `Node Value: ${data.data.value}, Highlighted: ${isHighlighted}`
        ); // Debugging statement

        return (
          <g
            className="node"
            key={data.id}
            transform={`translate(${data.x},${data.y})`}
          >
            <circle r="15" className={isHighlighted ? "highlight" : ""} />
            <text
              dy=".35em"
              textAnchor="middle"
              style={{ font: "12px sans-serif", fill: "white" }}
            >
              {data.data.value}
            </text>
          </g>
        );
      });
    };

    return (
      <svg
        width={width + margin.left + margin.right}
        height={height + margin.top + margin.bottom}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {genPaths()}
          {genNodes()}
        </g>
      </svg>
    );
  };

  const submitInputData = () => {
    setOutputStr("");
    const inputData = prompt("Enter a number to insert into the tree:");
    if (!inputData || isNaN(inputData)) {
      alert("Please enter a valid number");
      return;
    }
    const nodeValue = parseInt(inputData, 10);

    let queue = [];
    bst.findAndInsert(nodeValue, queue);

    console.log("Animation Queue:", queue);
    setAnimationQueue(queue);
    setCurrentStep(0);
    setIsPlaying(true);
    setNodes(nodes.concat(nodeValue));
  };

  const findNode = () => {
    setOutputStr("");
    const inputData = prompt("Enter a number to find in the tree:");
    if (!inputData || isNaN(inputData)) {
      alert("Please enter a valid number");
      return;
    }
    const nodeValue = parseInt(inputData, 10);

    let queue = [];
    bst.findNode(nodeValue, queue);

    console.log("Animation Queue:", queue);
    setAnimationQueue(queue);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const deleteNode = () => {
    setOutputStr("");
    const inputData = prompt("Enter a number to delete from the tree:");
    if (!inputData || isNaN(inputData)) {
      alert("Please enter a valid number");
      return;
    }
    const nodeValue = parseInt(inputData, 10);

    let queue = [];
    bst.deleteNode(nodeValue, queue);

    console.log("Animation Queue:", queue);
    setAnimationQueue(queue);
    setCurrentStep(0);
    setIsPlaying(true);
    setNodes(nodes.filter((node) => node !== nodeValue));
  };

  const handleSpeedChange = (event) => {
    setSpeed(Number(event.target.value));
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

  const reset = () => {
    setOutputStr("");
  };

  useEffect(() => {
    if (currentStep < animationQueue.length) {
      setOutputStr(
        (prevOutput) => prevOutput + animationQueue[currentStep] + " "
      );
    }
  }, [currentStep, animationQueue]);

  return (
    <div className="flex flex-col overflow-hidden-x">
      <div className="flex">
        {/* Toolbar Area */}
        <div className="flex flex-col w-[600px] p-4 gap-y-4">
          <button className="text-white rounded" onClick={submitInputData}>
            Insert Node
          </button>
          <button className="text-white rounded" onClick={findNode}>
            Find Node
          </button>
          <button className="text-white rounded" onClick={deleteNode}>
            Delete Node
          </button>
          <button className="text-white rounded" onClick={clearBst}>
            Clear Tree
          </button>
          <button className="px-4 text-white rounded " onClick={navigateApp}>
            Home
          </button>
          <p className="mt-8 font-bold text-lg">Output: {outputStr}</p>
          <div className="flex flex-col gap-y-4">
            <div>Animation Delay: {speed}ms</div>
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

        {/* Tree Area */}
        <div className="flex flex-col py-4 px-8 gap-y-4">
          <div className="appTree">{drawVerticalTree(nodes)}</div>
          <div className="flex items-center justify-center gap-x-4 mt-8">
            <button
              className="px-4 py-2 text-white rounded"
              onClick={preOrderTraverse}
            >
              Pre-order traversal
            </button>
            <button
              className="px-4 py-2 text-white rounded"
              onClick={inOrderTraverse}
            >
              In-order traversal
            </button>
            <button
              className="px-4 py-2 text-white rounded"
              onClick={postOrderTraverse}
            >
              Post-order traversal
            </button>
          </div>
          <div className="flex items-center justify-center gap-x-4 ">
            <button
              className="px-4 py-2 text-white rounded"
              onClick={resumeAnimation}
            >
              Resume
            </button>
            <button
              className="px-4 py-2 text-white rounded"
              onClick={pauseAnimation}
            >
              Pause
            </button>
            <button className="px-4 py-2 text-white rounded" onClick={goBack}>
              Go Back
            </button>
            <button
              className="px-4 py-2 text-white rounded"
              onClick={goForward}
            >
              Go Forward
            </button>
            <button className="px-4 py-2 text-white rounded" onClick={reset}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinTree;
