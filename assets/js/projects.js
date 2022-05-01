// Call & draw chart on  page loaded
//// SETUP
// TODO RAW DATA
document.addEventListener('DOMContentLoaded', function(){
  d3.json('https://raw.githubusercontent.com/sxxnx/DataSetsTemp/main/sxxnx-gthb-data/dumpdata4.json').then(function(data) {
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

  // set default size of chart
  // svgEdu.attr('width', Math.min(window.innerWidth));
  //       .attr('height', Math.min(window.innerHeight));

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

  // reset cards
  // reset cards
  // args
  // isMore : bol if true : use more function
  // function resetCards(isMore) {
  //   let lastElement = Array.from(document.querySelectorAll('.project-card-pj')).pop();
  //   let idLen = lastElement.getAttribute('id').split('-').length;
  //   let id = lastElement.getAttribute('id').split('-')[idLen - 1];
  //   const numberOfElements = Object.keys(pjData).length;
  //   // Object.entries(pjData).map(function(item, i) {
  //   // if the link is to show more projects
  //   if(isMore = true) {
  //     let id = parseInt(lastId) + 1; //id of the next el
  //     let elementsLeft = numberOfElements - (parseInt(lastId) + 1) // counting from 0
  //     if(elementsLeft <= numberOfCards) {
  //       // reset
  //       document.getElementById('moreProjects').innerHTML = '';
  //       document.getElementById('moreProjects').insertAdjacentHTML(
  //         'afterbegin',
  //         '<a id="previousProject" class="previous-link">Previous projects</a>'
  //         );
  //     }
  //     // if moreelements in the list after
  //     else {
  //       // reset
  //       document.getElementById('moreProjects').innerHTML = '';
  //       document.getElementById('moreProjects').insertAdjacentHTML(
  //         'afterbegin',
  //         '<a id="previousProject" class="previous-link">Previous projects</a>'+
  //         '<a id="moreProject" class="more-link">More projects</a>'
  //         );
  //     }
  //     // reset ids - iterate through the 3 elements of the previous page and change id
  //     let newIds = [];
  //     let ref = 0;
  //
  //     for(i = id; i < id + numberOfCards; i++) {newIds.push(i)}
  //     // sort the list
  //     newIds.sort((a,b)=>b-a)
  //
  //     for(prevI = lastId; prevI > lastId - numberOfCards; prevI--) {
  //       let card = document.getElementById('projectCard-' + prevI);
  //       let img = document.getElementById('projectImage-' + prevI);
  //       let title = document.getElementById('projectCardTitle-' + prevI);
  //
  //       card.removeAttribute('id');
  //       img.removeAttribute('id');
  //       title.removeAttribute('id');
  //
  //       // set ids
  //       card.setAttribute('id', 'projectCard-' + newIds[ref]);
  //       img.setAttribute('id', 'projectImage-' + newIds[ref]);
  //       title.setAttribute('id', 'projectCardTitle-' + newIds[ref]);
  //
  //       ref = ref + 1;
  //     }
  //     // insert data
  //     insertData(id);
  //   }
  //   // else isless
  //
  // }

  // Base text init
  // document.getElementById('projectTitle').textContent = getDataLang(pjData.intro).title;
  // document.getElementById('projectDesc').textContent = getDataLang(pjData.intro).description;
  // document.getElementById('git').href = pjData.intro.git;
  // document.getElementById('demo').href = pjData.intro.demo;
  // document.getElementById('projectTechUsed').textContent = getDataLang(pjData.intro).techUsed;
  // document.getElementById('moreProjects')
  //         .insertAdjacentHTML(
  //           'afterbegin',
  //           '<a class="more-link">'+ getDataLang(pjData.intro).morelink+'</a>'
  //         );


  // // Insert projects data
  // Insert projects data
  let cardsNumb = (document.getElementsByClassName('project-card').length) - 1; // -1 because one card is for link
  Object.entries(pjData).map(function(item, i) {
    projectsData.push(item)
    if(i <= cardsNumb) {
      let dataOfItem = getDataLang(item[1]);
      console.log(dataOfItem)
      if(document.getElementById('projectCard-' + i) !== null) {
        document.getElementById('projectImage-'+ i)
                .insertAdjacentHTML(
                  'afterbegin',
                  '<img alt="'+ dataOfItem.title + ' project image" src= "assets/imgs/'+ item[1].img +'.png"/>'
                );
        document.getElementById('projectCardTitle-' + i).textContent = dataOfItem.title;
      }
    }
  })


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
  d3.selectAll('.project-card-pj').on('click', function(){
    // reset
    resetChartAndText()

    let id = d3.select(this).node().getAttribute('id').split('-')[1]

    // add text
    let dataPj= getDataLang(pjData[id]);
    document.getElementById('projectTitle').textContent = dataPj.title;
    document.getElementById('projectDesc').textContent = dataPj.description;
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

  insertRows();
  insertCardsStructure();
  insertData();

  // more link / previous link event
  // d3.selectAll('.more-link').on('click', function() {
  //
  //   // reset
  //   // resetCards(id, true)
  // })
  // // TODO PREVIOUS LINK
  // // d3.select('#moreProject#previousProject').on('click', function() {
  // //   console.log('click')
  // //
  // //   console.log(lastElement)
  //   // reset
  //   // resetCards(id, true)
  // })

}
