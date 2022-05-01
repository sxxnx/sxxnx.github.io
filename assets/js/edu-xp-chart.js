// Call & draw chart on  page loaded
//// SETUP
// TODO RAW DATA
document.addEventListener('DOMContentLoaded', function(){
  d3.json('https://raw.githubusercontent.com/sxxnx/sxxnx.github.io/main/assets/data/edu-xp-data.json').then(function(data) {
      drawEduChart(data);
  })
});

// Draw Chart
function drawEduChart(data){
  // CONST
  const eduData = data;
  const eduParentBlock = d3.select('#eduXPChartInfo');
  const eduInfoBlock = d3.select('#eduXPInfo');
  const eduXPChartBlock = d3.select('#eduXPChart');
  const eduXPChartMargin = 30;
  const circleR = 60;
  const eduChartdefaultW = document.getElementById('eduXPChart').offsetWidth;
  // // SVG init
  const svgEdu = eduXPChartBlock.append('svg').attr('id', 'eduXPSVG').classed('svg-edu-chart', true);
  // COLORS
  const colorsEdu = {
    lightPurple: '#CDB2E8',
    purple: '#8971A2',
    lightGray: '#D1CCD6',
    gray: '#A6A6A6',
    white: '#FFF'
  }
  const numberOfElements = eduData.length;
  // minimum Coord for circle placement
  const minCoord = (eduXPChartMargin*2);

  // set default size of chart
  svgEdu.attr('width', eduChartdefaultW - eduXPChartMargin*2)
        .attr('height', Math.min(window.innerHeight));

  const groupLinesEduXP = svgEdu.append('g').classed('group-lines-eduXP', true).attr('id', 'groupLinesEduXP');
  const groupCirclesEduXP = svgEdu.append('g').classed('group-circle-eduXP', true).attr('id', 'groupCirclesEduXP');
  const groupTextEduXP = svgEdu.append('g').attr('id', 'groupTextEduXP').classed('group-edu-text', true);

  // Var of the size
  let chartW = svgEdu.node().getBoundingClientRect().width;
  let chartH = svgEdu.node().getBoundingClientRect().height;

  let maxCoord = chartH - eduXPChartMargin;

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
        point = previousPoint + circleR + m*2;
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
        // point = (m *2)+ 10;
        point = circleR * 1.8
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

  // drawCircles
  // draw circles of the chart
  // g : g svg element group
  // data : dataset
  function drawCircles(g, data) {
    return (
      g.selectAll('circle')
       .data(data).enter()
       .append('circle')
       .style('fill', colorsEdu.purple)
       .classed('circle-edu', true)
       .attr('class', function(d, i) {
         return 'circle-edu-' + i;
       })
       .attr('id', function(d, i) {
         return 'circleEdu-' +i;
       })
       .attr('cx', function(d, i) {
         if(i + 1 == data.length) {
           // fix last point coords to be the same everytime
           return (chartW / 2) - circleR;
         }
         else {
           // iterate through nodeCoords since d is configured for json data
           return nodeCoords[i].x;
         }
       })
       .attr('cy', function(d, i) {
         if(i + 1 == data.length) {
           // fix last point coords to be the same everytime
           return (chartH - (circleR + eduXPChartMargin))
         }
         else {
           // iterate through nodeCoords since d is configured for json data
           return nodeCoords[i].y;
         }
       })
       .attr('r', circleR)
    );
  }

  // appendEduText()
  // aoppend text
  // g : g svg element group
  // data : dataset
  function appendEduText(g, data) {
    return(
      g.selectAll('text')
       .data(data)
       .enter()
       .append('text')
       .text(function(d) {
         switch (lang) {
           case 'fr': return d.lang.fr.title
           break;
           case 'jp': return d.lang.jp.title
           break;
           default: return d.lang.en.title //default en
         }
       })
       .classed('edu-text-title', true)
       .attr('id', d => {
         return 'eduTitle-'+ d.id
       })
       .style('fill', colorsEdu.lightGray)
    )
  }

  // placeEduText()
  // place text depending on circles
  // g : g svg element group
  // data : dataset
  function placeEduText(g) {
    g.selectAll('text')
     .attr('x', function(d, i) {
       let circleEduX = groupCirclesEduXP.select('#circleEdu-' +i).node().getAttribute('cx');
       let textEduW = d3.select(this).node().getBoundingClientRect().width;
       if(i == 0) {
         // handle exception for first element
         return circleEduX- (textEduW / 4)
       }
       // prevent overflow negative
       if( (i < eduData.length - 1) && ((circleEduX - (textEduW / 2)) < minCoord)) {
         // 5 being margin
         return circleEduX - circleR + 5
       }
       return circleEduX - (textEduW / 2)
     })
     .attr('y', function(d, i) {
       let circleEduY = groupCirclesEduXP.select('#circleEdu-' +i).node().getAttribute('cy');
       return circleEduY
     })
  }


  // drawLines
  // draw lines of the chart
  // g : g svg element group
  // data : dataset
  // groupC : g svg group of circles
  // attrCircle : strg ID of the circles ('.' or '#' needed)
  function drawLines(g, data, groupC, attrCircle) {
    g.selectAll('path')
     .data(data)
     .enter()
     .append('path')
     .attr('id', function(d, i) {
       return 'lineFrom-' + i + 'To' + (i + 1);
     })
     .classed('edu-line', true)
     .style('stroke', colorsEdu.lightGray)
     .attr('d', function(d, i) {
       if(i+1 < data.length) {
         let x1 = groupC.select(attrCircle +i).node().getAttribute('cx');
         let y1 = groupC.select(attrCircle +i).node().getAttribute('cy');
         let x2 = groupC.select(attrCircle + (i+1)).node().getAttribute('cx');
         let y2 = groupC.select(attrCircle + (i+1)).node().getAttribute('cy');
         return 'M' + x1 +' ' + y1 + ' L' + x2 + ' ' + y2;
       }
     })
  }
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


  // draw circles
  let circleEduXP = drawCircles(groupCirclesEduXP, eduData);
  // Add text
  let eduXPTitles = appendEduText(groupTextEduXP, eduData);
  // Place text
  placeEduText(groupTextEduXP)
  // Add lines
  drawLines(groupLinesEduXP, eduData, groupCirclesEduXP, '#circleEdu-');

  // HOVER
  // Animations classes /!\ functions are not used here bc it would reset the chart el values and it is not the point
  // let circlesEdu = groupCirclesEduXP.selectAll('circles')
  circleEduXP.on('click', function(event, d) {
    document.getElementById('eduXPChart').style.display = 'inline-block';
    document.getElementById('eduXPPlace').innerHTML = ''
    document.getElementById('eduXPTime').innerHTML = ''
    document.getElementById('eduXPInfoTitle').innerHTML = ''
    document.getElementById('eduXPInfoText').innerHTML = ''
    // hide all texts & set opacity to circles & lines
    d3.selectAll('.edu-text-title').style('opacity', 0)
    d3.select(this).classed('circle-hover', true);
    groupCirclesEduXP.selectAll('circle').style('opacity', 0.2);
    d3.select(this).style('opacity', 1);
    groupLinesEduXP.style('opacity', 0.2);

    // highlight hovered circle
    d3.select(this).attr('r', circleR * 1.8);
    d3.select(this).style('fill', colorsEdu.lightPurple);

    let circleID = d3.select(this).node().getAttribute('id');
    let id = circleID.split('-')[circleID.split('-').length - 1];
    d3.select('#eduTitle-' + id).style('fill', colorsEdu.purple);
    d3.select('#eduTitle-' + id).style('opacity', 1);
    // prevent overflow
    // min coords point (eduXPChartMargin*2)+10
    let coordX = parseInt(d3.select(this).node().getAttribute('cx'));
    coordY = parseInt(d3.select(this).node().getAttribute('cy'));

    let offset = chartW/2 - eduXPChartMargin;
    // slide the chart
    groupCirclesEduXP.selectAll('circle')
                     .attr('cx', function(d, i) {
                       let circleX = parseInt(d3.select(this).node().getAttribute('cx'));
                       if((parseInt(circleX + circleR * 1.8)) > offset) {
                         d3.select(this).classed('circle-x-slided', true);
                         let slidedX = (parseInt(d3.select(this).node().getAttribute('cx'))) - offset;
                         // prevent overflow right (negative number or overflow in margin of chart)
                         if(slidedX < minCoord) {
                           // if(){}
                           return minCoord + circleR * 1.8
                         }
                         if((slidedX + circleR*2) > (chartW/2 - eduXPChartMargin)) {
                           return slidedX - circleR;
                         }
                         return slidedX + circleR;
                       }
                       return parseInt(d3.select(this).node().getAttribute('cx'));
                     })
                   .attr('cy', function(d, i){
                     let circleY = parseInt(d3.select(this).node().getAttribute('cy'));
                     if(i > 0) {
                       let chartHeight = parseInt(d3.select('#eduXPSVG').node().getBoundingClientRect().height);
                       let inter = chartHeight/(eduData.length - 1) - eduXPChartMargin; // bc first node is fixed
                       let prevIdx = i - 1
                       let prevY = parseInt(d3.select('#circleEdu-' + prevIdx).node().getAttribute('cy'));
                       let yPoint = prevY + inter;
                       if(yPoint > chartHeight + circleR) {
                       }
                       return yPoint;
                     }
                     return circleY;
                   });
    // show div info
    let idSelected = d.id

    d3.select('#eduXPInfo').classed('edu-info-visible', true);
    // document.getElementById('eduXPInfo').style.minHeight = chartH + 'px';
    document.getElementById('eduXPPlace').textContent = getDataLang(eduData[idSelected]).placeName;
    document.getElementById('eduXPTime').textContent = getDataLang(eduData[idSelected]).dates;
    document.getElementById('eduXPInfoTitle').textContent = getDataLang(eduData[idSelected]).title;
    let categories = getDataLang(eduData[idSelected]).categories;
    for (const el in categories) {
      document.getElementById('eduXPInfoText')
              .insertAdjacentHTML(
                'afterbegin',
                '<h4 class="title-info-edu">'+ `${el}`+'</h4><p class="text-edu-info">'+`${categories[el]}`+'</p>'
              );
    }




    d3.select('#eduXPChart').style('width', chartW/2 - eduXPChartMargin);
    d3.select('#eduXPSVG').style('width', chartW/2 - eduXPChartMargin);


    // slide text
    groupTextEduXP.selectAll('text')
                  .attr('x', function(d, i) {
                    let circleClass = d3.select('#circleEdu-' + i).node().getAttribute('class');
                    let circleEduX = groupCirclesEduXP.select('#circleEdu-' +i).node().getAttribute('cx');
                    let textEduW = d3.select(this).node().getBoundingClientRect().width;
                    circleClass = circleClass.split(' ')
                    // only slided circles
                    if(circleClass[1] == 'circle-x-slided') {
                      d3.select(this).classed('text-x-slided', true);
                      let slidedX = circleEduX - (textEduW / 2)
                      if(slidedX < 0) {
                        slidedX = eduXPChartMargin;
                      }
                      return slidedX;
                    }
                    return parseInt(d3.select(this).node().getAttribute('x'));
                  })
    //reset paths
    groupLinesEduXP.selectAll('path').remove();
    drawLines(groupLinesEduXP, eduData, groupCirclesEduXP, '#circleEdu-');
  });

  circleEduXP.on('mouseover', function() {
    d3.select(this).classed('circle-hover', true);
    d3.select(this).style('fill', colorsEdu.lightPurple);
    d3.select(this).style('opacity', 0.8);
  });

  // MOUSEOUT
  // reset all /!\ functions are not used here bc it would reset the chart el values and it is not the point
  circleEduXP.on('mouseout', function() {
    // show all texts
    d3.selectAll('.edu-text-title').style('opacity', 1)
    groupCirclesEduXP.selectAll('circle').style('opacity', 1);
    groupLinesEduXP.style('opacity', 1);

    // remove hovered class and reset fill color
    d3.select(this).classed('circle-hover', false);
    d3.select(this).style('fill', colorsEdu.purple);

    let circleID = d3.select(this).node().getAttribute('id');
    let id = circleID.split('-')[circleID.split('-').length - 1]
    d3.select('#eduTitle-' + id).style('fill', colorsEdu.lightGray);
    d3.select(this).attr('r', circleR);

    // reset text
    d3.select('#eduXPInfo').classed('edu-info-visible', false);


    groupTextEduXP.selectAll('text').remove();
    let eduXPTitles = appendEduText(groupTextEduXP, eduData);
    // Place text
    placeEduText(groupTextEduXP)
  });
}
