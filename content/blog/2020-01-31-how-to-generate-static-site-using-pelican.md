Title: How to generate static site using Pelican
Date: 2020-01-31 16:00
Category: Python
Tags: web, static sites
Slug: how-to-generate-static-site-using-pelican
Authors: Wojciech Bobrowski
template: article
thumbnail: images/thumbnails/pelican.png
Summary: Pelican is a static site generator written in python. It's well documented and maintened by broad community. Let's see what is inside this bird and how far we can fly with it.

More often people are overwhelmed by the scale of popular CMS frameworks. The current version of Wordpress is developed in so many directions that it's not a problem to build a shop, auction site or even blog (applause) in a couple of minutes. Universalism is not a bad thing until it has no influence on performance. If a site doesn't require dynamic content or if all interactive parts can be easily replaced by code in javascript, you should give a chance to static site generators.

## Introduction
In this article, I will show you how to deploy your static site on netlify. By this, I mean creating your new Pelican project, configuration and generation of content on netlify by code pushed to a specific branch in GitHub repository. I've shown everything on a live example of this page.
### Prerequisites
- Basic knowledge about git and python.
- Git<Hub/Lab/Bucket> account and linked to it netlify.com site
- Packages of Python 3 and git installed on your workstation
- pyCharm or other IDE

As a bonus I will show you:
- how to reach your site by custom domain
- how to turn your netlify profile to behave as DNS server

#### Useful links
[Blog of Pelican Project](https://blog.getpelican.com "https://blog.getpelican.com")
[Documentation of Pelican](https://docs.getpelican.com/en/stable/ "https://docs.getpelican.com")
[Netlify App](https://app.netlify.com "https://app.netlify.com")

## Creation of project
This is a mix of steps required by Pelican and Netlify. The order is not random. You can achieve the same result in different ways, but mine might be the simplest one.

1. Create a new repository in git server of your choice (GitHub / GitLab / GitBucket)

If you want to:

- keep project open-source
- let people add/edit content
- fix bugs in theme and configuration
- expose all data

make project ___public___, otherwise choose to make it ___private___.

2. Clone newly created repository by copying "Clone with ssh/https" one-liner, later you will have to add `git clone` before it.

Go to a place, where you want to create a new project, e.g:
```bash
mkdir -p ~/git/private
cd ~/git/private
git clone git@github.com:bitStudioDev/bitstudio.dev.git
cd bitstudio.dev
```
From now on we have linked by git catalog on our workspace with a repository on the server.

3. Create (dedicated) virtualenv for project by PyCharm or virtualenv command and install pelican package:
```bash
mkdir ~/git/private/bitstudio.dev/virtualenv
virtualenv ~/git/private/bitstudio.dev/virtualenv
cd ~/git/private/bitstudio.dev/virtualenv
source bin/activate
pip install pelican
```
I recommend also installation minimum one of these:
```bash
pip install Markdown
pip install typogrify
```
Details of installation are avaivable here: [documentation of Pelican](https://docs.getpelican.com/en/stable/install.html "https://docs.getpelican.com")

4. In the main catalog of project, like `~/git/private/bitstudio.dev/`, run command:
```bash
pelican-quickstart
```
This will create a structure of files, like below with content related to answers to 15 questions asked. Each choice can be changed later.
```
bitstudio.dev/
├── content              # *md, *tf files with content
│   └── (pages)
├── output               # Static files are stored here
├── tasks.py
├── Makefile
├── pelicanconf.py       # Main settings file
└── publishconf.py       # Settings to use when ready to publish
```
5. It's a good practice to push a newly created project to your git repository as an init commit. We should always track changes early on.
```bash
git add -A
git commit -m 'init commit'
git push origin
```
## Configuration
1. Create a new site in netlify by using the button labeled **New Site from Git**. Choose a newly created repository. In input labeled `build command` write `make publish` and as a publish directory by default should be `output`.

At this point, you should see the broken deployment of your site, but what we achieved at last:
- we gained subdomain.netlify.com
- netlify started to track changes on repository and is trying to build site after each commit/merge by executing `make publish` command on content pulled from our repository.

To fix broken deployment we should provide two pieces of information. What are requirements.txt in terms of python packages preinstalled on netlify's virtualenv and what is URL of the site?

2. Create requirements.txt in main catalog of your project
`touch ~/git/private/bitstudio.dev/requirements.txt`
Open it with editor of your choice, it can be nano/atom/notepad++ and paste a list of packages installed in your local virtualenv. Below I pasted mine list. State of current versions on a day of 31st Jan 2020.
```python
Jinja2==2.11.0
Markdown==3.1.1
MarkupSafe==1.1.1
Pygments==2.5.2
Unidecode==1.1.1
blinker==1.4
docutils==0.16
feedgenerator==1.9
pelican==4.2.0
pip==20.0.2
python-dateutil==2.8.1
pytz==2019.3
setuptools>=40.0.0
six==1.14.0
```
These values can be easly copy-pasted from PyCharm interpretter settings.
```bash
git add requirements.txt
git commit -m 'init requirements.txt'
git push origin
```
From now on our site should be sonner or later live, but we should also change our `SITEURL` constant in `publishconf.py` file.
```python
#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

# This file is only used if you use `make publish` or
# explicitly specify it as your config file.

import os
import sys
sys.path.append(os.curdir)
from pelicanconf import *

# If your site is available via HTTPS, make sure SITEURL begins with https://
SITEURL = 'https://bitstudio.netlify.com'
RELATIVE_URLS = False

FEED_ALL_ATOM = 'feeds/all.atom.xml'
CATEGORY_FEED_ATOM = 'feeds/{slug}.atom.xml'

DELETE_OUTPUT_DIRECTORY = True
```
Always remember to push changes to git.
```bash
git commit -m 'first change of SITEURL'
git push origin
```
That's it! Your site should be healthy and ready. Congratulation!
From now on you can work on theme and content of your site.