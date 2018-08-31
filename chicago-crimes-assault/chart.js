
// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var line1 = d3.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.ArrestTrue); });
// define the line
var line2 = d3.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.ArrestFalse); });
  
// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

function draw(data, country) {
  
  var data = data[country];
  
  // format the data
  data.forEach(function(d) {
      d.Year = parseTime(d.Year);
      d.ArrestTrue = +d.ArrestTrue;
      d.ArrestFalse = +d.ArrestFalse;
  });
  
  // sort years ascending
  data.sort(function(a, b){
    return a["Year"]-b["Year"];
	});
 
  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.Year; }));
  y.domain([0, d3.max(data, function(d) {
	  return Math.max(d.ArrestTrue, d.ArrestFalse); })]);
  
  // Add the line1 path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", line1);
  // Add the line2 path.
  svg.append("path")
      .data([data])
      .attr("class", "line-1")
      .attr("d", line2);  
  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
  }
// Get the data
d3.json("./data/output/data.json", function(error, data) {
  if (error) throw error;
  
  // trigger render
  draw(data, "Chicago Crime");
});