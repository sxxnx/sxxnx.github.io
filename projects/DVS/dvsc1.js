document.addEventListener('DOMContentLoaded', function(){
  drawChart();
});

function drawChart() {
  d3.csv('https://raw.githubusercontent.com/sxxnx/DVS-WebChart/master/data/dvs_challenge_1_membership_time_space.csv').then(function(data) {
    let continentsList = [];
    data.forEach(function(el) {
      continentsList.push(findArea(el.lat, el.long))
    })
    continentsList = _.uniq(continentsList);


    // FUNCTIONS
    function getMinLat(continent) {
      let latList = [];
      data.forEach(function(el){
        if(findArea(el.lat, el.long) === continent) {
          if(el.lat !== ''){
            latList.push(parseFloat(el.lat))
          }
        }
      })
      return _.min(latList);
    }
    function getMaxLat(continent) {
      let latList = [];
      data.forEach(function(el){
        if(findArea(el.lat, el.long) === continent) {
          latList.push(parseFloat(el.lat))
        }
      })
      return _.max(latList);
    }

    // Get the mid point of a line
    // x1, x2, y1, y2 : numbers  coords of the line
    function getMidPoint(x1, x2, y1, y2) {
      let points = [];
      let x = (x2 + x1)/2;
      points.push(x)
      let y = (y2 + y1)/2;
      points.push(y)
      return points;
    }

    // Get the path of slice representing the continent
    // continent : strg
    function getPath(continent) {
      let id = continent.toLowerCase().replace(' ', '-');
      let pathData = svg.select(' #contArc-' + id).attr('d').split(',');
      let firstPoint = pathData[0].replace('M', '');
      let midPointOfBase = getMidPoint(parseFloat(firstPoint), parseFloat(pathData[6]), parseFloat(pathData[1]), parseFloat(pathData[7]));
      let path = {
        d : {x: parseFloat(firstPoint), y: parseFloat(pathData[1])},
        v : {x: parseFloat(pathData[6]), y: parseFloat(pathData[7])},
        s : {x: parseFloat(pathData[3]), y: parseFloat(pathData[4])},
        m : {x: parseFloat(midPointOfBase[0]), y: parseFloat(midPointOfBase[1])}
      };
      return path;
    }

    // Config xScale for chart
    function getXScale(continent, value) {
      let scalesData = getPath(continent);
      if (value === 'data') {
            let xScale = d3.scaleLinear()
            .range([scalesData.s.x , scalesData.d.x])
            .domain([0, 5]);
            return xScale;
          }
          else if (value === 'visualization') {
            let xScale = d3.scaleLinear()
            .range([scalesData.s.x, scalesData.v.x])
            .domain([0, 5])
            return xScale;
          }
          else {
            let xArr = [scalesData.s.x, scalesData.m.x]
            let minX = _.min(xArr);
            let maxX = _.max(xArr);
            let xScale = d3.scaleLinear()
            .range([scalesData.s.x, scalesData.m.x])
            .domain([0, 5])
            return xScale;
          }
    }

    // Config yScale of the chart
    function getYScale(continent, value) {
        let scalesData = getPath(continent);
        if (value === 'data') {
          let yScale = d3.scaleLinear()
            .range([scalesData.s.y, scalesData.d.y])
            .domain([0, 5]);
          return yScale;
        }
        else if (value === 'visualization') {
          let yScale = d3.scaleLinear()
            .range([scalesData.s.y, scalesData.v.y])
            .domain([0, 5])
          return yScale;
        }
        else {
          let yArr = [scalesData.s.y, scalesData.m.y]
          let minY = _.min(yArr);
          let maxY = _.max(yArr);
          let yScale = d3.scaleLinear()
            .range([scalesData.s.y, scalesData.m.y])
            .domain([0, 5])
          return yScale;
        }
    }

    // Draw the polygons and lines
    function addLines(continent, data) {
      let id = continent.toLowerCase().replace(' ', '-');
      let idx = continents.indexOf(continent);
      let group = svg.select(' #groupPath-' + id).append('g').attr('id', 'group-' + id);
      let p = getPath(continent)
          group.selectAll('polygon')
          .data(data.filter(function(d) { if(findArea(d.lat, d.long) === continent) {return d}})) // Filter for the current continent
          .enter()
          .append('polygon')
          .attr('points', function(d) {
                let dataX = getXScale(continent, 'data');
                let dataY = getYScale(continent, 'data');
                let vizX = getXScale(continent, 'visualization');
                let vizY = getYScale(continent, 'visualization');
                let socX = getXScale(continent, 'society');
                let socY = getYScale(continent, 'society');
                return dataX(d.data) + ',' + dataY(d.data) + ' ' +
                  vizX(parseFloat(d.visualization)) + ',' + vizY(d.visualization) + ' ' +
                socX(parseFloat(d.society)) + ',' + socY(d.society);
          })
          .style('fill', colors[idx])
          .style('fill-opacity', 0.1)
          .style('stroke', colors[idx])
          .style('stroke-opacity', 0);
      group.append('g').classed('line-society', true).append('path').attr('id', 'societyLine-' + idx).attr('d', 'M0,0' + 'L' + p.m.x + ',' + p.m.y).style('stroke', '#fff').style('stroke-opacity', 0);
      group.append('text').classed('continent-name', true).append('textPath').attr('href', '#societyLine-' + idx).attr('startOffset', '150px')
        .text(continent).style('fill', '#fff').style('fill-opacity', 0.4);
        // add legends/captions text
        legends(idx);
    }

    // Config the legends/captions text (data, visualisation, society)
    function legends(idx) {
      let p = getPath(continents[idx]);
      svg.select('g.line-society').append('path').attr('id', 'legendLine-' + idx).attr('d', function() {
        let x1 = p.d.x;
        let x2 = p.v.x;
        let y1 = p.d.y;
        let y2 = p.v.y;
        if((x1 > 0) && (x2 > 0) && (y1 <= 0)) {
          x1 = x1 + 5;
          x2 = x2 + 5;
          y1 = y1 - 5;
          y2 = y2 - 5;
        }
        else if((y1 > 0) && (y2 > 0)) {
          x1 = x1 - 5;
          x2 = x2 - 5;
          y1 = y1 + 5;
          y2 = y2 + 5;
        }
        else if ((x1 < 0) && (x2 < 0) && (y2 < 0)) {
          x1 = x1 - 5;
          x2 = x2 - 5;
          y1 = y1 - 5;
          y2 = y2 - 5;
        }
        return 'M' + x1 + ',' + y1 + 'L' + x2 +',' + y2;
      });
      svg.select('g.line-society').append('text').append('textPath').attr('href', '#legendLine-' + idx).attr('startOffset', '20px').style('fill', '#f6b93b').style('fill-opacity', 1).text('data');
      svg.select('g.line-society').append('text').append('textPath').attr('href', '#legendLine-' + idx).attr('startOffset', '160px').style('fill', '#b71540').style('fill-opacity', 0.7).text('society');
      svg.select('g.line-society').append('text').append('textPath').attr('href', '#legendLine-' + idx).attr('startOffset', '200px').style('fill', '#079992').style('fill-opacity', 0.9).text('visualization');
    }

    // CONST LIST
    const continents = continentsList;
    const colors = ['#F5D963','#B6D46A','#7CC880','#4EB896','#40A3A4','#558CA4','#6E7394','#7C5B78'];
    const minScore = 0;
    const maxScore = 5;


    // CHART
    const totalWidth = window.innerHeight;
    const margin = {left: 20, top: 20, right: 20, bottom: 20};
    const width =  totalWidth - margin.left - margin.right;
		const height =  totalWidth -  margin.top - margin.bottom;
    const miniSize = 300;
    const svg = d3.select("#chart").append("svg")
      .attr("width", (width + margin.left + margin.right))
      .attr("height", (height + margin.top + margin.bottom))
			.append("g").attr("class", "wrapper")
			.attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top * 2) + ")");
    const miniChart = d3.select("#explanationChart").append("svg")
        .attr("width", miniSize)
        .attr("height", miniSize)
  			.append("g").attr("class", "mini-wrapper");

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(width/2 + 10);

    const angle = 360/continents.length; // 360 deg / len of benef

    const pie = d3.pie()
      .value(function(d, i) {
        return angle;
      })
      .sort(null);


    // Draw arcs
    svg.selectAll(' .continentsArc')
      .data(pie(continents))
      .enter().append('g').classed('group-path', true).attr('id', function(d, i) {
        return 'groupPath-' + d.data.toLowerCase().replace(' ', '-')
      }).append('path')
      .classed('cont-arc', true)
      .attr('id', function(d, i){ return 'contArc-'+ d.data.toLowerCase().replace(' ', '-')})
      .attr('d', arc);

    // Add info
    svg.append('g').classed('text-info', true).append('text').attr('x', 0 - (width + 40) / 2).attr('y', 0 - (height + 55) / 2).text('Data for');
    svg.select(' .text-info').append('text').classed('info-c-name', true).attr('x', 0 - (width - 70) / 2).attr('y', 0 - (height + 50) / 2);
    svg.select(' .text-info').append('text').classed('number-members', true).attr('x', 0 - (width + 40) / 2).attr('y', 0 - (height + 15) / 2);
    svg.select(' .text-info').append('text').classed('number-info', true).attr('x', 0 - (width - 240) / 2).attr('y', 0 - (height + 15) / 2);
    svg.select(' .text-info').append('text').attr('x', 0 - (width + 40) / 2).attr('y', 0 - (height - 30) / 2).text('Mean score for :');
    svg.select(' .text-info').append('text').classed('score-data', true).attr('x', 0 - (width + 20) / 2).attr('y', 0 - (height - 75) / 2);
    svg.select(' .text-info').append('text').classed('data-info', true).attr('x', 0 - (width - 170) / 2).attr('y', 0 - (height - 75) / 2);
    svg.select(' .text-info').append('text').classed('score-viz', true).attr('x', 0 - (width + 20) / 2).attr('y', 0 - (height - 105) / 2);
    svg.select(' .text-info').append('text').classed('viz-info', true).attr('x', 0 - (width - 170) / 2).attr('y', 0 - (height - 105) / 2);
    svg.select(' .text-info').append('text').classed('score-soc', true).attr('x', 0 - (width + 20) / 2).attr('y', 0 - (height - 135) / 2);
    svg.select(' .text-info').append('text').classed('soc-info', true).attr('x', 0 - (width - 170) / 2).attr('y', 0 - (height - 135) / 2);
    svg.select(' .text-info').style('opacity', 0);


    // Display info on mouseover slice
    svg.selectAll(' .group-path')
      .on('mouseover', function() {
        let id = this.getAttribute('id').replace('groupPath-', '')
        // Get number of members
        let splitContName = id.replace('-', ' ').split(' ');
        for (var i = 0; i < splitContName.length; i++) {
            splitContName[i] = splitContName[i].charAt(0).toUpperCase() + splitContName[i].substring(1);
        }
        let contName = splitContName.join(' ');
        let nb = 0;
        data.forEach(datum => {
          if(findArea(datum.lat, datum.long) === contName) {
            nb = nb + 1;
          }
        });
        // Get mean scores
        let dataM = 0;
        let vizM = 0;
        let socM = 0;
        data.forEach(datum => {
          if(findArea(datum.lat, datum.long) === contName) {
            dataM = dataM + parseFloat(datum.data);
            vizM = vizM + parseFloat(datum.visualization);
            socM = socM + parseFloat(datum.society);
          }
        })
        dataM = dataM / nb;
        vizM = vizM / nb;
        socM = socM / nb;
        svg.select(' .info-c-name').text(contName);
        svg.select(' .number-members').text('Number of members: ');
        svg.select(' .number-info').text(nb);
        svg.select(' .score-data').text('Data: ');
        svg.select(' .data-info').text(dataM.toFixed(2));
        svg.select(' .score-viz').text('Visualization: ');
        svg.select(' .viz-info').text(vizM.toFixed(2));
        svg.select(' .score-soc').text('Society: ');
        svg.select(' .soc-info').text(socM.toFixed(2));
        d3.select(this).selectAll('polygon').style('stroke-opacity', 1).style('fill-opacity', 0);
        svg.select(' .text-info').style('opacity', 1);

      })
      // Hide info on mouse out
      .on('mouseout', function(){
        d3.select(this).selectAll('polygon').style('stroke-opacity', 0).style('fill-opacity', 0.1);

        svg.select(' .text-info').style('opacity', 0);
      });


    // Make mini chart (super hardcoded)
    miniChart.append('path').attr('d', 'M 50 250 L 150 50').style('stroke', '#f6b93b').style('fill', 'none');
    miniChart.append('path').attr('d', 'M 150 50 L 250 150').style('stroke', '#ccc').style('fill', 'none');
    miniChart.append('path').attr('d', 'M 250 150 L 50 250').style('stroke', '#079992').style('fill', 'none');
    miniChart.append('text').attr('x', 100).attr('y', 50).text('data').style('fill', '#f6b93b');
    miniChart.append('text').attr('x', 255).attr('y', 150).text('visualization').style('fill', '#079992');
    miniChart.append('text').attr('x', 0).attr('y', 250).text('society').style('fill', '#b71540');
    let midP = getMidPoint(150,250,50,150);
    miniChart.append('path').attr('d', 'M 50 250 L ' + midP[0] + ' ' + midP[1] + ' Z').style('stroke', '#b71540').style('fill', 'none');
    miniChart.append('line').attr('x1', 180).attr('y1', 100).attr('x2', 200).attr('y2', 100).style('stroke', '#ccc');
    miniChart.append('line').attr('x1', 200).attr('y1', 120).attr('x2', 200).attr('y2', 100).style('stroke', '#ccc');
    miniChart.append('text').attr('x', 210).attr('y', 90).text('score from 0 to 5').style('fill', '#777');

    // Draw the polygons and lines for each continent
    addLines('Other', data);
    addLines('North America', data);
    addLines('Europe', data);
    addLines('South America', data);
    addLines('Antarctica', data);
    addLines('Asia', data);
    addLines('Africa', data);
    addLines('Oceania', data);
  })
}

