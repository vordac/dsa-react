import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { hierarchy, tree } from "d3";
import BinarySearchTree from "../logic/binarySearchTreeLogic";

const BinarySearchTreeComponent = () => {
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
            console.log("Current Step:", prevStep + 1);
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
        );

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
    const inputData = prompt("Введіть число для вставки в дерево:");
    if (!inputData || isNaN(inputData)) {
      alert("Будь ласка, введіть дійсне число");
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
    const inputData = prompt("Введіть число для пошуку в дереві:");
    if (!inputData || isNaN(inputData)) {
      alert("Будь ласка, введіть дійсне число");
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
    const inputData = prompt("Введіть число для видалення з дерева:");
    if (!inputData || isNaN(inputData)) {
      alert("Будь ласка, введіть дійсне число");
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
        <div className="flex flex-col w-[600px] p-4 gap-y-4">
          <button className="text-white rounded" onClick={submitInputData}>
            Вставити вузол
          </button>
          <button className="text-white rounded" onClick={findNode}>
            Знайти вузол
          </button>
          <button className="text-white rounded" onClick={deleteNode}>
            Видалити вузол
          </button>
          <button className="text-white rounded" onClick={clearBst}>
            Очистити дерево
          </button>
          <button className="px-4 text-white rounded " onClick={navigateApp}>
            Додому
          </button>
          <p className="mt-8 font-bold text-lg">Вивід: {outputStr}</p>
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

        <div className="flex flex-col py-4 px-8 gap-y-4">
          <div className="appTree">{drawVerticalTree(nodes)}</div>
          <div className="flex items-center justify-center gap-x-4 mt-8">
            <button
              className="px-4 py-2 text-white rounded"
              onClick={preOrderTraverse}
            >
              Префіксний обхід
            </button>
            <button
              className="px-4 py-2 text-white rounded"
              onClick={inOrderTraverse}
            >
              Інфіксний обхід
            </button>
            <button
              className="px-4 py-2 text-white rounded"
              onClick={postOrderTraverse}
            >
              Постфіксний обхід
            </button>
          </div>
          <div className="flex items-center justify-center gap-x-4 ">
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
            <button className="px-4 py-2 text-white rounded" onClick={reset}>
              Скинути
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinarySearchTreeComponent;
