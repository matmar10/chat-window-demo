
Sample Chat Window
=====================

Overview
--------
A simulated chat window using an event-driven model.

Features
--------
* Event-driven model showcases with two listeners; one of them highlights "who's chatting"
* Allows for using a Lorem-Ipsum generator REST API or static text version
* Defaults to static text if run as a stand-alone HTML page (same-origin policy)
* Uses jQuery module pattern to allow customization during initialization
* *Almost* no custom CSS required (see general noteS)

Installation
------------
1. Open index.html in your target browser
1. There is no step 2

Optional: to demo the use of the "SkaterIpsum" REST API, put the source someplace under
a publicly accessible web server directory. Otherwise it will fallback to static text.

Testing Notes
-------------

This demo has been tested on the following browsers using OSX version 10.6.8:
* Chrome 26.0.1410.65
* Firefox 20.0
* Safari 5.1.9

General Notes
-------------
I've opted to append each new message to the list of messages and adjust the scrollbar accordingly.

The scrollbar adjustments must be 'paused' when the user scrolls away from the bottom-most position.

Firefox required the use of the `overflow-y` property but Chrome worked fine without it.

Vendor source is included for simplicity.

*So what's with the dictators?* Well, I needed a bunch of fake messages and I was hoping
to use some sort of REST API. The first thing I found was the SkaterIpsum. Then I needed a list of
interesting sounding names, and I thought the combination  of dictator's names and  skate boardin
banter was bizarre enough to elicit a laugh. *Disclaimer: I do not condone dictatorial rule.*

Problem Statement
-----------------

From
> What it should look like:
>
> Newest messages should always appear at the bottom (try to get the bottom alignment via CSS instead of javascript)
Older messages should appear above newest.
> The chat window should scroll when needed.
>
> New messages should use an event driven model. Simulate a server (i.e. the totality of the logic will live in the javascript). Try to do this in a object oriented way.
>
> The goal is to spend 20-30 minutes on this. Roughly 15 minutes in the javascript and 15 minutes in the html/css.
>
> Don't worry about the styling/colors in the attached unless you finish all the above and have free time.