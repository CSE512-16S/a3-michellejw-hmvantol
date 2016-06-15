// Script to create map and plot

$( document ).ready(function() {

  //compute the dimensions of the current div - #map-container
  var plot_width = parseInt(d3.select('#plot-container').style('width')),
     plot_height = parseInt(d3.select('#inforow').style('height'));

  //compute the dimensions of the current div - #map-container
  var map_width = parseInt(d3.select('#map-container').style('width')),
     map_height = parseInt(d3.select('#inforow').style('height'));

  //define margins
  var margin = {top:50, right:50, bottom:50, left:50};

  // Define plot elements (functions for scaling)
  // scale first x axis linearly to fit width of the plot div
  var x1 = d3.scale.linear()
  	.range([0, plot_width]);

  // scale second x axis linearly to fit width of the plot div
  var x2 = d3.scale.linear()
  	.range([0, plot_width]);

  // scale y axis to fit height of the plot div
  var y = d3.scale.linear()
  	.range([0,plot_height]);

  // define d3 plot axis for first dataset
  var xAxis1 = d3.svg.axis()
  	.scale(x1)
  	.orient("top");

  // define d3 plot axis for 2nd dataset
  var xAxis2 = d3.svg.axis()
  	.scale(x2)
  	.orient("bottom")
  	.ticks(6); // why do we need this?

  // define d3 y axis
  var yAxis = d3.svg.axis()
  	.scale(y)
  	.orient("left");

  // function to read in temperature and depth data
  var line1 = d3.svg.line()
		.x(function(d) {return x1(d.temperature); })
		.y(function(d) {return y(d.depth); })
		.defined(function(d) {return d.temperature != null; }) //line break if measure is null
		.interpolate("basis");

  // function to read in salinity and depth data
  var line2 = d3.svg.line()
  		.x(function(d) {return x2(d.salinity); })
  		.y(function(d) {return y(d.depth); })
  		.defined(function(d) {return d.salinity != null; }) //line break if measure is null
  		.interpolate("basis");

  // define svg element for profile plot
  var svg1 = d3.select("body")
  		.append("svg")
  		.attr("id", "profile")
  		.attr("width", plot_width + margin.left + margin.right)
  		.attr("height", plot_height + margin.top + margin.bottom)
  	  .append("g");

  // define svg element for map
  var svg2 = d3.select("#map")
  		.append("svg")
  		.attr("width", map_width)
  		.attr("height", map_height);

  var img_sal = 1; // variable: is salinity being shown in bg map? 1 -> yes

  // Origin for map
  var xyorigin = [0,0];

  // set up projection for map (not sure I need all this, why translate?)
  var projection = d3.geo.mercator()
      .translate([(map_width/2)-40, (map_height/2)])
      .scale(127);


  svg2.selectAll("image")
  	.data([xyorigin]).enter()
  	.append("image")
    .attr("id","mapimg")
  	.attr("xlink:href","woa_sal2.png")
  	.attr("width", map_width*.9)
  	.attr("height", map_height*.9)
  	.style("opacity", 1);


// need dynamic resize function


});
