# -*- coding: utf-8 -*-
"""
Created on Thu Apr 21 20:50:44 2016

@author: michw
"""

import pandas as pd
import numpy as np
import xarray
import matplotlib.pyplot as plt
import matplotlib
matplotlib.style.use('ggplot')  

# %matplotlib qt # run this to plot in separate window
ncfile = '../../a3data/woa13_decav_t00_01v2.nc'
ncfile5d = '../../a3data/woa13_decav_t00_5dv2.nc'
xdf = xarray.open_dataset(ncfile,decode_times=False)
xdf5d = xarray.open_dataset(ncfile5d,decode_times=False)

justdata = xdf.t_an.data
dslice = justdata[0,0,:,:]

latcorners = xdf.variables['lat']
loncorners = xdf.variables['lon']

# I need to convert to utm and then 
# interpolate to a regular grid for plotting!!!


fig = plt.imshow(dslice,origin='lower')
plt.axis('off')
fig.axes.get_xaxis().set_visible(False)
fig.axes.get_yaxis().set_visible(False)
plt.savefig('woa_map.png', bbox_inches='tight', pad_inches = 0)