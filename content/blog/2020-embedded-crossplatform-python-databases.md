Title: Embedded cross-platform python databases
Date: 2020-08-28 12:00
Category: Python
Tags: benchmark, WIP
Slug: embedded-cross-platform-python-databases
Authors: Wojciech Bobrowski
template: article
thumbnail: images/thumbnails/graph.png
Summary: Recently I have been looking for a way to save states of my scripts in python and return to them freely later. I came up with an idea to use embedded database. An additional criterion was that it should be easily transferable between environments. Here is my benchmark of databases that can be installed directly from the pip program.

## Introduction
Recently I have been looking for a way to save states of my scripts in python and return to them freely later.
I came up with an idea to use embedded database. An additional criterion was that it should be easily transferable
between environments. I tried few modules, but after all, I didn't know which of these is the fastest. That's why I
created benchmark of embedded databases that can be installed directly from the pythonic pip and can be implemented easly
just by code.

### Database libraries
I found a lot of great key/value redis-like databases, but most of them didn't meet my requirements. I just wanted db to
be portable as much it can be. Thats why I found some db modules fully integrated into python code. You can get them
just by pip without running any external services in the background. So these DB modules are:

- vedis-python
- unqlite-python
- sqlitedict
- tinydb
- pickledb
- semidbm
- dbm.dumb

And I also used python wrapper connected to Redis docker instance for comparison purpose:

- redis-py

Tests were made with:

- macOS Mojave 10.14.6
- Python 3.7

My code is a fork of [benchmark](https://gist.github.com/coleifer/3057f97a7628d44c2e59) found on
[https://charlesleifer.com](https://charlesleifer.com/blog/completely-un-scientific-benchmarks-of-some-embedded-databases-with-python/)
blog. Original tested DBs are not easy-enough to implement as a cross-platform solution. There
is always something not out-of-the box to-do with these DBs in non-unix environment and vice versa. That's why I came
with my own list. Let's see if these databases are worth considering to use in your projects at all.

For test purposes I recorded time to create 10K keys and values pairs then time spend to read back all values. Then I
repeated test for 100K pairs, but I had to exclude two the slowest modules (spoiler: tinydb, pickledb)

### The results

Results for [100K](https://gist.githubusercontent.com/VV0JCIECH/a4b0e92f7660d8cae50d708fa394578e/raw/23f20742265ad4f08d7c4f544d3bbf60797e9ea1/x_output_n=100000)
and [10K](https://gist.githubusercontent.com/VV0JCIECH/a4b0e92f7660d8cae50d708fa394578e/raw/23f20742265ad4f08d7c4f544d3bbf60797e9ea1/x_output_n=10000) are same.
It looks like Vedis (#1) and UnQlite (#2) are still the quickest embedded cross-platform DBs for Python. Semidbm got also
great result (#3). DBM.dumb (#4) and SQLiteDict (#5) are not a demons of speed. Tinydb (#7) and Picledb (#8) were
so slow that I had to remove them from the graph to keep it clean. Results of Redis (#6) were also below expectations
(w:18/r:20s), but it might be because I kept docker instance on my Mac. It looks like my comparison is also unscientific.

![Graph]({static}/images/2020-09-embedded-cross-platform-python-databases.png)


### Benchmark

I share my benchmark as a gist [here](https://gist.github.com/VV0JCIECH/a4b0e92f7660d8cae50d708fa394578e). Please feel free
to run tests by yourself or extend it by some other libraries.

## Links
- [vedis-python](https://vedis-python.readthedocs.io/en/latest/)
- [unqlite-python](https://unqlite-python.readthedocs.io/en/latest/index.html)
- [SqliteDict](https://pythonhosted.org/sqlite_object/sqlite_dict.html)
- [TinyDB](https://tinydb.readthedocs.io/en/stable/)
- [pickleDB](https://pythonhosted.org/pickleDB/commands.html)
- [semidbm](https://semidbm.readthedocs.io/en/latest/)
- [dbm.dumb](https://docs.python.org/3/library/dbm.html#module-dbm.dumb)