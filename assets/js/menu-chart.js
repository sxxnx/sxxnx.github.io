// Call & draw chart on  page loaded
//// SETUP
document.addEventListener('DOMContentLoaded', function(){
  drawChart();
});

// Draw Chart
function drawChart(){
  // CONST
  const node_data = initNodedArray();
  console.log(node_data)
}

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
      r : Math.random()*10
    }
    arrayOfObj.push(obj)
  }
  return arrayOfObj;
}
