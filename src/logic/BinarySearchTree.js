function Node(value) {
  this.value = value;
  this.left = null;
  this.right = null;
}

function BinarySearchTree(arrs) {
  this.root = null;
  if (arrs) this.insertNodes(arrs);
}

BinarySearchTree.prototype.insert = function (value, queue) {
  var newNode = new Node(value);
  if (this.root === null) {
    this.root = newNode;
    if (queue) queue.push(value);
  } else {
    BinarySearchTree.insertNode(this.root, newNode, queue);
  }
};

BinarySearchTree.prototype.clear = function (arrs) {
  this.root = null;
};

BinarySearchTree.prototype.insertNodes = function (arrs) {
  if (arrs instanceof Array) {
    arrs.forEach((item) => this.insert(item));
  }
};

BinarySearchTree.prototype.inOrderTraverse = function (cb) {
  BinarySearchTree.inOrderTraverseNode(this.root, cb);
};
BinarySearchTree.inOrderTraverseNode = function (node, cb) {
  if (node === null) return;
  BinarySearchTree.inOrderTraverseNode(node.left, cb);
  cb(node.value);
  BinarySearchTree.inOrderTraverseNode(node.right, cb);
};

BinarySearchTree.prototype.preOrderTraverse = function (cb) {
  BinarySearchTree.preOrderTraverseNode(this.root, cb);
};
BinarySearchTree.preOrderTraverseNode = function (node, cb) {
  if (node === null) return;
  cb(node.value);
  BinarySearchTree.preOrderTraverseNode(node.left, cb);
  BinarySearchTree.preOrderTraverseNode(node.right, cb);
};

BinarySearchTree.prototype.postOrderTraverse = function (cb) {
  BinarySearchTree.postOrderTraverseNode(this.root, cb);
};
BinarySearchTree.postOrderTraverseNode = function (node, cb) {
  if (node === null) return;
  BinarySearchTree.postOrderTraverseNode(node.left, cb);
  BinarySearchTree.postOrderTraverseNode(node.right, cb);
  cb(node.value);
};

BinarySearchTree.prototype.breadthFirstTraverse = function (cb) {
  BinarySearchTree.breadthFirstTraverseNode(this.root, cb);
};

BinarySearchTree.breadthFirstTraverseNode = function (node, cb) {
  var queue = [node];
  var popNode = null;
  while (queue.length) {
    popNode = queue.shift();
    if (!popNode) break;

    cb(popNode);
    if (popNode.left) {
      queue.push(popNode.left);
    }
    if (popNode.right) {
      queue.push(popNode.right);
    }
  }
};

BinarySearchTree.prototype.getNodeCount = function () {
  return BinarySearchTree.calcNodeCount(this.root);
};

BinarySearchTree.prototype.getMin = function (cb) {
  var minNode = this.root;
  while (minNode.left) {
    minNode = minNode.left;
  }
  return minNode;
};

BinarySearchTree.prototype.getMax = function (cb) {
  var maxNode = this.root;
  while (maxNode.right) {
    maxNode = maxNode.right;
  }
  return maxNode;
};

BinarySearchTree.prototype.search = function (value) {
  return BinarySearchTree.searchNode(this.root, value);
};

BinarySearchTree.prototype.remove = function (value) {
  this.root = BinarySearchTree.removeNode(this.root, value);
};

BinarySearchTree.prototype.getHeight = function () {
  return BinarySearchTree.getNodeHeight(this.root);
};

BinarySearchTree.getNodeHeight = function (node) {
  var height = heightNode(node);
  function heightNode(node) {
    if (node === null) {
      return 0;
    } else {
      return Math.max(heightNode(node.left), heightNode(node.right)) + 1;
    }
  }
  return height;
};

BinarySearchTree.calcNodeCount = function (node) {
  if (node == null) return 0;
  return (
    1 +
    BinarySearchTree.calcNodeCount(node.left) +
    BinarySearchTree.calcNodeCount(node.right)
  );
};

BinarySearchTree.insertNode = function (node, newNode, queue) {
  if (queue) queue.push(node.value);
  if (node.value > newNode.value) {
    if (node.left === null) {
      node.left = newNode;
      if (queue) queue.push(newNode.value);
    } else {
      BinarySearchTree.insertNode(node.left, newNode, queue);
    }
  } else {
    if (node.right === null) {
      node.right = newNode;
      if (queue) queue.push(newNode.value);
    } else {
      BinarySearchTree.insertNode(node.right, newNode, queue);
    }
  }
};

BinarySearchTree.searchNode = function (node, value) {
  if (node === null) {
    return null;
  } else if (node.value === value) {
    return node;
  } else if (node.value < value) {
    return BinarySearchTree.searchNode(node.right, value);
  } else {
    return BinarySearchTree.searchNode(node.left, value);
  }
};

