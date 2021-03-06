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
  	.ticks(6); // why do we need this? (mw question)

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
  var svg1 = d3.select("#plot")
  		.append("svg")
  		.attr("id", "profile")
  		.attr("width", plot_width - margin.left - margin.right)
  		.attr("height", plot_height - margin.top - margin.bottom)
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
    // set up domains for x and y axes
    x1.domain(d3.extent(allTemp));
    x2.domain(d3.extent(graph.map(function(d) { return d.salinity; } )) );
    y.domain(d3.extent(graph.map(function(d) { return d.depth; } )) );

    svg1.append("g")
      .attr("class", "x axis")
      .attr("id","temperature")
      .call(xAxis1);
      //.attr("transform", "translate(0,"+ (margin.top*(-0.5)) +")");

    svg1.append("g")
  		.attr("class", "x axis")
  		.attr("id", "salinity")
  		.call(xAxis2);
  		//.attr("transform", "translate(0,"+ (margin.top*(-0.5)) +")");

    svg1.append("g")
  		.attr("class", "y axis")
  		.call(yAxis);

    svg1.append("text")
   		.attr("class", "x label")
   		.attr("text-anchor", "middle")
   		.attr("font-size", "14px")
   		.attr("x", plot_width/2)
   		.attr("y", (margin.top*(-0.8)))
   		.style("fill", "red")
   		.text("Temperature (\xB0C)");

    svg1.append("text")
  		.attr("class", "x label")
  		.attr("text-anchor", "middle")
  		.attr("font-size", "14px")
  		.attr("x", plot_width/2)
  		.attr("y", (margin.top*(-0.05)))
  		.style("fill", "blue")
  		.text("Salinity (\u2030)");

    svg1.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("transform", "translate("+(-margin.left/1.5)+","+(plot_height/2)+")rotate(-90)")
      .text("Depth (m)");

    svg1.append("path")
      .datum(graph)
      .attr("class", "line1")
      .attr("d", line1)
      .style("stroke", "white");

    svg1.append("path")
      .datum(graph)
      .attr("class", "line2")
      .attr("d", line2)
      .style("stroke", "white");

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

    var axisSelect = d3.select("#profile").selectAll("g#salinity.x.axis").data([graph]);
  	axisSelect.attr("class", "x axis").attr("transform", "translate(0,"+ (margin.top*(-0.5)) +")");
  	axisSelect.call(xAxis2);

    var tempSelect = d3.select("#profile").selectAll(".line1").data([graph]);
    tempSelect.attr("class", "line1");
    tempSelect.transition().duration(800).attr("d",line1).style("stroke", "red");

    var salinSelect = d3.select("#profile").selectAll(".line2").data([graph]);
    salinSelect.attr("class", "line2");
    salinSelect.transition().duration(800).attr("d",line2).style("stroke", "blue");

  };

  // Load json file containing temp and salinity data
  d3.json("temp_salin.json", function(error, data){
    if (error) return console.error(error);

    update(data,0);
    drawAxes(data,graph);

    features = topojson.feature(data, data.objects.temp_woa).features

    // Add svg rectangles onto the map
    var rect = svg2.selectAll("rect")
  		.data(features).enter()
  		.append("rect")
  		.attr("x", function(d) {
  			return projection(d.geometry.coordinates)[0];
  		})
  		.attr("y", function(d) {
  			return projection(d.geometry.coordinates)[1];
  		})
  		.attr("width", 15)
  		.attr("height", 15)
  		.attr("rx",3) // rounded corners
  		.attr("ry",3) // rounded corners
  		.style("stroke", "none")
  		.style("fill", "black")
  		.style("fill-opacity",0);

    // lat text svg
    var lat = svg1.append("text")
  		.attr("id", "lat")
  		.attr("text-anchor", "left")
  		.attr("font-size", "14px")
  		.attr("font-weight", "bold")
  		.attr("x", plot_width/12)
  		.attr("y", plot_height+margin.bottom*0.5)
  		.text(" ");

    // lon text svg
  	var lon = svg1.append("text")
  		.attr("id", "lon")
  		.attr("text-anchor", "left")
  		.attr("font-size", "14px")
  		.attr("font-weight", "bold")
  		.attr("x", plot_width/12)
  		.attr("y", plot_height+margin.bottom*0.9)
  		.text(" ");

    // lat hover text
    var lat_hover = svg2.append("text")
  		.attr("id", "hover1")
  		.attr("text-anchor", "left")
  		.attr("font-size", "12px")
  		.attr("x", map_width/2)
  		.attr("y", map_height/2)
  		.text(" ");

    // long hover text
    var lon_hover = svg2.append("text")
  		.attr("id", "hover2")
  		.attr("text-anchor", "left")
  		.attr("font-size", "12px")
  		.attr("x", map_width/2)
  		.attr("y", map_height/2)
  		.text(" ");

    var active = null; // variable to record which rectangle has been clicked

    // What the rectangle svgs do when you mouseover, mouseout or click (could jquery this)
  	rect.on({
  		"mouseover" : function(d, i) {
  			d3.select(this).style("fill", "black").style("fill-opacity",0.2);
  			var hoverLat = Math.round(features[i].geometry.coordinates[1]*10)/10
  			if (hoverLat < 0) { var NS = "S"; } else { var NS = "N"; }
  			var hoverLon = Math.round(features[i].geometry.coordinates[0]*10)/10
  			if (hoverLon < 0) { var EW = "W"; } else { var EW = "E"; }
  			d3.select("#map").selectAll("text#hover1")
  				.text(Math.abs(hoverLat) + "\xB0 " + NS )
  				.attr("x", projection(features[i].geometry.coordinates)[0]+15 )
  				.attr("y", projection(features[i].geometry.coordinates)[1]-20 );
  			d3.select("#map").selectAll("text#hover2")
  				.text(Math.abs(hoverLon) + "\xB0 " + EW )
  				.attr("x", projection(features[i].geometry.coordinates)[0]+15 )
  				.attr("y", projection(features[i].geometry.coordinates)[1]-5 );
  		},
  		"mouseout" : function(d) {
  			if (this != active) {
  				d3.select(this).style("fill-opacity", 0);
  			}
  			d3.select("#map").selectAll("text#hover1").text(" ");
  			d3.select("#map").selectAll("text#hover2").text(" ");
  		},
  		"click" : function(d,i) {
  			var coordIdx = i;
  			update(data, coordIdx);
  			d3.select(active).style("stroke", "none"); //de-select previous
  			d3.select(active).style("fill", "black");
  			d3.select(active).style("fill-opacity", 0);
  			active = this;
  			d3.select(active).style("stroke", "white");
  			d3.select(active).style("stroke-width", 2);
  			var clickLat = Math.round(features[i].geometry.coordinates[1]*10)/10
  			if (clickLat < 0) { var NS = "S"; } else { var NS = "N"; }
  			var clickLon = Math.round(features[i].geometry.coordinates[0]*10)/10
  			if (clickLon < 0) { var EW = "W"; } else { var EW = "E"; }
  			d3.select("#profile").selectAll("text#lat").text("Latitude: " + Math.abs(clickLat) + "\xB0 " + NS );
  			d3.select("#profile").selectAll("text#lon").text("Longitude: " + Math.abs(clickLon) + "\xB0 " + EW );
  		}
  	});

  });

  // Update background map based on button click (Temp/Salinity)
  function updateImage() {
  	if (img_sal == 1) {
  		d3.select("#bgmap").attr("xlink:href","woa_temp2.png");
  		img_sal = 0;
  	}
  	else {
  		d3.select("#bgmap").attr("xlink:href","woa_sal2.png");
  		img_sal = 1;
  	}

  }

});
