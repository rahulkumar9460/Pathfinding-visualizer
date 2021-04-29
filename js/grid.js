let Grid = (function () {
    const ZERO = 0;
    let grid;
    let width, height;
    let check = 0;
    let check1 = 0;
    let disableEditing = false;             //will allow user to creat obstacle and to change the position of start and end node
    let visualizationSpeed = 60;
    let sizeOfNode = 25;                    //25*25 of square
    let mapEnum = {
      empty: ZERO,
      start: 1,
      goal: 2,
      obstacle: 3,
    };

    const initTheGrid = (wid, hei) => {
      grid = document.querySelector('.grid');
      grid.addEventListener('click', function (action) {
        if (action.target.classList.contains('node') && !disableEditing) {
          onNodeClicked(action);
        }
      });
      grid.addEventListener('mousedown', function (action) {
        if(check == 1) {
          check1 = 1;
        } 
      });
      grid.addEventListener('mouseup', function(action) {
        if(check == 1) {
          check1 = 0;
        }  
      });
      grid.addEventListener('mouseover', function(action) {
        if (action.target.classList.contains('node') && !disableEditing) {
          onNodeOver(action);
        }
      });
      (width = wid), (height = hei);
      renderTheGrid();
      //randomizeObstacles();
    };
    
    //function for changing position of start node and end node and to creat obstacle elements
    const onNodeClicked = action => {
      let node = action.target;
      let typeOfNode = getTypeOfNode(node);
      let selected = getSelected();
  
      // If there's a selected node..
      if (selected) {
        unselectSelectedNode();
        if (isStartNode(node) || isTargetNode(node)) {
          if (selected !== node) {
            console.log('Selected Node used');
            selectNode(node);
          }
        } else {
          setTypeToNode(getTypeOfNode(selected), node);
          setTypeToNode('empty', selected);
        }
        return;
      }
  
      // Check for node type
      if (typeOfNode === 'start' || typeOfNode === 'goal') {
        selectNode(node);
      } else if (typeOfNode === 'obstacle') {
        setTypeToNode('empty', node);
      } else {
        setTypeToNode('obstacle', node);
      }
    };

    const onNodeOver = action => {
      let node = action.target;
      let typeofNode = getTypeOfNode(node);
      
      if(check == 1 && check1 == 1) {
        if(typeofNode !== 'start' && typeofNode !== 'goal') {
          if(typeofNode === 'empty') {
            setTypeToNode('obstacle', node);
          }
        }
      }
      return;
    };
  
    const renderTheGrid = () => {
      for (let row = ZERO; row < height; row++) {
        for (let col = ZERO; col < width; col++) {
          let node = document.createElement('div');
          node.className = 'node empty';
          node.id = `${col}-${row}`;
          node.style.width = `${sizeOfNode}px`;
          node.style.height = `${sizeOfNode}px`;
          node.style.top = `${row * sizeOfNode + row + 1}px`;
          node.style.left = `${col * sizeOfNode + col + 1}px`;
          grid.appendChild(node);
        }
      }
      grid.style.width = `${width * sizeOfNode + width + 1}px`;
      grid.style.height = `${height * sizeOfNode + height + 1}px`;
  
      setTypeToNode(
        'start',
        getNodeByPosition(13, 11),
      );
      setTypeToNode(
        'goal',
        getNodeByPosition(43, 11),
      );
    };
  
    const outputGridAs2DArray = () => {
      let array = [];
      for (let row = ZERO; row < height; row++) {
        array[row] = [];
        for (let col = ZERO; col < width; col++) {
          array[row][col] = mapEnum[getTypeOfNode(getNodeByPosition(col, row))];
        }
      }
      return array;
    };
  
    const walkOverPath = path => {
      if (disableEditing) return;
      disableEditing = true;
      clearPath();
      unselectSelectedNode();
  
      path.forEach((pathElement, index) => {
        (function (i) {
          setTimeout(function () {
            setTypeToNode('path', getNodeByPosition(pathElement.x, pathElement.y));
            if (path.length - 1 === i) disableEditing = false;
          }, (i + 1) * visualizationSpeed);
        })(index);
      });
    };
    
    const walkOverPath1 = (path, n1) => {
      if (disableEditing) return;
      disableEditing = true;
      clearPath();
      unselectSelectedNode();
  
      path.forEach((pathElement, index) => {
        (function (i) {
          setTimeout(function () {
            if (i < n1) {
              setTypeToNode('visitedPath', getNodeByPosition(pathElement.x, pathElement.y));
            } else {
              setTypeToNode('path', getNodeByPosition(pathElement.x, pathElement.y));
            }
            
            if (path.length - 1 === i) disableEditing = false;
          }, (i + 1) * visualizationSpeed);
        })(index);
      });
    };

    const clearGridObstaclesAndPaths = () => {
      if (disableEditing) return;
      clearPath();
      grid.querySelectorAll(':not(.start):not(.goal)').forEach(n => {
        setNode('empty', n);
      });
    };
    
    const setNode = (typeOfNode, node) => {
      node.className = 'node ' + typeOfNode;
    };

    const randomizeObstacles = () => {
      if (disableEditing) return;
      clearGridObstaclesAndPaths();
      let noOfObstacles = (width * height) / 5;
  
      for (let obstacleNo = ZERO; obstacleNo < noOfObstacles; obstacleNo++) {
        let node = getNodeByPosition(
          getRandomNumber(ZERO, width - 1),
          getRandomNumber(ZERO, height - 1),
        );
        if (!isStartNode(node) && !isTargetNode(node)) {
          setTypeToNode('obstacle', node);
        }
      }
    };
  
    const setTypeToNode = (typeOfNode, node) => {
      if (typeOfNode === 'path') {
        node.classList.add('path');
        return;
      } else if (typeOfNode === 'visitedpath') {
        node.classList.add('visitedPath');
        return;
      }
      node.className = 'node ' + typeOfNode;
    };

    const selectObstacles = () => (check = 1);
  
    const isStartNode = node => node.classList.contains('start');
  
    const isTargetNode = node => node.classList.contains('goal');
  
    const getTypeOfNode = node => node.classList.item(1);
  
    const getNodeByPosition = (x, y) => document.getElementById(x + '-' + y);
  
    const clearPath = () => {
      if(disableEditing)return;
      grid.querySelectorAll('.path').forEach(nodeToClear => {
        nodeToClear.classList.remove('path');
      });
      grid.querySelectorAll('.visitedPath').forEach(nodeToClear => {
        nodeToClear.classList.remove('visitedPath');
      });
    };
  
    const selectNode = node => {
      node.classList.add('selected');
    };
  
    const unselectSelectedNode = () => {
      let node = getSelected();
      if (node) {
        node.classList.remove('selected');
      }
    };
  
    const getSelected = () => grid.querySelector('.selected');
  
    const walkFast = () => (visualizationSpeed = 40);
  
    const walkMedium = () => (visualizationSpeed = 80);
  
    const walkSlow = () => (visualizationSpeed = 140);

    const getRandomNumber = (from, to) => Math.floor(Math.random() * (to - from + 1)) + from;
  
    // Public interface
    // Syntax: publicNameOfTheFunction (name to call it) : localFunctionName (actual name)
    return {
      initTheGrid: initTheGrid,
      walkOverPath: walkOverPath,
      walkOverPath1: walkOverPath1,
      randomizeObstacles: randomizeObstacles,
      clearGridObstaclesAndPaths: clearGridObstaclesAndPaths,
      clearPath: clearPath,
      outputGridAs2DArray: outputGridAs2DArray,
      visualizationSpeed: visualizationSpeed,
      walkFast: walkFast,
      walkMedium: walkMedium,
      walkSlow: walkSlow,
      selectObstacles: selectObstacles,
      clearPath: clearPath,
    };
  })();

  