import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hierarchy, tree } from "d3";
import "./App.css";
import BinarySearchTree from "./logic/BinarySearchTree";

const BinTree = () => {
  const navigate = useNavigate();
  const [inputData, setInputData] = useState("");
  const [outputStr, setOutputStr] = useState("");
  const [nodes, setNodes] = useState([4, 2, 1, 5, 8, 3]);
  const [bst, setBst] = useState(new BinarySearchTree(nodes));

  useEffect(() => {
    setBst(new BinarySearchTree(nodes));
  }, [nodes]);

  const navigateApp = () => {
    navigate("/");
  };

  const preOrderTraverse = () => {
    let str = "";
    bst.preOrderTraverse((nodeValue) => (str += nodeValue + " "));
    setOutputStr(str);
  };

  const postOrderTraverse = () => {
    let str = "";
    bst.postOrderTraverse((nodeValue) => (str += nodeValue + " "));
    setOutputStr(str);
  };

  const inOrderTraverse = () => {
    let str = "";
    bst.inOrderTraverse((nodeValue) => (str += nodeValue + " "));
    setOutputStr(str);
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
      return nodes.map((data) => (
        <g
          className="node"
          key={data.id}
          transform={`translate(${data.x},${data.y})`}
        >
          <circle r="15" />
          <text
            dy=".35em"
            textAnchor="middle"
            style={{ font: "12px sans-serif", fill: "white" }}
          >
            {data.data.value}
          </text>
        </g>
      ));
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

  const changeInputData = (value) => {
    setInputData(value);
  };

  const submitInputData = () => {
    if (!inputData) {
      alert("Please enter data");
      return;
    }
    const splitNodes = inputData
      .split(",")
      .map((data) => {
        if (data && !Number.isNaN(+data)) return +data;
        return null;
      })
      .filter((data) => data !== null);

    bst.insertNodes(splitNodes);
    setNodes(nodes.concat(splitNodes));
    setInputData("");
  };

  return (
    <div className="BinTree">
      <div className="container">
        <div className="toolbar">
          <div className="toolbarLine">
            <input
              className="appInput"
              type="text"
              placeholder="Separate numbers with"
              value={inputData}
              onChange={(evt) => changeInputData(evt.target.value)}
            />
            <button onClick={submitInputData}>Insert Node</button>
            <button onClick={clearBst}>Clear data</button>
          </div>
          <div className="toolbarLine">
            <button onClick={preOrderTraverse}>Pre-order traversal</button>
            <button onClick={inOrderTraverse}>In-order traversal</button>
            <button onClick={postOrderTraverse}>Post-order traversal</button>
          </div>
        </div>
        <div className="appTree">{drawVerticalTree(nodes)}</div>
        <button className="px-4 py-2 text-white rounded" onClick={navigateApp}>
          Home
        </button>
      </div>
      <div className="console">
        {outputStr}
        {outputStr && (
          <span
            style={{ paddingLeft: "10px", cursor: "pointer" }}
            onClick={() => setOutputStr("")}
          >
            Clear data
          </span>
        )}
      </div>
    </div>
  );
};

export default BinTree;
