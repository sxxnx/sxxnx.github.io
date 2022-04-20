// Call & draw chart on  page loaded
//// SETUP
document.addEventListener('DOMContentLoaded', function(){
  d3.json('https://raw.githubusercontent.com/sxxnx/DataSetsTemp/main/sxxnx-gthb-data/dumpdata2.json').then(function(data) {
      drawChart(data);
  })
});

// Draw Chart
function drawChart(data){
  // CONST
  const langData = data;
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
      center: 100
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
  // VARS
  const colors = {
    lightPurple: '#CDB2E8',
    lightGray: '#D1CCD6'
  }
  const name = 'SK'

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
                         .style('stroke', 'none')
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

    // getRandomInt
    // function that returns a random Int
    // source : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }

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
                      .style('fill', colors.lightPurple)
                      .style('opacity', 0.5)
                      .classed('node', true)
                      .attr('class', function(){
                        //Get random number for natural animation
                        let rdmNumb = getRandomInt(11)
                        return 'circle-anim-'+ rdmNumb
                      })
                      .attr('cx', function(d){
                        let centroid = arc.centroid(d)
                        return centroid[0] + x(0.5)
                      })
                      .attr('cy', function(d){
                        let centroid = arc.centroid(d)
                          return centroid[1] + y(0.5)
                        })
                      .attr('r', function(d, i){
                        // iterate through nodeData since d is configured for pie
                        return nodeData[i].r * 1.5;
                      });
    // Animations classes
    circle.on('mouseover', function(d, i) {
      // console.log(i.index)
          d3.select(this).classed('circle-hover', true);
        })
    circle.on('mouseout', function() {
      d3.select(this).classed('circle-hover', false);
    })
  }

  // ticked
  function ticked(){
    simulation.on('tick', () => {
      circle.attr('cx', d => d.x)
            .attr('cy', d => d.y)
      });
  }

  // Text of the page
  let title = svg.append('text')
                    .text(name)
                    .classed('title-name', true)
                    .style('fill', colors.lightGray);
  // Center name title
  let titleSelect = d3.select('.title-name').node();
  let titleW = titleSelect.getBoundingClientRect().width;
  let titleH = titleSelect.getBoundingClientRect().height;
  title.attr('x', (x(0.5)) - titleW / 2)
       .attr('y', (y(0.5)));

  let subTitle = svg.append('text')
                    .text(data[0].en)
                    .classed('subtitle', true)
                    .style('fill', colors.lightGray);

  let subtitleSelect = d3.select('.subtitle').node();
  let subtitleW = subtitleSelect.getBoundingClientRect().width;
  let subtitleH = subtitleSelect.getBoundingClientRect().height;
  subTitle.attr('x', (x(0.5)) - subtitleW / 2)
          .attr('y', (y(0.5) + chartParam.margin.top * 2.5));

  // For testing purpose
  drawNodes(svg, nodes);
}
