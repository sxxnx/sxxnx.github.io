// Call & draw chart on  page loaded
//// SETUP
// TODO RAW DATA
document.addEventListener('DOMContentLoaded', function(){
  d3.json('https://raw.githubusercontent.com/sxxnx/DataSetsTemp/main/sxxnx-gthb-data/dumpdata3.json').then(function(data) {
      drawEduChart(data);
  })
});

// TODO screamer random circle click
// Draw Chart
function drawEduChart(data){
  // CONST
  const eduData = data;
  const eduParentBlock = d3.select('#eduXPChartInfo');
  const eduInfoBlock = d3.select('#eduXPInfo');
  const eduXPChartBlock = d3.select('#eduXPChart');
  const eduXPChartMargin = 30;
  const eduChartdefaultW = eduParentBlock.node().getBoundingClientRect().width - eduXPChartMargin;
  // // SVG init
  const svgEdu = eduXPChartBlock.append('svg').attr('id', 'eduXPSVG');
  // COLORS
  const colorsEdu = {
    lightPurple: '#CDB2E8',
    lightGray: '#D1CCD6',
    white: '#FFF'
  }
  const numberOfElements = eduData.length;

  // Don't display the info block by default
  eduInfoBlock.style('display', 'none');

  // set default size of chart
  svgEdu.attr('width', eduChartdefaultW)
        .attr('height', Math.min(window.innerHeight));

  // Var of the size
  let chartW = svgEdu.node().getBoundingClientRect().width;
  let chartH = svgEdu.node().getBoundingClientRect().height;


  // Array of coords for the Chart
  let nodeCoords = coordsToObject(
    getCoords(numberOfElements, 3, chartW, eduXPChartMargin),
    getCoords(numberOfElements, 4, chartH, eduXPChartMargin));
  console.log(nodeCoords);
  // getCoords()
  // return an Array of numbers (x coords) /!\ sorted every d (col or row)
  // args
  // points: int number of points
  // d: int number of cols or rows
  // s : float width or height of chart
  // m : int margin of chart
  function getCoords(points, d, s, m) {
    let coords = [];
    let tmpArr = [];
    let numPointsOfPart = Math.ceil(points/d);
    let dIndex = 1; // index of col or row
    for(let nodeIndex=0; nodeIndex<points; nodeIndex++) {
      // get random number between min (margin) & max (size - margin)
      let point =  Math.floor(Math.random() * ((s - m) - m + 1) + m);
      if(dIndex == numPointsOfPart) {
        dIndex = 1; // reset col or row
        tmpArr.push(point)
        tmpArr.sort(function(a, b){return a-b}); // sort the row / col
        tmpArr.map(d => coords.push(d));
        tmpArr = []; // reset tempArray
      }
      else if (nodeIndex == points - 1) {
        coords.push(point)
      }
      else {
        dIndex = dIndex + 1;
        tmpArr.push(point)
      }
    }
    return coords;
  }

  //coordsToObject()
  // return Array object of coords (duple of float)
  // args
  // arr1 - arr2 Array of numbers being the same length
  function coordsToObject(arr1, arr2) {
    let coords = [];
    let obj = {};
    arr1.map(function(d, i) {
      let obj = {
        x : d,
        y : arr2[i]
      }
      coords.push(obj)
    })
    return coords;
  }

  // const r = d3.scaleLinear()
  //             .domain([0,1])
  //             .range([chartParam.margin.center,
  //                     Math.min(chartParam.width / 2 - Math.max(chartParam.margin.left, chartParam.margin.right),
  //                              chartParam.height / 2 - Math.max(chartParam.margin.top, chartParam.margin.bottom))]);

}
