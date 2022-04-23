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
  const circleR = 60;
  const eduChartdefaultW = eduParentBlock.node().getBoundingClientRect().width - eduXPChartMargin;
  // // SVG init
  const svgEdu = eduXPChartBlock.append('svg').attr('id', 'eduXPSVG');
  // COLORS
  const colorsEdu = {
    lightPurple: '#CDB2E8',
    purple: '#8971A2',
    lightGray: '#D1CCD6',
    white: '#FFF'
  }
  const numberOfElements = eduData.length;

  // Don't display the info block by default
  eduInfoBlock.style('display', 'none');

  // set default size of chart
  svgEdu.attr('width', eduChartdefaultW)
        .attr('height', Math.min(window.innerHeight));

  const groupLinesEduXP = svgEdu.append('g').classed('group-lines-eduXP', true).attr('id', 'groupLinesEduXP');
  const groupCirclesEduXP = svgEdu.append('g').classed('group-circle-eduXP', true).attr('id', 'groupCirclesEduXP');
  const groupTextEduXP = svgEdu.append('g').attr('id', 'groupTextEduXP');

  // Var of the size
  let chartW = svgEdu.node().getBoundingClientRect().width;
  let chartH = svgEdu.node().getBoundingClientRect().height;

  // LANG VAR
  let lang = 'en'; // default is english TODO const


  // Array of coords for the Chart
  let nodeCoords = coordsToObject(
    getCoords(numberOfElements, 3, chartW, eduXPChartMargin),
    getCoords(numberOfElements, 4, chartH, circleR));

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
    let interval = s / d;
    let previousPoint = 0;
    let dIndex = 1; // index of col or row
    for(let nodeIndex=0; nodeIndex<points; nodeIndex++) {
      // get random number between min (margin) & max (interval + margin)
      let point = Math.floor(Math.random() * ((interval + m) - m + 1) + m);
      // prevent points override with a 15 margin mini
      if(previousPoint + circleR > point ) {
        point = previousPoint + m;
      }
      // prevent override out of edge
      if(point + circleR > s) {
        point = s - circleR*nodeIndex
      }
      if(point >= s - circleR) {
        point = point - circleR
      }
      // fix first point to same coords
      if(nodeIndex == 0) {
        point = (m *2)+ 10;
      }
      if(dIndex == numPointsOfPart) {
        dIndex = 1; // reset col or row
        // m = m + interval;
        interval = interval + interval
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
      previousPoint = point;
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


  // draw circles
  let circleEduXP = groupCirclesEduXP.selectAll('circle')
                                     .data(eduData).enter()
                                     .append('circle')
                                     .style('fill', colorsEdu.purple)
                                     .classed('node', true)
                                     .attr('class', function(d, i) {
                                       return 'circle-edu-' + i;
                                     })
                                     .attr('id', function(d, i) {
                                       return 'circleEdu-' +i;
                                     })
                                     .attr('cx', function(d, i) {
                                       if(i + 1 == eduData.length) {
                                         // fix last point coords to be the same everytime
                                         return (chartW / 2) - circleR
                                       }
                                       // // avoid overflow
                                       // else if(nodeCoords[i].x > (chartW - eduXPChartMargin - circleR)) {
                                       //   return chartW - eduXPChartMargin - circleR;
                                       // }
                                       // else if(nodeCoords[i].x < (circleR + 5)) {
                                       //   return circleR + 10; // min size
                                       // }
                                       else {
                                         // iterate through nodeCoords since d is configured for json data
                                         return nodeCoords[i].x;
                                       }
                                     })
                                     .attr('cy', function(d, i) {
                                       if(i + 1 == eduData.length) {
                                         // fix last point coords to be the same everytime
                                         return (chartH - (circleR + eduXPChartMargin))
                                       }
                                       // else if(nodeCoords[i].y < (circleR + 5)) {
                                       //   return circleR + 10; // min size
                                       // }
                                       // avoid overflow
                                       // else if(nodeCoords[i].y > (chartH - eduXPChartMargin - circleR)) {
                                       //   return chartH - eduXPChartMargin - circleR;
                                       // }
                                       else {
                                         // iterate through nodeCoords since d is configured for json data
                                         return nodeCoords[i].y;
                                       }
                                     })
                                    .attr('r', circleR);
  // Add text
  let eduXPTitles = groupTextEduXP.selectAll('text')
                                  .data(eduData)
                                  .enter()
                                  .append('text')
                                  .text(function(d) {
                                    switch (lang) {
                                      case 'fr':
                                        return d.lang.fr.title
                                        break;
                                      case 'jp':
                                        return d.lang.jp.title
                                        break;
                                      default:
                                        return d.lang.en.title //default en
                                    }
                                  })
                                  .classed('edu-text-title', true)
                                  .attr('id', d => {
                                    return 'eduTitle-'+ d.id
                                  })
                                  .style('fill', colorsEdu.lightGray);
  // Place text
  groupTextEduXP.selectAll('text')
                .attr('x', function(d, i) {
                  let circleEduX = groupCirclesEduXP.select('#circleEdu-' +i).node().getAttribute('cx');
                  let textEduW = d3.select(this).node().getBoundingClientRect().width;
                  if(i == 0) {
                    // handle exception for first element
                    return circleEduX- (textEduW / 4)
                  }
                  return circleEduX - (textEduW / 2)
                })
                .attr('y', function(d, i) {
                  let circleEduY = groupCirclesEduXP.select('#circleEdu-' +i).node().getAttribute('cy');
                  return circleEduY
                })
  // Add lines
  let eduLines = groupLinesEduXP.selectAll('path')
                 .data(eduData)
                 .enter()
                 .append('path')
                 .attr('id', function(d, i) {
                   return 'lineFrom-' + i + 'To' + (i + 1);
                 })
                 .classed('edu-line', true)
                 .style('stroke', colorsEdu.lightGray)
                 .attr('d', function(d, i) {
                   if(i+1 < eduData.length) {
                     let x1 = groupCirclesEduXP.select('#circleEdu-' +i).node().getAttribute('cx');
                     let y1 = groupCirclesEduXP.select('#circleEdu-' +i).node().getAttribute('cy');
                     let x2 = groupCirclesEduXP.select('#circleEdu-' + (i+1)).node().getAttribute('cx');
                     let y2 = groupCirclesEduXP.select('#circleEdu-' + (i+1)).node().getAttribute('cy');
                     return 'M' + x1 +' ' + y1 + ' L' + x2 + ' ' + y2;
                   }
                 })

                                  // selectedTextMenu.attr('x', item[1].x - (item[1].textW / 2))
                                  //                 .attr('y', item[1].y);
                                  // svg.selectAll('#menu-text-0').node().getBoundingClientRect().width
}
