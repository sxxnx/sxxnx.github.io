// Call & draw chart on  page loaded
//// SETUP
// TODO RAW DATA
document.addEventListener('DOMContentLoaded', function(){
  d3.json('https://raw.githubusercontent.com/sxxnx/DataSetsTemp/main/sxxnx-gthb-data/dumpdata4.json').then(function(data) {
      drawPJChart(data);
  })
});

// Draw Chart
function drawPJChart(data){
  // CONST
  const pjData = data[0];
  const pjParentBlock = d3.select('#techChart');
  // // SVG init
  const svgPj = pjParentBlock.append('svg').attr('id', 'pJSVG').classed('pj-chart', true);
  // COLORS
  const colorsPj = {
    lightPurple: '#CDB2E8',
    vividPurple: '#9563C6',
    purple: '#8971A2',
    lightGray: '#D1CCD6'
  }
  const numberOfElements = pjData.length;

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

  // Base text init
  console.log(pjData.intro)
  document.getElementById('projectTitle').textContent = getDataLang(pjData.intro).title;
  document.getElementById('projectDesc').textContent = getDataLang(pjData.intro).description;
  document.getElementById('git').href = pjData.intro.git;
  document.getElementById('demo').href = pjData.intro.demo;
  document.getElementById('projectTechUsed').textContent = getDataLang(pjData.intro).techUsed;
  document.getElementById('moreProjects')
          .insertAdjacentHTML(
            'afterbegin',
            '<a class="more-link">'+ getDataLang(pjData.intro).morelink+'</a>'
          );

  // Insert projects data
  let displayedCards = document.getElementsByClassName('project-card');
  console.log(displayedCards);


}
