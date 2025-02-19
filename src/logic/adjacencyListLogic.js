export const addNode = (adjacencyList, setAdjacencyList) => {
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

export const addEdge = (adjacencyList, setAdjacencyList) => {
  const node1 = prompt("Enter Node 1");
  const node2 = prompt("Enter Node 2");
  const weight = prompt("Enter Weight");

  const weightPattern = /^\d+$/;
  if (!weightPattern.test(weight)) {
    alert("Weight must be a number.");
    return;
  }

  if (node1 && node2 && weight && node1 !== node2) {
    if (!adjacencyList.has(node1) || !adjacencyList.has(node2)) {
      alert("Node or nodes are not in the list.");
      return;
    }

    const node1Edges = adjacencyList.get(node1);
    if (node1Edges.size >= 14) {
      alert(`Maximum number of edges (14) from node ${node1} reached.`);
      return;
    }

    setAdjacencyList((prevList) => {
      const newList = new Map(prevList);
      const newNode1Edges = new Map(node1Edges);
      newNode1Edges.set(node2, weight);
      newList.set(node1, newNode1Edges);
      return newList;
    });
  } else {
    alert("Invalid input or nodes are the same.");
  }
};

export const removeNode = (adjacencyList, setAdjacencyList) => {
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

export const removeEdge = (adjacencyList, setAdjacencyList) => {
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

export const countEdges = (adjList) => {
  let edgeCount = 0;
  for (const [node, edges] of adjList) {
    edgeCount += edges.size;
  }
  return edgeCount;
};

export const selectStartNode = (adjacencyList, setStartNode) => {
  const node = prompt("Enter Start Node");
  if (node && adjacencyList.has(node)) {
    setStartNode(node);
    alert("Start Node: " + node);
  } else {
    alert("Invalid input or node does not exist.");
  }
};
