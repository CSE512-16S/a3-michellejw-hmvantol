a3-HvanTol-MWeirath
===============

## Team Members

1. Michelle Weirathmueller (michw)
2. Helena van Tol (hmvantol)

## Interactive World Ocean Atlas

For this project, we developed an interactive visualization using data from the [World Ocean Atlas 2013](https://www.nodc.noaa.gov/OC5/woa13/woa13data.html) dataset. We show two main panels: one is a global map of surface temperature or salinity (the user can choose which one they'd like to view). Clicking on the map brings up the temperature and salinity profiles corresponding to that location in the other panel. 


## Running Instructions

Access our visualization at [our project Github page](http://cse512-16s.github.io/a3-michellejw-hmvantol/), or download this repository and run `python -m SimpleHTTPServer 9000` and access the page from http://localhost:9000/.

If you don't see the map at first, expand your browser window width until the two diagrams are side-by-side.

## Story Board

### Data domain
Since we are both Oceanography graduate students, we decided to go with an ocean-related dataset from the [World Ocean Atlas 2013 (WOA 2013)](http://www.nodc.noaa.gov/OC5/woa13/woa13data.html). A number of different measurements are available, although our plan is to begin with average temperature and to expand from there as time permits. Gridded data are available in 1-degree or 5-degree resolution in a variety of formats, including ASCII, CSV, Arcview shapefiles, and NetCDF.  At each gridded location, the files contain a measurement "profile", which is a series of values interpolated to pre-defined depth bins. 

### Interaction techniques
Oceanographers regularly explore large multi-variable data sets in 4D space (longitude, latitude, depth, time). Common visualizations include [contour maps](http://www.ospo.noaa.gov/Products/ocean/sst/contour/), [depth profiles](https://en.wikipedia.org/wiki/Thermocline#/media/File:THERMOCLINE.png), and [T-S diagrams](https://oceanpython.files.wordpress.com/2013/02/ts_diagram.png). On research cruises, oceanographers interact with data as it is being collected to make decisions about where to sample along the cruise track and at which depths. An easy-to-use, interactive interface for viewing average depth profiles at selected locations could be a valuable tool to inform operational decisions at sea, or a method for rapid exploration of global oceanographic properties. It could also be used as a teaching tool for students learning the characteristic profiles of temperature and salinity in the ocean.

Our plan is to have two main images as part of the visualization: a map and a depth profile plot. If the user clicks on a location on the map, the temperature profile at that location will be plotted. Data exploration could be supported by linking multiple commonly used visualizations, allowing the user to observe multiple dimensions at once. Brushing could also be used to connect multiple variables or highlight particular regions of interest.

### Brainstorming
Here is our first sketch of the visualization:

<img src="https://github.com/michellejw/a3_HvT_MW/blob/Master/sketch1.jpg" width="614">

We envision a colour map of sea surface temperature that the viewer can click to bring up depth profiles from different locations.
This is a sketch of the type of colour map we are envisioning (though for now, note that coordinates are not labeled correctly and the default image color map could probably be better).

![tempmap](https://github.com/michellejw/a3_HvT_MW/blob/Master/woa_map.png)

We brainstormed several other versions of this visualization, but eventually decided to go with our first idea because it seems more intuitive. 

In this version, the viewer can click on the map to bring up a depth profile or click on a depth in the profile to change the depth visualized on the map.

<img src="https://github.com/michellejw/a3_HvT_MW/blob/Master/sketch2.jpg" width="614">

This one is similar to the previous idea, but the depth profile shows an entire latitude or longitude range.

<img src="https://github.com/michellejw/a3_HvT_MW/blob/Master/sketch5.jpg" width="614">

In this sketch, the depth profile hovers next to the mouse icon and changes depending on the map location.

<img src="https://github.com/michellejw/a3_HvT_MW/blob/Master/sketch3.jpg" width="614">

In this visualization we linked a T-S diagram to a depth profile to show the interaction between temperature and salinity rather than a map. The user could use brushing to highlight different regions of the T-S diagram or the depth profile.

<img src="https://github.com/michellejw/a3_HvT_MW/blob/Master/sketch4.jpg" width="614">

### Changes between Storyboard and the Final Implementation

After going to office hours, we learned that D3 doesn't really interpolate colours on a map in the way we'd envisioned. We would have to use another javascript library like leaflet.js to make this sort of map. Instead, Michael came up with an idea where we could generate the base map in python and then overlay D3 rectangles on top of the background to make the map interactive.

Originally we were only going to map one variable. After creating the visualization for temperature we decided to add salinity to make things more interesting. The user can toggle between two different surface maps for temperature and salinity and can visualize both salinity and temperature lines on the depth profile.

We made longitude and latitude appear upon hovering over the map to help the user find and remember specific locations.

After the lecture on colour, we moved away from the rainbow palette and used the new Matlab default palette, Parula, instead. The problem with the original palette was that it conveyed shapes, boundaries and other spatial relationships that were mostly arbitrary and misleading. We initially hadn't thought much about it much because the rainbow color map is very commonly used to show mapped variables like temperature and salinity. The Parula colormap is a sequential, continuous colormap ranging from blue to yellow, and although it's not perfect, we thought it did a better job at conveying the geospatial variables. 

Originally, the plan was to keep all the axes constant to make the different profiles easily comparable. However, the salinity values had a really wide range and included some extremely low values in a few locations. This broad salinity axis prevented the viewer from seeing the changes in the shape of the salinity profile, so we adjusted the salinity axis for each location to emphasize variability in the shape of the profile.


## Development Process

To start, Helena created the depth profile while Michelle created the map. After the two visualization were merged we both worked on the interactive components linking the two plots together.

One of the major challenges encountered during our development process was the alignment of spatial coordinates between the background map and the plotted rectangles. Generating the background map required that we interpolate color values to a map image, but since the locations are in latitude and longitude, we also needed to project them appropriately so that they'd match the projection being used in our d3 script. We initially used Python libraries to generate the background map, but ended up generating the final map using Matlab's mapping toolbox. Once we had our map projected properly, it took some time to figure out the correct parameters for the Mercator projection using d3.geo. We ended up adjusting the x/y translation and also the scale value to get the right fit between the rectangle objects and the map.

Once we had the two graphical components working together (map and profiles), we spent some time discussing how we might improve the final visualization from both stylistic and usability viewpoints. This included things like the opacity and shape of the rectangle objects, the appearance of the salinity axis, mouse hovering behavior, and the addition of a title and short description to the top of the visualization page.

We didn't keep a strict tally on hours spent on our project, but estimate that we each spent around 20 hours working on it.
