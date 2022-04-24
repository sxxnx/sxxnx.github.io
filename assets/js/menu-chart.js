// Call & draw chart on  page loaded
//// SETUP
// TODO RAW DATA
document.addEventListener('DOMContentLoaded', function(){
  d3.json('https://raw.githubusercontent.com/sxxnx/DataSetsTemp/main/sxxnx-gthb-data/dumpdata2.json').then(function(data) {
      drawChart(data);
  })
});

// TODO screamer random circle click
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

  // VARS
  const colors = {
    lightPurple: '#CDB2E8',
    lightGray: '#D1CCD6',
    white: '#FFF'
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
                         .style('stroke', 'none');

  // Simulation with radial force
  const simulation = d3.forceSimulation(nodes)
                       .force("collide", d3.forceCollide(9))
                       .force("radial", d3.forceRadial(r, x(0.5), y(0.5)))
                       .stop()
                       .tick(ticked);

  const groupMenu = svg.append('g').classed('group-menu', true).attr('id', 'group-menu');
  const groupText = svg.append('g').attr('id', 'group-text');


  // LANG VAR
  let lang = 'en'; // default is english TODO const

  // initNodedArray()
  // Init data
  // Init array of objects [id (float), x (float), y (float), r (float)]
  // return Array of Objects
  function initNodedArray() {
    // init empty array
    let arrayOfObj = [];
    for(let idx = 0; idx < 100; idx++) {
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

  // getMultiLangText
  // returns Array of objects
  // args
  // startId : int, index of the first el
  // endId : int, index of the last el
  function getMultiLangText(startId, endId) {
    let arrayOfTextObj = []
    for(let indexOfArray = startId; indexOfArray <= endId; indexOfArray++){
      switch (lang) {
        case 'fr':
          arrayOfTextObj.push(langData[indexOfArray].fr)
          break;
        case 'jp':
          arrayOfTextObj.push(langData[indexOfArray].jp)
          break;
        default:
          arrayOfTextObj.push(langData[indexOfArray].en) //default en
      }
    }
    return arrayOfTextObj;
  }

  // appendMultipleText
  // append multiple svg text depeding on the size of the dataset (array)
  // args
  // dataArray: Array of strings
  // class: string - class to append to the element
  function appendMultipleText(dataArray, classText) {
    dataArray.map(function(d, i) {
      groupText.append('text')
          .text(dataArray[i])
          .classed(classText, true)
          .attr('id', 'menu-text-'+ i)
          .style('fill', colors.lightGray);
    })
  }

  // Draw nodes
  // args
  // svg = SVG DOM el
  // data = dataset (array of Objects)
  // return node array of obj
  function drawNodes(svg, data) {

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

    let circle = groupMenu.selectAll('.node')
                          .data(circleGuidePie(data)).enter()
                          .append('circle')
                          .style('fill', colors.lightPurple)
                          .style('opacity', 0.5)
                          .attr('class', function(d, i) {
                          // index being the 3 categories of menu
                            if(i == 99 || i == 34 || i == 68) {
                              return 'circle-menu';
                            }
                           else {
                            //Get random number for natural animation
                            let rdmNumb = getRandomInt(11)
                            return 'circle-anim-'+ rdmNumb
                          }
                        })
                        // .attr('id', function(d, i) {
                        //   return 'circle-' + i;
                        // })
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



    d3.selectAll('.circle-menu').attr('r', 50);

    //Append ID to menu circles
    svg.selectAll('.circle-menu')
       .attr('id', function(d,i) {
         return 'circle-menu-' + i
       })

    // Animations classes
    circle.on('mouseover', function() {
      d3.select(this).classed('circle-hover', true);
      if(d3.select(this).attr('class') == 'circle-menu circle-hover'){
        let circleID = d3.select(this).node().getAttribute('id');
        let id = circleID.split('-')[circleID.split('-').length - 1]
        d3.select('#menu-text-' + id).style('opacity', '1');
        d3.select(this).attr('r', 100);
        d3.select(this).style('opacity', 0.5);
      }
    })
    circle.on('mouseout', function() {
      d3.select(this).classed('circle-hover', false);
      if(d3.select(this).attr('class') == 'circle-menu'){
        // reset display
        let circleID = d3.select(this).node().getAttribute('id');
        let id = circleID.split('-')[circleID.split('-').length - 1]
        d3.select('#menu-text-' + id).style('opacity', '0');
        // Reset r
        d3.select(this).attr('r', 50);
        d3.select(this).style('opacity', 0.8);
      }
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
                    .text(langData[0].en)
                    .classed('subtitle', true)
                    .style('fill', colors.white);

  let menuText = getMultiLangText(1, 3);
  appendMultipleText(menuText, 'menu-text');

  let subtitleSelect = d3.select('.subtitle').node();
  let subtitleW = subtitleSelect.getBoundingClientRect().width;
  let subtitleH = subtitleSelect.getBoundingClientRect().height;
  subTitle.attr('x', (x(0.5)) - subtitleW / 2)
          .attr('y', (y(0.5) + chartParam.margin.top * 2.5));


  // For testing purpose
  drawNodes(svg, nodes);


  // Place menu elements
  // /!\ IDS and classes are hardcoded
  let textParam = {
    menu1: {
      x: d3.select('#circle-menu-0').node().getAttribute('cx'),
      y: d3.select('#circle-menu-0').node().getAttribute('cy'),
      textW: svg.selectAll('#menu-text-0').node().getBoundingClientRect().width,
      textH: svg.selectAll('#menu-text-0').node().getBoundingClientRect().height
    },
    menu2: {
      x: d3.select('#circle-menu-1').node().getAttribute('cx'),
      y: d3.select('#circle-menu-1').node().getAttribute('cy'),
      textW: svg.selectAll('#menu-text-1').node().getBoundingClientRect().width,
      textH: svg.selectAll('#menu-text-1').node().getBoundingClientRect().height
    },
    menu3: {
      x: d3.select('#circle-menu-2').node().getAttribute('cx'),
      y: d3.select('#circle-menu-2').node().getAttribute('cy'),
      textW: svg.selectAll('#menu-text-2').node().getBoundingClientRect().width,
      textH: svg.selectAll('#menu-text-2').node().getBoundingClientRect().height
    }
  }
  Object.entries(textParam).map(function(item, i) {
    let selectedTextMenu = svg.select('#menu-text-'+i);
    selectedTextMenu.attr('x', item[1].x - (item[1].textW / 2))
                    .attr('y', item[1].y);
  })


  // Links
  d3.select('#circle-menu-0').on('click', function(event, d) {
    window.location.href = './education-experience.html';
  });
  d3.select('#circle-menu-1').on('click', function(event, d) {
    window.location.href = './projects.html';
  });
  d3.select('#circle-menu-2').on('click', function(event, d) {
    window.location.href = './about.html';
  });

}
