// Call & draw chart on  page loaded
//// SETUP
document.addEventListener('DOMContentLoaded', function(){
  drawChart();
});

// Draw Chart
function drawChart(){
  // CONST
  // random data
  const nodeData = initNodedArray();
  // Param of chart stored in object
  const chartParam = {
    width: Math.min(window.innerWidth),
    height: Math.min(window.innerHeight),
    margin: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
      center: 150
    }
  };

  // SVG init
  const svg = d3.select('#menuChart')
                .append('svg')
                .attr('id', 'menuSVG')
                .attr('width', chartParam.width)
                .attr('height', chartParam.height);

  // const rDisplay = simScrubber(100); // TODO DISPLAY NODES AROUND GUIDECIRCLE
                // .attr('overflow', 'hidden')
  const nodes = nodeData.map(d => Object.create(d));
                 // keyframe = keyframe_radial;
  //              .attr('id', 'menuGroup')
  //              .attr('width', chartParam.width)
  //              .attr('height', chartParam.height)
  //              // .attr('overflow', 'hidden')
  //              .classed('g-menu', true)

  // Config scales ffor chart
  const x = d3.scaleLinear()
              .domain([0,1])
              .range([chartParam.margin.left, chartParam.width - chartParam.margin.right]);
  const y = d3.scaleLinear()
              .domain([0,1])
              .range([chartParam.height - chartParam.margin.bottom, chartParam.margin.top]);
  const r = d3.scaleLinear()
              .domain([0,1])
              .range([chartParam.margin.center,
                      Math.min(chartParam.width / 2 - Math.max(chartParam.margin.left, chartParam.margin.right),
                               chartParam.height / 2 - Math.max(chartParam.margin.top, chartParam.margin.bottom))]);

  // Radius of guideCircle Inner and outer
  const innerRadius = r(0.5);
  const outerRadius = r(0.6);

  // TODO VALUES = make it invisble
  // Circle guide
  const guideCircle = svg.append('circle')
                         .attr('cx', x(0.5))
                         .attr('cy', y(0.5))
                         .attr('r', innerRadius)
                         .style('fill', 'none')
                         .style('stroke', '#888')
                         .style('stroke-dasharray', 4)


  // Simulation with radial force
  const simulation = d3.forceSimulation(nodes)
                       .force("collide", d3.forceCollide(9))
                       .force("radial", d3.forceRadial(r, x(0.5), y(0.5)))
                       .stop()
                       .tick(ticked)

  // initNodedArray()
  // Init data
  // Init array of objects [id (float), x (float), y (float), r (float)]
  // return Array of Objects
  function initNodedArray(){
    // init empty array
    let arrayOfObj = [];
    for(let idx = 0; idx < 100; idx++){
      let obj = {
        id : idx,
        x : Math.random()*100,
        y : Math.random()*100,
        r : Math.random()*30
      }
      arrayOfObj.push(obj)
    }
    return arrayOfObj;
  }

  // Draw nodes
  // args
  // svg = SVG DOM el
  // data = dataset (array of Objects)
  // return node array of obj
  function drawNodes(svg, data){
    console.log(innerRadius)

    // SVG path to display nodes around the guideCircle
    let arc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);

    // Angle 360 divided by num of nodes
    let angle = 360/nodeData.length;

    // Define pie
    let circleGuidePie = d3.pie()
                            .value(function(d, i){
                                      return angle;
                                  })
                            .padAngle(.01)
                            .sort(null);

    let circle = svg.append('g')
                    .classed('group-menu', true)
                    .selectAll('.node')
                    .data(circleGuidePie(data)).enter()
                    .append('circle')
                      .style('fill', 'red')
                      .style('stroke', 'red')
                      .classed('node', true)
                      .attr('cx', function(d){
                        let centroid = arc.centroid(d)
                        console.log(x(centroid[0]))
                        return centroid[0] + x(0.5)
                      })
                      .attr('cy', function(d){
                        let centroid = arc.centroid(d)
                          return centroid[1] + y(0.5)
                        })
                      .attr('r', function(d, i){
                        return nodeData[i].r;
                      });
  return circle;
  }

  // ticked
  function ticked(){
    simulation.on('tick', () => {
      circle.attr('cx', d => d.x)
            .attr('cy', d => d.y)
      });
  }

  // For testing purpose
  drawNodes(svg, nodes);
}
