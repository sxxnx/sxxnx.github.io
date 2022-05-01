document.addEventListener('DOMContentLoaded', function(){
  drawChart();
});

// FUNCTIONS
//
// pushData
// push data to a specific array
// args :
//  array : [Array] to push the specific data to
//  dataset : [Object] where to parse the data from
//  key : [String] the key where to get the data
function pushData(array, dataset, key) {
  Object.entries(dataset).forEach(entry => {
    switch (key) {
      case 'USER_KEY':
        if(entry[1].USER_KEY !== undefined) {
          array.push(entry[1].USER_KEY)
        }
        break;
      case 'USER_EMAIL':
        if(entry[1].USER_EMAIL !== undefined) {
          array.push(entry[1].USER_EMAIL)
        }
        break;
      case 'USER_NAME':
        if(entry[1].USER_NAME !== undefined) {
          array.push(entry[1].USER_NAME)
        }
        break;
      case 'USER_ADDRESS':
        if(entry[1].USER_ADDRESS !== undefined) {
          array.push(entry[1].USER_ADDRESS)
        }
        break;
      case 'IP_ADDRESS':
        if(entry[1].IP_ADDRESS !== undefined) {
          array.push(entry[1].IP_ADDRESS)
        }
        break;
      default:
        console.log('Key argument not found')
    }
  })
}

// getScale
// get the scale of the axis depending on the array of data
// args :
//  array [Array] data used stored in an Array
//  pos [int] position of the axis (if first 0, second is 1 etc...)
function getScale(array, pos) {
  return d3.scaleLinear().range([0, height]).domain(0, array.length)
}

// getMedian
// get the median value of an array
// args :
//  values : [Array] array of numbers
function getMedian(values) {
  if (!values.length) {return 0};
  var numbers = values.slice(0).sort((a,b) => a - b);
  var middle = Math.floor(numbers.length / 2);
  var isEven = numbers.length % 2 === 0;
  return isEven ? (numbers[middle] + numbers[middle - 1]) / 2 : numbers[middle];
}

// removeText
// Remove the text in the info area
function removeText(){
  d3.select(' .info .current-user-id span').text('');
  d3.select(' .info .current-user-name span').text('');
  d3.select(' .info .current-user-email span').text('');
  d3.select(' .info .current-user-address span').text('');
  d3.select(' .info .current-user-ip span').text('');
  d3.select(' .info .current-transaction-refused span').text('');
}

