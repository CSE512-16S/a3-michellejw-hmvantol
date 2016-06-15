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



  //Function for drawing axes
  function drawAxes(data, graph) {
  	var allTemp = []
  	for (var i in data.objects.temp_woa.geometries) {
  		for (var j in data.objects.temp_woa.geometries[i].properties) {
  			if (data.objects.temp_woa.geometries[i].properties[j] == -999.999) { allTemp.push(null) }
  			else { allTemp.push(data.objects.temp_woa.geometries[i].properties[j]) };
  		}
  	}
  };

  //Function for updating the graph
  function update(data,idx) {
    var temperature = data.objects.temp_woa.geometries[idx].properties;
    var salinity = data.objects.salin_woa.geometries[idx].properties;
    graph = [];

    // push all variables into the relevant components of the graph variable
    for (var i in temperature) {
      graph.push({"depth" : i, "temperature" : temperature[i], "salinity": salinity[i]});
    }
    // formatting each graph input point
    graph.forEach(function(d) {
      // if temp value is -999.999 we assign it a value of null
      if (d.temperature == -999.999) { d.temperature = null}
      else d.temperature = d.temperature;
      // if sal vaue is -999.999 we assign it a value of null
      if (d.salinity == -999.999) { d.salinity = null }
      else d.salinity = d.salinity;
      // parse depth to obtain numerical values
      if (d.depth == "SURFACE") { d.depth = 0 }
      else {d.depth = +d.depth.split("d")[1].split("M")[0]};
    });

    // Define axis limits (hence, domain) for salinity data
    var x2_floor = Math.floor(d3.min(graph.map(function(d) {return d.salinity; } )));
    var x2_ceil = Math.ceil(d3.max(graph.map(function(d) {return d.salinity; } )));
    x2.domain([x2_floor, x2_ceil]);
    // console.log('x2_floor:' + x2_floor);
    // console.log('x2_ceil:' + x2_ceil);


  };

  d3.json("temp_salin.json", function(error, data){
    if (error) return console.error(error);

    update(data,0);
    drawAxes(data,graph);

  });


});
