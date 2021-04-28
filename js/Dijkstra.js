let Dijkstra = (function () {
  class gridNode {
    constructor(x, y, obstacle = false) {
      (this.x = x), (this.y = y);
      (this.f = 0);
      this.obstacle = obstacle;
      this.closed = false;                        //visited or not
      this.parent = null;
    }
  }

  let nodes = [];
  let startNode = null;
  let goalNode = null;
  let visitedPath = [];

  let open = [];
  let gridWidth, gridHeight;
  let noOfDirections = 4;
  let directionX = [1, 0, -1, 0];
  let directionY = [0, -1, 0, 1];
  
  const setNoOfDirections = dir => (noOfDirections = dir);

  const setDirection = dir => {
    if(dir == 4) {
      directionX = [1, 0, -1, 0];
      directionY = [0, -1, 0, 1];
    }else {
      directionX = [1, 1, 0, -1, -1, -1, 0, 1];
      directionY = [0, -1, -1, -1, 0, 1, 1, 1];
    }
  };

  const initGrid = grid => {
    gridHeight = grid.length;
    gridWidth = grid[0].length;

    for (let row = 0; row < gridHeight; row++) {
      nodes[row] = [];
      for (let col = 0; col < gridWidth; col++) {
        let nodeState = grid[row][col];
        let node = new gridNode(col, row, nodeState === 3);
        if (nodeState === 1) startNode = node;
        else if (nodeState === 2) goalNode = node;
        nodes[row][col] = node;
      }
    }
  };

  const findPath = grid => {
    initGrid(grid);
    return runDijkstra();
  };

  const runDijkstra = () => {
    open = [startNode];

    while (open.length > 0) {
      let current = getNodeWithLowestFCost();
      if(current != startNode && current != goalNode)visitedPath.push(current);
      open.splice(open.indexOf(current), 1);           //deleting current node from open array
      current.closed = true;                           //Marking visited
      if (current === goalNode) return [getPath(current), visitedPath];
      let neighbors = getNeighbors(current);

      neighbors.forEach(neighbor => {
        if (neighbor.closed || neighbor.obstacle) return;
        if (open.includes(neighbor)) {
          if (current.f + 1 >= neighbor.f) {
            return;
          }
        } else {
          open.unshift(neighbor);
        }
        neighbor.parent = current;
        neighbor.f = current.f + 1;
      });
    }

    // no-path founded..
    return [[], visitedPath];
  };

  const getNodeWithLowestFCost = () => {
    let closestNode = open[0];
    for (let i = 1; i < open.length; i++) {
      if (open[i].f < closestNode.f) {
        closestNode = open[i];
      }
    }
    return closestNode;
  };

  const getNeighbors = currentNode => {
    let neighbors = [];
    for (let k = 0; k < noOfDirections; k++) {
      let newX = currentNode.x + directionX[k];
      let newY = currentNode.y + directionY[k];
      if (isValidNode(newX, newY)) {
        neighbors.push(nodes[newY][newX]);
      }
    }
    return neighbors;
  };

  const isValidNode = (x, y) => x >= 0 && x < gridWidth && y >= 0 && y < gridHeight;

  const getPath = node => {
    let path = [];
    while (node.parent !== null) {
      path.unshift({ x: node.x, y: node.y });
      node = node.parent;
    }
    return path;
  };

  const heuristicCostUsingManhattanDistance = node =>
    Math.abs(node.x - goalNode.x) + Math.abs(node.y - goalNode.y);

  return {
    findPath: findPath,
    setDirection: setDirection,
    setNoOfDirections: setNoOfDirections,
  };
})();