// Get the continent depending on long and lat
// Code from https://github.com/Low-power
function findArea(lat, lng){
  if(lat <= -40){		// Data are from Daniel Pereira
    return "Antarctica";
  }
  if(lat > 12 && lng > -180 && lng < -45){
    const LatNAm = [90,90, 78.13, 57.5, 15, 15, 1.25, 1.25, 51, 60,60];
    return "North America";
    const LonNAm = [-168.75, -10, -10, -37.5, -30, -75, -82.5, -105, -180, -180, -168.75];
  }
  const LatNA2 = [51,51, 60];
  if(lat <= 12 && lat > -40 && lng > -90 && lng < -30){
    const LonNA2 = [166.6, 180, 180];
    return "South America";
  }
  const LatSAm = [1.25, 1.25, 15, 15, -60, -60];
  if(lat < -10 && lng >= 105 && lng <=155){
    const LonSAm = [-105, -82.5, -75, -30, -30, -105];
    return "Oceania";
  }
  const LatEur = [90, 90, 42.5, 42.5, 40.79, 41, 40.55, 40.40, 40.05, 39.17, 35.46, 33, 38, 35.42, 28.25, 15, 57.5,78.13];
  if(lat > 20 && lng >= 60 && lng <=160){
    const LonEur = [-10, 77.5, 48.8, 30, 28.81, 29, 27.31, 26.75, 26.36, 25.19, 27.91, 27.5, 10, -10, -13, -30, -37.5, -10];
    return "Asia";
  }
  const LatAfr = [15, 28.25, 35.42, 38, 33, 31.74, 29.54, 27.78, 11.3, 12.5, -60, -60];
  if(lat > 10 && lat < 40 && lng >= 35 && lng <=60){
    const LonAfr = [-30, -13, -10, 10, 27.5, 34.58, 34.92, 34.46, 44.3, 52,75, -30];
    return "Asia";
  }
  const LatAus = [-11.88, -10.27, -10, -30,-52.5, -31.88];
  if(lat > -40 && lat < 35 && lng >= -20 && lng <=50){
    const LonAus = [110, 140, 145, 161.25, 142.5, 110];
    return "Africa";
 }
 const LatAsi = [90, 42.5, 42.5, 40.79, 41, 40.55, 40.4, 40.05, 39.17, 35.46, 33, 31.74, 29.54, 27.78, 11.3, 12.5, -60, -60, -31.88, -11.88, -10.27, 33.13, 51,60, 90];
 if(lat >= 35 && lng >= -10 && lng <=40){
   const LonAsi = [77.5, 48.8, 30, 28.81, 29, 27.31, 26.75, 26.36, 25.19, 27.91, 27.5, 34.58, 34.92, 34.46, 44.3, 52, 75, 110, 110, 110,140,140, 166.6, 180, 180];
   return "Europe";
   const LatAs2 = [90, 90,60,60];
 }
 const LonAs2 = [-180, -168.75, -168.75, -180];
 return "Other";
 const LatAnt = [-60, -60, -90, -90];
 const LonAnt = [-180, 180, 180, -180];

 let is_in_polygon = function(lat, lng, plats, plngs) {
   let i, j;
   let r = false;
   // assert(plats.length == plngs.length)
   for(i = 0, j = plats.length - 1; i < plats.length; j = i++) {
     if(((plats[i] > lat) != (plats[j] > lat)) &&
     (lng < (plngs[j] - plngs[i]) * (lat - plats[i]) / (plats[j] - plats[i]) + plngs[i])) {
       r = !r;
     }
   }
   return r;
 };
 if(is_in_polygon(lat, lng, LatSAm, LonSAm)) {
   return "South America";
 }
 if(is_in_polygon(lat, lng, LatNAm, LonNAm)) {
   return "North America";
 }
 if(is_in_polygon(lat, lng, LatEur, LonEur)) {
   return "Europe";
 }
 if(is_in_polygon(lat, lng, LatAsi, LonAsi) || is_in_polygon(lat, lng, LatAs2, LonAs2)) {
   return "Asia";
 }
 if(is_in_polygon(lat, lng, LatAus, LonAus)) {
   return "Oceania";
 }
 if(is_in_polygon(lat, lng, LatAfr, LonAfr)) {
   return "Africa";
 }
 if(is_in_polygon(lat, lng, LatAnt, LonAnt)) {
   return "Antarctica";
 }
 return "Other";
}
