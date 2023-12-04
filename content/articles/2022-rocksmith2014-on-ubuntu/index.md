
+++
title = "Rocksmith 2014 on Ubuntu with Steam & Proton"
date = 2022-08-17
description = "Commands that will allow you to run Rocksmith 2014 on an Ubuntu-based system. The process was tested on Pop! _OS 22.04 LTS."
[taxonomies]
categories=["snippets"]
tags=["proton", "games"]
+++
<div align="center"> <img src="rocksmith.png" /> </div>

Commands that will allow you to run Rocksmith 2014 on an Ubuntu-based system. The process was tested on Pop! _OS 22.04 LTS, Rocksmith 2014 Edition Remastered and Proton 5.0-10. Please have in mind that the order is very important here.
## Pre-requirements
- Install [Rocksmith 2014](https://store.steampowered.com/app/221680/Rocksmith_2014_Edition__Remastered)
- Install [wine, winetricks](https://www.google.com/search?q=how+to+install+wine+on+ubuntu)
- Before anything next, plug in the Rocksmith Real Tone Cable to the USB port. Once done, execute below commands in your terminal. By default game is installed in /home/user/.steam/steam and this path will be used in all examples. \

In order to install steam and wine, execute below line:
```fish
sudo apt install wine-stable winetricks steam
```
## Wine configuration
Execute below lines:
```fish
WINEPREFIX=~/.steam/steam/steamapps/compatdata/221680/pfx winetricks sound=alsa
WINEPREFIX=~/.steam/steam/steamapps/compatdata/221680/pfx winecfg
```
Change below options in "window" that appeared:
```yaml
Applications tab:
    Windows Version: Windows 10
Drives tab:
    Drive Z: /home/user/.steam/steam (default, might be other)
Audio tab:
    Input device: In: Rocksmith USB Guitar Adapter
    Voice input device: In: Rocksmith USB Guitar Adapter
```
Apply changes by clicking *ok* button.
## Steam configuration
It's time to launch the game for the first time. Go to properties of the game on steam and change LAUNCH OPTIONS, as below:
```xml
PROTON_NO_D3D11=1 %command%
```
Now launch the game. This step is only required in order to create Rocksmith.ini file in ~/.steam/steam/steamapps/common/Rocksmith2014.
## Game configuration
Open Rocksmith.ini and change two parameters:
```xml
ExclusiveMode=0
Win32UltraLowLatencyMode=0
```
That's it. Launch the game. You are ready to calibrate your guitar and start playing some cool stuff.
## Sound configuration

It's worth to check the volume of your guitar. Please go to the sound settings in OS and tune the volume of your guitar in input/mics section. 100% is fine.

## Sources
- [1] [reddit/SteamPlay](https://www.reddit.com/r/SteamPlay/comments/appsuj/can_anyone_talk_me_through_rocksmith_setup_link/) \
- [2] [protonDB](https://www.protondb.com/app/221680)