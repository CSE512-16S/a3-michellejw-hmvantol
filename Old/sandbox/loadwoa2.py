# -*- coding: utf-8 -*-
"""
Created on Thu Apr 21 20:50:44 2016

@author: michw
"""

import pandas as pd
import numpy as np
from scipy import interpolate
import xarray
import matplotlib.pyplot as plt
import matplotlib
matplotlib.style.use('ggplot')  
import utm

# %matplotlib qt # run this to plot in separate window
ncfile = '../../a3data/woa13_decav_t00_01v2.nc'
ncfile5d = '../../a3data/woa13_decav_t00_5dv2.nc'
xdf = xarray.open_dataset(ncfile,decode_times=False)
xdf5d = xarray.open_dataset(ncfile5d,decode_times=False)

lats0 = np.array(xdf.variables['lat'])
lats = lats0[(lats0>-80) & (lats0<84)]
lons = np.array(xdf.variables['lon'])


justdata = xdf.t_an.data
dslice0 = justdata[0,0,:,:]
dslice = dslice0[(lats0>-80) & (lats0<84),:]

lats_down = lats[:80]
dslice_down = dslice[:80,:]
dslice_down2 = np.zeros((80,360))
lats_up = lats[80:]
dslice_up = dslice[80:,:]
dslice_up2 = np.zeros((84,360))
#utm_eastings = np.zeros((len(lons)))
utm_northings_up = np.zeros((len(lats_up)))
utm_northings_down = np.zeros((len(lats_down)))

# interpolate northeren half
for latdex in range(len(lats_up)):
    utmcoords0 = np.array(utm.from_latlon(lats_up[latdex],lons[0])[0:2])
    utm_northings_up[latdex] = utmcoords0[1] 

# interpolate southern half    
for latdex in range(len(lats_down)):
    utmcoords0 = np.array(utm.from_latlon(lats_down[latdex],lons[0])[0:2])
    utm_northings_down[latdex] = utmcoords0[1]     
    
# create even spacings in northings
step = 111000 # about a degree
utm_northings_up2 = np.arange(55318,9272960,step)
utm_northings_down2 = np.arange(1173130,9944681,step)

# interpolate for each longitude slice, both north and south
for i in range(len(lons)):
    dslice_up2[:,i] = np.interp(utm_northings_up2,utm_northings_up,dslice_up[:,i])
    dslice_down2[:,i] = np.interp(utm_northings_down2,utm_northings_down,dslice_down[:,i])

# they're both upside down... not sure why
dslice_up2 = np.flipud(dslice_up2)
dslice_down2 = np.flipud(dslice_down2)


dslice_final = np.concatenate((dslice_up2,dslice_down2),axis=0)

# old map, projection is not right
#fig = plt.imshow(dslice,origin='lower')
plt.figure(figsize=(16,8.2))
plt.imshow(dslice_final)
plt.axis('off')
fig.axes.get_xaxis().set_visible(False)
fig.axes.get_yaxis().set_visible(False)
plt.savefig('woa_map2.png', bbox_inches='tight', pad_inches = 0)