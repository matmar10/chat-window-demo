
Sample Chat Window
=====================

Overview
--------
A simulated chat window using an event-driven model.

Features
--------
* Event-driven model showcases two event listeners; one of them highlights "who's chatting"
* Allows for using a Lorem-Ipsum generator REST API or static text version
* Defaults to static text if run as a stand-alone HTML page (same-origin policy)
* Uses jQuery module pattern to allow customization during initialization
* *Almost* no custom CSS required (see general notes section)


adslkajsdfk;ljasdf
"asld;kfjalskdfjhasfd
lkjahsdflkjahsdf
lkjahsdflkjahsdf

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

No unit tests have been added.

Customization
-------------
Options can be overridden within the initialization call:

    $(document).ready(function() {
        $.spreecastChat.init($.extend(true, {}, $.spreecastChat.defaults, {

            // royal purple for the dictators
            animation: {
                highlightColor: "#7D26CD"
            },

            // add custom messages in addition to the defaults
            messages: $.spreecastChat.defaults.messages.concat([
                "Down with the tyrants!",
                "Power to the people!",
                "Dictators are boneheads",
                "We politely would like to petition for redress of our greivances."
            ]),

            // woa, cowboy; that's some mighty fast polling!
            pollDelay: 500,

            // always use the static messages
            useLoremIpsumRestApi: false
        }));
    });

General Notes
-------------
I've opted to append each new message to the list of messages and adjust the scrollbar accordingly.

The scrollbar adjustments are 'paused' when the user scrolls away from the bottom-most position
and resumed when the user reaches the bottom of the scollable area.

Firefox required the use of the `overflow-y` property but Chrome worked fine without it. It seems
silly to have a single CSS file for just a single line of CSS, but I'd rather be dogmatic about
not inlining CSS (saying "it's just one line" is how such evil things creep in, after all).

Vendor source is included for simplicity, but would normally be declared as dependencies and
bundled during some sort of install process.

*So what's with the dictators?*
Well, I needed a bunch of fake messages and I was hoping
to use some sort of REST API. The first thing I found was the SkaterIpsum. Then I needed a list of
interesting sounding names, and I thought the combination  of dictator's names and  skate boardin
banter was bizarre enough to elicit a laugh. I didn't use them all,
but I got the names [from here](http://www.25facts.com/top-25-dictators-of-the-world/).

*Disclaimer: I do not condone dictatorial rule. I appologize for any skateboard-loving dictators
I may have offended by not including them in this chat.*

*Special note: shout out to the Monitise team for being awesome!*


Problem Statement
-----------------

From Chris Weber:
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