function drawChart() {
  // Setup
  let margin = {left:100, top:100, right:100, bottom:100};
  const width =  window.innerWidth - 40;
  const height = width / 2;
  const offset = 40;

  // Create SVG
  let svg = d3.select('#chart').append('svg')
  .attr('width', width)
  .attr('height', height + margin.top + margin.bottom);
  let axisGroup = svg.append('g').classed('groups-axis', true);

  // Data
  d3.csv('https://raw.githubusercontent.com/sxxnx/Fraud-detection-viz/main/data/dataset.csv').then(function(data) {
    // Chart categories
    let dataKeys = data.columns;
    let userKey = [];
    let userEmail = [];
    let userName = [];
    let userAddress = [];
    let userIP = [];
    // Push data
    pushData(userKey, data, 'USER_KEY');
    pushData(userEmail, data, 'USER_EMAIL');
    pushData(userName, data, 'USER_NAME');
    pushData(userAddress, data, 'USER_ADDRESS');
    pushData(userIP, data, 'IP_ADDRESS');
    // Remove duplicates
    userKey = _.uniq(userKey)
    userEmail = _.uniq(userEmail)
    userName = _.uniq(userName)
    userAddress = _.uniq(userAddress)
    userIP = _.uniq(userIP)

    // Remove the last 2 elements (TRANSACTION_REFUSED & CUSTOMER_FRAUDED_ONCE) since they are not used for the chart structure
    dataKeys.length = dataKeys.length - 2;

    // SCALES
    // let xScale = d3.scaleLinear().range([0, height]).domain(0, dataKeys.length);
    let uidScale = d3.scalePoint().range([margin.top / 2, height + margin.top]).domain(userKey);
    let unameScale = d3.scalePoint().range([margin.top / 2, height + margin.top]).domain(userName);
    let uemailScale = d3.scalePoint().range([margin.top / 2, height + margin.top]).domain(userEmail)
    let uaddrScale = d3.scalePoint().range([margin.top / 2, height + margin.top]).domain(userAddress)
    let uipScale = d3.scalePoint().range([margin.top / 2, height + margin.top]).domain(userIP)

    let uidAx = d3.axisLeft().scale(uidScale);
    let unameAx = d3.axisLeft().scale(unameScale);
    let uemailAx = d3.axisLeft().scale(uemailScale);
    let uaddrAx = d3.axisLeft().scale(uaddrScale);
    let uipAx = d3.axisLeft().scale(uipScale);

    // AXIS
    let newW = width + offset;
    axisGroup.append('g').classed('user-id', true).call(uidAx).attr('transform', 'translate('+ offset +', 0)');
    axisGroup.append('g').classed('user-name', true).call(unameAx).attr('transform', 'translate('+ newW / dataKeys.length +', 0)');
    axisGroup.append('g').classed('user-email', true).call(uemailAx).attr('transform', 'translate('+ (newW / dataKeys.length) * 2 +', 0)');
    axisGroup.append('g').classed('user-address', true).call(uaddrAx).attr('transform', 'translate('+ (newW / dataKeys.length) * 3 +', 0)');
    axisGroup.append('g').classed('user-ip', true).call(uipAx).attr('transform', 'translate('+ (newW / dataKeys.length) * 4 +', 0)');

    // // Axis details
    let groupAxis = svg.append('g').classed('axis-details', true);
    groupAxis.append('text').attr('x', 40).attr('y', 30).text('ID')
    groupAxis.append('text').attr('x', newW / dataKeys.length - 35).attr('y', 30).text('Name')
    groupAxis.append('text').attr('x', (newW / dataKeys.length) * 2 - 45).attr('y', 30).text('E-mail')
    groupAxis.append('text').attr('x', (newW / dataKeys.length) * 3 - 55).attr('y', 30).text('Address')
    groupAxis.append('text').attr('x', (newW / dataKeys.length) * 4 - 20).attr('y', 30).text('IP')

    // add classes to tick depending on user id
    let tickText = svg.selectAll(' .tick text');
    tickText = tickText._groups[0];
    Object.entries(data).forEach(datum => {
      let currentName = datum[1].USER_NAME;
      let currentEmail = datum[1].USER_EMAIL;
      let currentAddr = datum[1].USER_ADDRESS;
      let currentIP = datum[1].IP_ADDRESS;
      Object.entries(tickText).forEach(text => {
        let tickClass = 'id-' + datum[1].USER_KEY;
        if ((text[1].innerHTML === currentName) ||
        (text[1].innerHTML === currentEmail) ||
        (text[1].innerHTML === currentAddr) ||
        (text[1].innerHTML === currentIP)) {
          let baseClass = text[1].getAttribute('class')
          text[1].setAttribute('class', 'tick-text')
          d3.select(text[1]).classed(tickClass, true);
        }
      });
    });

    // LINES
    svg.selectAll('transaction')
      .data(data)
      .enter()
      .append('path')
      .attr('class', function(d) {
        let id = 'id-' + d.USER_KEY;
        if(d.CUSTOMER_FRAUDED_ONCE == 0) {
          if(d.TRANSACTION_REFUSED == 0) {
            return 'transaction ' + id + ' risk-0'
          }
          else {
            // transaction is refused
            return 'transaction ' + id + ' risk-1'
          }
        }
        else {
          // customer frauded once
          if(d.TRANSACTION_REFUSED == 0) {
            return 'transaction ' + id + ' risk-2'
          }
          else {
            // transation is refused
            return 'transaction ' + id + ' risk-3'
          }
        }
      })
      .attr('id', function(){
        // Create unique ID for each path
        return Math.random().toString(36).substr(2, 16);
      })
      .attr('d', function(d) {
        let y1 = uidScale(d.USER_KEY);
        let x2 = newW / dataKeys.length;
        let y2 = unameScale(d.USER_NAME);
        let x3 = x2 * 2;
        let y3 = uemailScale(d.USER_EMAIL);
        let x4 = x2 * 3;
        let y4 = uaddrScale(d.USER_ADDRESS);
        let x5 = x2 * 4;
        let y5 = uipScale(d.IP_ADDRESS);

        return 'M' + offset + ' ' + y1 + ' L' + x2 + ' ' + y2 + ' L' + x3 + ' ' + y3 + ' L' + x4 + ' ' + y4 + ' L' + x5 + ' ' + y5
      });

    // Toogle lines
    let userId = svg.selectAll(' .user-id text');
    userId.on('mouseover', function(){
      let id = this.innerHTML;
      svg.selectAll(' .transaction').style('stroke-opacity', 0);
      svg.selectAll(' .id-' + id).style('stroke-opacity', 0.6);
      svg.selectAll(' .id-' + id).style('opacity', 1);
      svg.selectAll(' text.id-' + id).attr('transform', 'translate(0, 15)');
    })
    .on('mouseout', function() {
      svg.selectAll(' .transaction').style('stroke-opacity', 0.5);
      svg.selectAll(' .tick-text').style('opacity', 0);
    })
    .on('click', function() {
      removeText();
      let id = this.innerHTML;
      let names = [];
      let emails = [];
      let addresses = [];
      let ips = [];
      let transactions = 0;
      let refused = 0;
      Object.entries(data).forEach(entry => {
        if(entry[1].USER_KEY == id) {
          transactions += 1;
          if(entry[1].TRANSACTION_REFUSED == 1) {
            console.log('refused')
            refused = refused + 1;
          }
          names.push(entry[1].USER_NAME);
          emails.push(entry[1].USER_EMAIL);
          addresses.push(entry[1].USER_ADDRESS);
          ips.push(entry[1].IP_ADDRESS);
        }
      })
      names = _.uniq(names);
      emails = _.uniq(emails);
      addresses = _.uniq(addresses);
      ips = _.uniq(ips);
      let percentage = ((refused * 100) / transactions).toFixed(2);
      d3.select(' .cross-icon').style('opacity', 1);
      d3.select(' .info .current-user-id span').classed('expand', true).text(id)
      d3.select(' .info .current-user-name span').classed('expand', true).text(names.join(', ') + ' (' + names.length + ')')
      d3.select(' .info .current-user-email span').classed('expand', true).text(emails.join(', ') + ' (' + emails.length + ')')
      d3.select(' .info .current-user-address span').classed('expand', true).text(addresses.join(', ') + ' (' + addresses.length + ')')
      d3.select(' .info .current-user-ip span').classed('expand', true).text(ips.join(', ') + ' (' + ips.length + ')')
      d3.select(' .info .current-transaction-refused span').classed('expand', true).text( percentage + '% (' +  transactions +')')
      setTimeout(function(){
        // Reset animation
        d3.select(' .info .current-user-id span').classed('expand', false)
        d3.select(' .info .current-user-name span').classed('expand', false)
        d3.select(' .info .current-user-email span').classed('expand', false)
        d3.select(' .info .current-user-address span').classed('expand', false)
        d3.select(' .info .current-user-ip span').classed('expand', false)
        d3.select(' .info .current-transaction-refused span').classed('expand', false)
      }, 700)
    })
    d3.select(' .cross-icon').on('click', function(){
      d3.select(' .cross-icon').style('opacity', 0);
      removeText();
    })

    // Style user id depending on risk
    let eachUserId = userId._groups[0];
    Object.entries(eachUserId).forEach(entry => {
      let thisIdLines = [];
      let thisRisk = [];
      let id = entry[1].innerHTML;
      let lines = svg.selectAll(' path.id-' + id);
      lines = lines._groups[0];
      Object.entries(lines).forEach(line => {
        let classId = line[1].getAttribute('class').split(' ')[1];
        let classRiskValue = line[1].getAttribute('class').split(' ')[2].replace('risk-', '');
        thisRisk.push(parseFloat(classRiskValue));
        let medianRisk = Math.round(getMedian(thisRisk))
        entry[1].setAttribute('class', 'risk-' + medianRisk);
      })
    })
  })
}
