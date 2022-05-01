// Call & draw chart on  page loaded
//// SETUP
// TODO RAW DATA
document.addEventListener('DOMContentLoaded', function(){
  d3.json('https://raw.githubusercontent.com/sxxnx/sxxnx.github.io/main/assets/data/projects.json').then(function(data) {
      drawPJChart(data);
  })
});

// Draw Chart
function drawPJChart(data) {
  // CONST
  const pjData = data[0];
  let projectsData = [];
  const pjParentBlock = d3.select('#techChart');

  // // SVG init
  const svgPj = pjParentBlock.append('svg').attr('id', 'pJSVG').classed('pj-chart', true);

  // COLORS
  const colorsPj = ['#CDB2E8','#9563C6','#8971A2','#D1CCD6'];
  const numberOfCards = 3; // number of cards displayed on page

  // LANG VAR
  let lang = 'en'; // default is english TODO const

  // FUNCTIONS
  // getDataLang
  // returns data in selected language
  // args
  // d data set array of objs with index
  // lang stng lang value
  function getDataLang(d) {
    switch (lang) {
      case 'fr': return d.lang.fr
      break;
      case 'jp': return d.lang.jp
      break;
      default: return d.lang.en //default en
    }
  }

  // reset text and chart
  // reset the chart and text of the page
  function resetChartAndText(){
    // reset text
    document.getElementById('projectTitle').textContent = '';
    document.getElementById('projectDesc').textContent = '';
    document.getElementById('git').href = '';
    document.getElementById('demo').href = '';

    // reset chart
    document.getElementById('groupBars').innerHTML = '';
    document.getElementById('groupLabels').innerHTML = '';
  }

  // insertRows()
  // insert rows depending on the size on the dataSet
  function insertRows() {
    let rowN = 0;
    Object.entries(pjData).map(function(item, i) {
      if(i%2 == 0) {
        document.getElementById('projectsDisplay')
                .insertAdjacentHTML(
                  'beforeend',
                  '<div id="projectsRow-'+ rowN +'"class="projects-row"/>'
                );
        rowN = rowN + 1;
      }
    })
  }

  // insertCardsStructure()
  // insert html code for cards depending on the dataset
  function insertCardsStructure() {
    let rows = document.getElementsByClassName('projects-row');
    for(r = 0; r < rows.length; r++) {
      // append 2 cards for each row
      document.getElementById('projectsRow-' + r).insertAdjacentHTML(
        'afterbegin',
        '<div class="project-card card-empty"><div id="projectImage" class="project-image"></div><h5 id="projectTitle" class="project-card-title"/></div>'
      );
      document.getElementById('projectsRow-' + r).insertAdjacentHTML(
        'afterbegin',
        '<div class="project-card card-empty"><div class="project-image"></div><h5 class="project-card-title"/></div>'
      );
    }
  }

  // insertData
  // insert data in cards
  // args
  function insertData() {
    // get all cards elements
    let cards  = document.getElementsByClassName('project-card');
    let titles = document.getElementsByClassName('project-card-title');
    let images = document.getElementsByClassName('project-image');
    // iterate through data and set ids
    Object.entries(pjData).map(function(item, i) {
      // remove the empty card class if an element is in the list
      cards[i].classList.remove('card-empty');
      cards[i].setAttribute('id', 'projectCard-' + i);
      let thisCard = document.getElementById('projectCard-' + i);
      let childrenEl = thisCard.childNodes;
      // set data
      childrenEl[0].innerHTML = '<img alt="'+ item[1].lang.en.title + ' project image" src= "assets/imgs/'+ item[1].img +'.png"/>';
      childrenEl[1].innerHTML = item[1].lang.en.title;
    });
  }

  insertRows();
  insertCardsStructure();
  insertData();

  // Draw chart
  const w = d3.select('#pJSVG').node().getBoundingClientRect().width;
  const h = d3.select('#pJSVG').node().getBoundingClientRect().height;
  const offset = 40;
  const x = d3.scaleLinear();
  const y = d3.scaleBand();

  x.range([0, w]).domain([0,100]);

  // const xGroup = svgPj.append('g').classed('x-axis', true).attr('id', 'xAxis');
  const groupRect = svgPj.append('g').classed('group-bar-tech', true).attr('id', 'groupBars');
  const groupLabels = svgPj.append('g').classed('group-label', true).attr('id', 'groupLabels');

  // set event click
  d3.selectAll('.project-card').on('click', function(){
    // reset
    resetChartAndText()

    let id = d3.select(this).node().getAttribute('id').split('-')[1]

    // add text
    let dataPj= pjData[id];
    document.getElementById('projectTitle').textContent = dataPj.lang.en.title;
    document.getElementById('projectDesc').textContent = dataPj.lang.en.description;
    document.getElementById('git').href = dataPj.git;
    document.getElementById('demo').href = dataPj.demo;

    let dataBars = []
    // make array of obj for the dataset because i was too tired to write a good json file apparently
    Object.entries(pjData[id].tech).map(function(item, i) {
      dataBars.push(item[1])
    })

    // y range config here because of data set up
    y.range([0, h]).domain(dataBars.map(d =>d.name));

    groupRect.selectAll('.bar-tech')
             .data(dataBars)
             .enter()
             .append('rect')
             .classed('bar-tech', true)
             .attr('id', function(d, i) {return 'tech-'+ i})
             .attr('y', d => y(d.name))
             .style('fill', function(d, i) { return colorsPj[i] })
             .attr('height', y.bandwidth())
             .transition() // animation when loaded (cannot be seen exept on refresh but still cool)
             .duration(2000)
             .attr('width', d => x(d.percentage))
             .attr('x', function(d, i){return x(0)})

    groupLabels.selectAll('.label')
               .data(dataBars)
               .enter()
               .append('text')
               .attr("text-anchor", "end")
               .attr('class', 'project-label')
               .attr('x', w- offset - 10)
               .attr('y', d => y(d.name) + y.bandwidth() / 2)
               .attr('dy', '0.35em')
               .text(d => d.name);
  })
  d3.selectAll('.project-card').on('mouseover', function(){
     d3.select(this).classed('card-hover', true);
  });
  d3.selectAll('.project-card').on('mouseout', function(){
     d3.select(this).classed('card-hover', false);
  });
}
