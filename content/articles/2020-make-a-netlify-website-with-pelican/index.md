+++
title = "Make a Netlify Website with Pelican"
date = 2020-01-31
description = "Pelican is a static site generator written in python. It's well documented and maintained by a broad community. Let's see what is inside this bird and how far we can fly with it."
path = "make-a-netlify-website-with-pelican"
[taxonomies]
categories=["devlog"]
tags=["python", "guides"]
[extra]
feature_image = "asteroid.png"
+++
More often people are overwhelmed by the scale of popular CMS frameworks. The current version of Wordpress is developed in so many directions that it's not a problem to build a shop, auction site or even blog (applause) in a couple of minutes. Universalism is not a bad thing until it has no influence on performance. If a site doesn't require dynamic content or if all interactive parts can be easily replaced by code in javascript, you should give a chance to static site generators.

## Introduction
In this article, I will show you how to deploy your static site on Netlify.com. By this, I mean creating your new Pelican project, configuration and generation of content on Netlify by code pushed to a specific branch in GitHub repository.

### Goals

- Install Pelican
- Create a website running on Pelican
- Deploy a Pelican based site to Netlify.com

### Prerequisites

- Basic knowledge about git and python.
- Git<Hub/Lab/Bucket> account and linked to it Netlify.com profile
- Python 3 and git installed on your workstation
- pyCharm or other IDE

#### Useful links

[Blog of Pelican Project](https://blog.getpelican.com "https://blog.getpelican.com") |
[Documentation of Pelican](https://docs.getpelican.com/en/stable/ "https://docs.getpelican.com") |
[Netlify App](https://app.netlify.com "https://app.netlify.com")

## Install Pelican
Below instruction is just a mix of steps required by Pelican and Netlify. The order is not random. You can achieve the same result in different ways, but mine might be the simplest one. Open a terminal in your OS and execute the below command.
```bash
pip install pelican
```
I recommend also installation minimum one of these:
```bash
pip install Markdown
pip install typogrify
```
- If you use homebrew (macOS) replace pip with pip3.

## Create a directory for a new project
Choose a root directory for your project and switch to it.
```bash
mkdir -p ~/pelican/mynewsite
cd ~/pelican/mynewsite
```
Until directory is empty, initialize a git repository.
```bash
git init
```
In the root directory of the project (e.g.`~/pelican/mynewsite`), run command:
```bash
pelican-quickstart
```
You will be asked to answer 15 questions. For ones that have default values denoted in brackets, feel free to use the `Return key` to accept those default values.
```language-terminal
> Where do you want to create your new web site? [.]
> What will be the title of this web site? mynewsite
> Who will be the author of this web site? iamtheauthor
> What will be the default language of this web site? [en]
> Do you want to specify a URL prefix? e.g., https://example.com   (Y/n) y
> What is your URL prefix? (see above example; no trailing slash) https://mynewsite.netlify.com
> Do you want to enable article pagination? (Y/n)
> How many articles per page do you want? [10]
> What is your time zone? [Europe/Paris] Europe/Warsaw
> Do you want to generate a tasks.py/Makefile to automate generation and publishing? (Y/n)
> Do you want to upload your website using FTP? (y/N)
> Do you want to upload your website using SSH? (y/N)
> Do you want to upload your website using Dropbox? (y/N)
> Do you want to upload your website using S3? (y/N)
> Do you want to upload your website using Rackspace Cloud Files? (y/N)
> Do you want to upload your website using GitHub Pages? (y/N)
Done. Your new project is available at /Users/iamtheauthor/pelican/mynewsite
```
This will create a structure of files, like below with content related to provided answers. Each choice can be changed later either in pelicanconf.py or publishconf.py. Feel free to run `pelican-quickstart` multiple times at the beginning of your project.
```
mynewsite/
├── content              # .md/.rst/.html files with content
│   └── (pages)          # .md/.rst/.html files with pages
├── output               # Generated static files are stored here
├── tasks.py             # Executed methods are stored here
├── Makefile
├── pelicanconf.py       # Main settings file
└── publishconf.py       # Settings to use when ready to publish
```
## Create an article
Depending on your style create new article in `Markdown`, `reStructuredText` or `HTML` syntax format. Create a new article in the editor of your choice and save it in `/content` directory.

You can save below `Markdown` example as `~/projects/mynewsite/content/mynewarticle.md`
```markdown
Title: My markdown title
Date: 2020-01-31 12:00
Modified: 2020-02-01 12:00
Category: mynewcategory
Tags: mynewtag1, mynewtag2
Slug: my-markdown-title
Authors: John Doe
Summary: Short summary shown on the main page.

This is the content of my first markdown article.
```
## Generate static files
In order to create static files in default `/output` directory run below command in the root directory of the project.
```bash
pelican content
```
## Preview your site
There are multiple options in order to preview your site in a browser by typing `http://localhost:8000/`. This is default one:
```bash
pelican --listen
```
, but I prefer a command:
```bash
make devserver
```
The difference is huge. Running the second command your site will be generated each time files in the project directory will be modified.
##  Pushing to Github, publishing on Netlify
In this tutorial scenario, we will use github.com as a place for the git repository and Netlify as a web service provider. In order to run python-based scripts on Netlify, we need to create requirements.txt file in the project's root directory. This way required packages will be available in a remote environment.
### Create requirements.txt in the root directory
Open it with the editor of your choice, it can be nano/atom/notepad++ and paste a list of packages installed in your Pelican virtualenv. Below I posted my list. State of current versions dated 31st Jan 2020.
```python
pelican==4.2.0
typogrify==2.0.7
Markdown==3.1.1
```
 - You can decide to remove version tags (e.g.`==4.2.0`) in order to have packages up-to-date, but it's not recommended, it's a matter of time that the site will be down after upgrade one of these. Believe me.
## Create repository
Create a new repository in service of your choice (GitHub / GitLab / GitBucket). In the case of blogs and wikis, I recommend making repository ___public___. This way it's possible to:

- keep project open-source
- let people add/edit content
- fix bugs in theme and configuration
- expose all data

In any other case, it's recommended to keep repository ___private___.

For reference, the repository of this site `bitstudio.dev` is assigned to `bitStudioDev` account, so URL looks like this:
`https://github.com/bitStudioDev/bitstudio.dev`

Go to the root directory to push the project to the remote repository.
```git
git remote add origin https://github.com/bitStudioDev/bitstudio.dev.git
git add.
git commit -am "Initial commit"
git push origin
```
## Publish website on Netlify.com
Create a new site in Netlify by using the button labeled **New Site from Git**. Choose a newly created repository. In input labeled `build command` write `make publish` and as a publish directory leave `output/`.

At this point, you should be able to observe the pending deployment of the website. Netlify started to track changes on GitHub repository and is trying to build site after each commit/merge by executing `make publish` command on content pulled from our repository.

That's it! Your site should be healthy and ready. Congratulation!
From now on you can either work on jinja2 based theme or content of your site, but it's a material for another article.
