Title: Drawing network topologies in Python
Date: 2020-09-16 12:00
Category: Python
Tags: network
Slug: drawing-network-topologies-in-python
Authors: Wojciech Bobrowski
template: article
thumbnail: images/thumbnails/network.png
Summary: I plugged the last missing device into my home network (yes, it was router) and was finally able to move on to the network configuration of my DIY datacenter. Unfortunately, I don't have the head to remember all these subnets and configurations, and I have no interest in creating IaC at home. So I thought to myself that I would create a network, draw it and in this way I could remind myself anytime which ports, where, to what and how are connected. Since I am not an artist, I drew a network using power of Python.

## Long story short
I plugged the last missing device into my home network (yes, it was router) and was finally able to move on to
the network configuration of my DIY datacenter. Unfortunately, I don't have the head to remember all these subnets and
configurations, and I have no interest in creating IaC at home. So I thought to myself that I would create a network,
draw it and in this way I could remind myself anytime which ports, where, to what and how are connected. Since I am not
an artist, I drew a network using power of Python.


### Modules of my choice
The choice is limited in this, lets say 'edge-case'. There are two types of Python modules to choose from. One converts
the code to graphic files (jpg, png, etc.). The second category are wrappers that allows you to open files in software
dedicated to graphs. In this case [yEd](https://www.yworks.com/products/yed) and
[draw.io](https://drawio-app.com) editors, which are great by the way.


#### Overview (from IMO best to worst)

- [Need To Graph (yEd Graph Editor)](https://n2g.readthedocs.io/en/latest/yEd%20Module.html) - The most important
feature: naming ports. It's not possible to do so in draw.io module of same N2G library or in nwdiag. yEditor itself
is a great tool for graphs.
- [nwdiag](http://blockdiag.com/en/nwdiag/index.html) - My first choice. Quality of created *.png files is low, but damn,
topology is so fine presented and .diag syntax is so clean. It was very easy to start using this module. I tested rest
of modules only, because of my curiosity, but at the end I think this module is enough for personal use.
- [Need To Graph (draw.io Editor)](https://n2g.readthedocs.io/en/latest/DrawIo%20Module.html) - It looks great, but you
can only name links not ports, which limits you, because by naming link "port1 - port2" you can't be sure what device
is going to be on which side.

##### Not tested, too much effort:

- [networkx](https://networkx.github.io) - This module was generally created for networks. It requires a lot of work
if we want to use it for computer networks.
- [matplotlib.pyplot](https://matplotlib.org/3.3.1/api/_as_gen/matplotlib.pyplot.html) - Same issue as above, but you know
sky is the limit.
- [PcapViz (yEd Graph Editor)](https://github.com/mateuszk87/PcapViz) - It's the only module which uses discovery
mechanism. It's great once you have all devices exposed in network.

### Comparison

|Functions              |    nwdiag     |N2G yed_diagram                |N2G drawio_diagram          |
|---	                |:---:	        |:---:	                        |:---:	                        |
|network assignment     |   ✅	        |  💩	                        |   💩                          |
|ports assignment       |   💩          |  ✅ 	                        |   💩   	                    |
|address assignment     |   ✅          |  💩 	                        |   💩   	                    |
|layouts                |   💩          |  ✅ 	                        |   ✅   	                    |
|additional top label   |   💩          |  ✅ 	                        |   💩   	                    |
|additional bottom label|   💩          |  ✅ 	                        |   💩   	                    |
|linking custom data    |   💩          |  ✅ 	                        |   ✅  	                    |
|naming links           |   💩          |  ✅ 	                        |   ✅  	                    |
|nodes as svg icons     |   💩          |  ✅ 	                        |   ✅  	                    |
|<strong>Score:</strong>|   2           |  7 	                        |   4  	                        |


### Setup of my network

Let's assume I have 5 network devices:

ISP <---> <strong>ONT</strong> (WAN+LAN+WiFi) <---> <strong>Switch</strong> (LAN) <---> <strong>Router / Access Point</strong>
(LAN+WiFi)

To agregate whole network I use 10x1Gbit switch, which is the most busy device.

I keep everything inside single subnet, second exists only, as a backup for HA devices (monitoring,server).
Topology should be clean and easy. Case is not complicated. Let me show you results I obtained.

### The code
Quick overview of my outputs. I'm not going to replace docs of these modules, so go there in case of questions.
In this "lab" I created structure like below:

<strong>Source and output files:</strong>  
./diagrams/[ndwiag.diag](https://gist.githubusercontent.com/VV0JCIECH/7e701a7f6e257d714833e16daff3b519/raw/e7ccabab6ab25094077708ca172582fa324ec578/nwdiag.diag)  
./diagrams/[ndwiag.png]({static}/images/2020-09-network-topologies-ndwiag.png)  
./diagrams/[output_drawio.drawio](https://gist.githubusercontent.com/VV0JCIECH/7e701a7f6e257d714833e16daff3b519/raw/e7ccabab6ab25094077708ca172582fa324ec578/output_drawio.drawio)  
./diagrams/[output_yEd.graphml](https://gist.githubusercontent.com/VV0JCIECH/7e701a7f6e257d714833e16daff3b519/raw/e7ccabab6ab25094077708ca172582fa324ec578/output_yEd.graphml)  
<strong>Scripts:</strong>  
./[n2g_d_handler.py](https://gist.githubusercontent.com/VV0JCIECH/7e701a7f6e257d714833e16daff3b519/raw/e7ccabab6ab25094077708ca172582fa324ec578/n2g_drawio_handler.py)  
./[n2g_y_handler.py](https://gist.githubusercontent.com/VV0JCIECH/7e701a7f6e257d714833e16daff3b519/raw/e7ccabab6ab25094077708ca172582fa324ec578/n2g_yEd_handler.py)  
./[ndwiag_handler.py](https://gist.githubusercontent.com/VV0JCIECH/7e701a7f6e257d714833e16daff3b519/raw/e7ccabab6ab25094077708ca172582fa324ec578/nwdiag_handler.py)  

I published my code as a gist [here](https://gist.github.com/VV0JCIECH/7e701a7f6e257d714833e16daff3b519). Please feel
free to edit and run this code for yourself.

#### Need To Graph (yEd Graph Editor)

Great module. You can add top and bottom labels to nodes, same with naming ports. Its possible to reorganize placement
of nodes automatically inside yEd editor.

![yEd_output]({static}/images/2020-09-network-topologies-n2gyEd.png)

#### nwdiag
In order to use ndwiag module it's required to create *.diag file with proper syntax. User has no impact or access to
module methods and objects, so the only thing we can do is:
```python
nwdiag diagrams/nwdiag.diag
```
![ndwiag_output]({static}/images/2020-09-network-topologies-ndwiag.png)

I cant find a way to tweak png compression level to have fonts so clean as [in this demo](http://blockdiag.com/en/nwdiag/demo.html).
I grayed area to mark devices placed inside single rack.

#### Need To Graph (draw.io Editor)
As I wrote above, there is no way to name ports, so I named links after them. Created network looks better than I thought
 it will be.

![drawio_output]({static}/images/2020-09-network-topologies-n2gDrawio.png)

#### Thanks!

Thanks for taking the time to read this post, I hope you found it interesting. If you have any questions,
join [my discord](https://discord.com/invite/DECS7TA) or [write on twitter](https://twitter.com/VV0JCIECH).

## Links

- nwdiag [git](https://github.com/blockdiag/nwdiag) / [docs](http://blockdiag.com/en/nwdiag/index.html)
- N2G [git](https://github.com/dmulyalin/N2G) / [docs](https://github.com/dmulyalin/N2G)