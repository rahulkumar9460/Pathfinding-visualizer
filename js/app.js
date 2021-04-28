let app = (function () {
  const initializeTheBoard = () => Grid.initTheGrid(57, 23);
  let dir = 4;

  const findPath = (algo) => {
    let pathAll = [];
    let path = [];
    let visitedPath = [];
    let animatePath = [];
    if(algo == "AStar")
      pathAll = AStar.findPath(Grid.outputGridAs2DArray());
    else if(algo == "Dijkstra")
      pathAll = Dijkstra.findPath(Grid.outputGridAs2DArray()); 
    else if(algo == "BFS")
      pathAll = BFS.findPath(Grid.outputGridAs2DArray());
    else
      pathAll = AStar.findPath(Grid.outputGridAs2DArray()); 
    
    path = pathAll[0];
    visitedPath = pathAll[1];
    let n2 = path.length;
    let n1 = visitedPath.length;
    animatePath = visitedPath.concat(path);

    if (n1 != 0) {
      Grid.walkOverPath1(animatePath, n1);
      if (n2 == 0) {
        showNoPathFound();
      }
    } else {
      showNoPathFound();
    }
    
  };
  
  const setDiaMovement = () => {
    Grid.clearPath();
    if (dir == 4){
      dir = 8;
      document.getElementById("setDia").innerHTML = "Disable Dia Movement";
    } else {
      dir = 4;
      document.getElementById("setDia").innerHTML = "Enable Dia Movement";
    }
    AStar.setNoOfDirections(dir);
    AStar.setDirection(dir);
    Dijkstra.setNoOfDirections(dir);
    Dijkstra.setDirection(dir);
    BFS.setNoOfDirections(dir);
    BFS.setDirection(dir);
  };


  
  const findPathWithCustomSpeed = (speed, algo) => {
    switch (speed) {
      case 'Fast':
        Grid.walkFast();
        findPath(algo);
        console.log(`fast`);
        break;
      case 'Medium':
      default:
        Grid.walkMedium();
        findPath(algo);
        console.log(`Medium`);
        break;
      case 'Slow':
        Grid.walkSlow();
        findPath(algo);
        console.log(`Slow`);
        break;
    }
  };
  
  const startSearch = () => {
    Grid.clearPath();
    let algo = document.getElementById("algorithm").value;
    let visSpeed = document.getElementById("speed").value;
    
    app.findPathWithCustomSpeed(visSpeed, algo);
  };
  
  const showFooter = () => document.querySelector('.footer').style.display = "block";

  const launch = () => {
    initializeTheBoard();
    showFooter();
  };

  
  

  const endFirstOverLay = () => {
    document.getElementById('overlay-1').style.display = 'none';
    randomizeEffect();
  };

  const hideInstructions = () => document.querySelector('.instructions').style.display = "none";
  
  const hideNoPathFound = () => document.querySelector('.noPathFound').style.display = "none";

  const showNoPathFound = () => document.querySelector('.noPathFound').style.display = "block";

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  /**
   * Public Interface
   */
  return {
    launch: launch,
    findPath: findPath,
    findPathWithCustomSpeed: findPathWithCustomSpeed,
    startSearch: startSearch,
    setDiaMovement: setDiaMovement,
    hideInstructions: hideInstructions,
    hideNoPathFound: hideNoPathFound,
  };
})();

// Type-Writer Effect
class TxtType {
  constructor(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
  }
  tick() {
    let i = this.loopNum % this.toRotate.length;
    let fullTxt = this.toRotate[i];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';
    let that = this;
    let delta = 200 - Math.random() * 100;
    if (this.isDeleting) {
      delta /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }

    setTimeout(() => that.tick(), delta / 2);
  }
}