BinarySearchTree.searchNodeNoRecursion = function (node, value) {
  var result = null;
  while (node) {
    if (node.value === value) {
      result = node;
      break;
    } else if (node.value < value) {
      node = node.right;
    } else {
      node = node.left;
    }
  }
  return result;
};

BinarySearchTree.removeNodeBySearch = function (node, value) {
  var searchNode = node;
  var parent = null;
  var arrow = null;
  while (searchNode) {
    if (searchNode.value === value) {
      break;
    } else if (node.value < value) {
      parent = node;
      searchNode = searchNode.right;
      arrow = "right";
    } else {
      parent = searchNode;
      searchNode = searchNode.left;
      arrow = "left";
    }
  }
  if (!searchNode) return node;
  if (searchNode.left === null && searchNode.right === null) {
    parent[arrow] = null;
  } else if (searchNode.left === null) {
    parent[arrow] = searchNode.right;
  } else if (searchNode.right === null) {
    parent[arrow] = searchNode.left;
  } else {
    var minRightNode = searchNode.right;
    while (minRightNode !== null && minRightNode.left !== null) {
      minRightNode = minRightNode.left;
    }
    searchNode.value = minRightNode.value;
    searchNode.right = BinarySearchTree.removeNodeBySearch(
      searchNode.right,
      minRightNode.value
    );
  }
  return node;
};

BinarySearchTree.prototype.findAndInsert = function (value, queue) {
  var newNode = new Node(value);
  if (this.root === null) {
    this.root = newNode;
    if (queue) queue.push(value);
  } else {
    BinarySearchTree.findAndInsertNode(this.root, newNode, queue);
  }
};

BinarySearchTree.findAndInsertNode = function (node, newNode, queue) {
  if (queue) queue.push(node.value);
  if (node.value > newNode.value) {
    if (node.left === null) {
      node.left = newNode;
      if (queue) queue.push(newNode.value);
    } else {
      BinarySearchTree.findAndInsertNode(node.left, newNode, queue);
    }
  } else {
    if (node.right === null) {
      node.right = newNode;
      if (queue) queue.push(newNode.value);
    } else {
      BinarySearchTree.findAndInsertNode(node.right, newNode, queue);
    }
  }
};

BinarySearchTree.removeNode = function (node, value) {
  if (node === null) {
    return null;
  } else if (node.value < value) {
    node.right = BinarySearchTree.removeNode(node.right, value);
    return node;
  } else if (node.value > value) {
    node.left = BinarySearchTree.removeNode(node.left, value);
    return node;
  } else {
    if (node.left === null && node.right === null) {
      return null;
    } else if (node.left === null) {
      return node.right;
    } else if (node.right === null) {
      return node.left;
    } else {
      var minRightNode = node.right;
      while (minRightNode !== null && minRightNode.left !== null) {
        minRightNode = minRightNode.left;
      }
      node.value = minRightNode.value;
      node.right = BinarySearchTree.removeNode(node.right, minRightNode.value);
      return node;
    }
  }
};

BinarySearchTree.prototype.findNode = function (value, queue) {
  BinarySearchTree.findNodeRecursive(this.root, value, queue);
};

BinarySearchTree.findNodeRecursive = function (node, value, queue) {
  if (node === null) {
    return null;
  }
  queue.push(node.value);
  if (node.value === value) {
    return node;
  } else if (node.value < value) {
    return BinarySearchTree.findNodeRecursive(node.right, value, queue);
  } else {
    return BinarySearchTree.findNodeRecursive(node.left, value, queue);
  }
};

BinarySearchTree.prototype.deleteNode = function (value, queue) {
  this.root = BinarySearchTree.deleteNodeRecursive(this.root, value, queue);
};

BinarySearchTree.deleteNodeRecursive = function (node, value, queue) {
  if (node === null) {
    return null;
  }
  queue.push(node.value);
  if (node.value < value) {
    node.right = BinarySearchTree.deleteNodeRecursive(node.right, value, queue);
    return node;
  } else if (node.value > value) {
    node.left = BinarySearchTree.deleteNodeRecursive(node.left, value, queue);
    return node;
  } else {
    if (node.left === null && node.right === null) {
      return null;
    } else if (node.left === null) {
      return node.right;
    } else if (node.right === null) {
      return node.left;
    } else {
      var minRightNode = node.right;
      while (minRightNode !== null && minRightNode.left !== null) {
        minRightNode = minRightNode.left;
      }
      node.value = minRightNode.value;
      node.right = BinarySearchTree.deleteNodeRecursive(
        node.right,
        minRightNode.value,
        queue
      );
      return node;
    }
  }
};

export default BinarySearchTree;
