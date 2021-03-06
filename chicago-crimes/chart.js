var svg = d3.select("svg"),
		margin = {
		  top: 20,
		  right: 20,
		  bottom: 30,
		  left: 40
		},
		width = +svg.attr("width") - margin.left - margin.right,
		height = +svg.attr("height") - margin.top - margin.bottom,
		g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
	.rangeRound([0, width])
	.paddingInner(0.05)
	.align(0.1);

var y = d3.scaleLinear()
	.rangeRound([height, 0]);

var z = d3.scaleOrdinal()
	.range(["#98abc5", "#8a89a6"]);


// add the SVG element
//var svg = d3.select("body").append(svg);

// load the data
//d3.json("./data/output/theft.json", function(error, data) {
	var data = [
		
		{	"Year": "2001",
			"theftOver500": 61834,
			"theftUnder500": 60352
		},
		{
			"Year": "2002",
			"theftOver500": 60000,
			"theftUnder500": 46378
		},
		{
			"Year": "2003",
			"theftOver500": 55012,
			"theftUnder500": 36387
		},
		{
			"Year": "2004",
			"theftOver500": 47876,
			"theftUnder500": 35270
		},
		{
			"Year": "2005",
			"theftOver500": 41230,
			"theftUnder500": 27378
		},
		{
			"Year": "2006",
			"theftOver500": 38970,
			"theftUnder500": 26707
		},
		{
			"Year": "2007",
			"theftOver500": 29875,
			"theftUnder500": 24757
		},
		{
			"Year": "2008",
			"theftOver500": 25476,
			"theftUnder500": 24877
		},
		{
			"Year": "2009",
			"theftOver500": 22745,
			"theftUnder500": 23732
		},
		{
			"Year": "2010",
			"theftOver500": 21984,
			"theftUnder500": 24074
		},
		{
			"Year": "2011",
			"theftOver500": 20453,
			"theftUnder500": 28335
		},
		{
			"Year": "2012",
			"theftOver500": 19284,
			"theftUnder500": 28774
		},
		{
			"Year": "2013",
			"theftOver500": 18453,
			"theftUnder500": 27121
		},
		{
			"Year": "2014",
			"theftOver500": 17428,
			"theftUnder500": 28192
		},
		{
			"Year": "2015",
			"theftOver500": 16857,
			"theftUnder500": 24231
		},
		{
			"Year": "2016",
			"theftOver500": 15724,
			"theftUnder500": 23961
		},
		{
			"Year": "2017",
			"theftOver500": 14736,
			"theftUnder500": 24225
		},
		{
			"Year": "2018",
			"theftOver500": 12065,
			"theftUnder500": 9525
		}

	];

  // fix pre-processing
  var keys = [];
  for (key in data[0]){
    if (key != "Year")
      keys.push(key);
  }
  data.forEach(function(d){
    d.total = 0;
    keys.forEach(function(k){
      d.total = d[k];
    })
  });

  x.domain(data.map(function(d) {
    return d.Year;
  }));
  y.domain([0, d3.max(data, function(d) {
    return d.total;
  })]).nice();
  z.domain(keys);

  g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
    .attr("fill", function(d) {
      return z(d.key);
    })
    .selectAll("rect")
    .data(function(d) {
      return d;
    })
    .enter().append("rect")
    .attr("x", function(d) {
      return x(d.data.Year);
    })
    .attr("y", function(d) {
      return y(d[1]);
    })
    .attr("height", function(d) {
      return y(d[0]) - y(d[1]);
    })
    .attr("width", x.bandwidth());

  g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
    .attr("x", 2)
    .attr("y", y(y.ticks().pop()) + 0.5)
    .attr("dy", "0.32em")
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "start")
    .text("Chicago crime rate");

  var legend = g.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
    .attr("transform", function(d, i) {
      return "translate(0," + i * 20 + ")";
    });

  legend.append("rect")
    .attr("x", width - 19)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", z);

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(function(d) {
      return d;
    });
	

//});