(function($) {

        // options
    var o = {},

        // used to randomly show a fake username
        users = [
            "KJongIllin",
            "rMugabe",
            "THanshwe",
            "OHalbashir",
            "GBerdimuhamedov",
            "MoGadhafi",
            "SaddamH",
            "JoeStalin",
            "APinochet",
            "IAmMrPaulBiya",
            "PapaDocDuvalier",
            "FranciscoFranco",
            "MiltonObote",
            "ASadatFromMisr",
            "JeanBaptisteBagaza",
            "WhoYouCallingAHoChiMinh",
            "Lukashenko",
            "SaisAfwerki",
            "FidelC",
            "KhomeiniTheAyatollah"
        ],

        // semiphore to indicate whether we should continue advancing scrollbar with content
        hasScrolled = false,

        // 25 static messages to randomly show in case we're running as a stand-alone HTML page
        messages = [
            "Skate ipsum dolor sit amet, vert slappy dude no comply Matt Hensley coper.",
            "540 skate key rocket air nose grab Justin Regan ollie north.",
            "Camel back full-cab kingpin heel flip airwalk.",
            "Opposite footed John Grigley darkslide crail slide heel flip kickturn.",
            "Saran Wrap nose grab face plant salad grind boardslide.",
            "Aerial shoveit rails slam concave Vatoland.",
            "Spine slam wheels sick betty.",
            "G-turn Jason Dill aerial salad grind opposite footed gap.",
            "Ollie hang up roll-in finger flip half-cab.",
            "Rocket air hanger slide melancholy full pipe.",
            "Steps handplant tuna-flip stalefish axle.",
            "Stalefish axle set rip grip casper slide Plan B 720.",
            "Bigspin snake hanger rock and roll christ air mongo stalefish.",
            "Crooked grind masonite manual lip nose Tod Swank hang up carve.",
            "Grab locals flypaper Madonna helipop coper shoveit method air.",
            "Nose blunt concave rock and roll invert rad nollie salad grind.",
            "H-Street tuna-flip crail slide spine noseblunt slide slob air pool backside.",
            "Japan air Tracker roll-in wall ride wax Primo slide gnarly.",
            "Snake kidney skater handplant steps slam 540.",
            "Baseplate rip grip shoveit shinner pivot frigid air handplant.",
            "Sponsored nose grab slide kickflip disaster Spike Jonze pool pump.",
            "Face plant pivot S.K.A.T.E. street soul skate kickturn 360 quarter pipe.",
            "Acid drop nosepicker death box Wes Humpston boneless kidney bigspin cess slide.",
            "Nosegrind bearings slappy invert. Drop in slappy mini ramp Sacto flail. ",
            "Skate key 720 grind noseblunt slide. "
        ],

        // data to be inserted into a new DOM element when received
        ChatMessage = function(userName, message) {
            this.userName = userName;
            this.message = message;
        },

        // thrown when new messages are received; contains multiple messages
        ChatMessagesReceivedEvent = function(messages) {
            this.type = "newMessagesReceived";
            this.messages = messages || [];
        },

        // elements we'll reference more than once; grab from here instead of multiple calls to $()
        $elementCache = {};

    /**
     * Loads a random number of paragraphs either via AJAX or from predefined local variable
     * If we get an error, assume it to be due to same-origin-policy violation and fallback
     * Simulates server lag using a random delay
     */
    function getMessages() {

        var numParagraphs = generateRandomInteger(5),
            randomDelayMs = generateRandomInteger(1500, 200),

            messagesReceived = new $.Deferred(),
            
            // takes an array of raw messages and assigns a random user then throws an event to be processed
            handleSuccessfulResponse = function(response) {

                // build up array of message objects from raw paragraphs returned
                var messages = [];
                $.each(response, function(i, paragraph) {
                    var randomUserId = generateRandomInteger(users.length - 1),
                    randomUserName = users[randomUserId];
                    messages.push(new ChatMessage(randomUserName, paragraph));
                });

                // throw event to be processed by any listeners
                $.event.trigger(new ChatMessagesReceivedEvent(messages));

            },

            // generate a random number of messages, each containing a randomized paragraph of sentences
            provideRandomMessages = function() {
                var randomMessages = [],
                    randomSentences = null;
                for(var i = 0; i < generateRandomInteger(5); i++) {
                    var paragraph = null,
                        beginSlice = generateRandomInteger(messages.length - 1),
                        sliceLength = generateRandomInteger(beginSlice + 5, beginSlice + 1);
                    randomSentences = messages.slice(beginSlice, sliceLength);
                    paragraph = randomSentences.join(' ');
                    randomMessages.push(paragraph);
                }
                messagesReceived.resolve(randomMessages);
            };

        $.when(messagesReceived).then(handleSuccessfulResponse);

        if(o.useLoremIpsumRestApi) {
            // use a Lorem Ipsum REST API to make fake messages
            // http://skateipsum.com/get/{{numberOfParagraphs}}/{{startWithSame}}/JSON
            // note that they are not responding with application/json
            // but rather with text/html, hence I'm not using $.getJSON
            $.get('http://skateipsum.com/get/' + numParagraphs + '/0/JSON')
                .done(messagesReceived.resolve)
                .fail(function(xhr) {
                    window.console.log('WARNING: AJAX failed; not to worry as this is probably due to violation of same origin policy (are you running from a server or just as stand-alone HTML?); falling back to static dummy messages...');
                    // prevent further errors by switching options to always use fallback
                    o.useLoremIpsumRestApi = false;
                    setTimeout(provideRandomMessages, randomDelayMs);
                });
            return;
        }

        // simulate server lag AJAX using random delay in milliseconds
        setTimeout(provideRandomMessages, randomDelayMs);
    }

    function appendNewMessages(eventObject) {
        var newMessages = '';
        $.each(eventObject.messages, function(i, chatMessage) {
            newMessages += '<li><i class="icon-user"></i><strong>' + chatMessage.userName + ':</strong> ' + chatMessage.message + '</li>';
        });
        $elementCache.messagesContainer.append(newMessages);
        followScrollBar();
    }

    function highlightActiveUser(eventObject) {
        var $animateThese = $();
        // animate all at once; build up a jQuery collection of targets
        $.each(eventObject.messages, function(i, chatMessage) {
            var selector = '[data-user-name="' + chatMessage.userName + '"]',
                $user = $elementCache.usersContainer.find(selector);
            $animateThese = $animateThese.add($user);
        });

        // quickly "flash" the highlight color
        $animateThese.animate({
            color: $.Color(o.animation.highlightColor)
        }, o.animation.highlightUserDuration, 'swing', function() {
            // return to original color
            $animateThese.animate({
                color: $.Color(o.animation.defaultColor)
            }, o.animation.highlightUserDuration, 'swing');
        });
    }

    function followScrollBar() {
        if(hasScrolled) {
            return;
        }
        var scrollToPosition = $elementCache.messagesContainer.maxScrollPosition();
        $elementCache.messagesContainer.scrollTop(scrollToPosition);
    }

    function handleMessagesContainerScroll(eventObject) {
        //$element = $(eventObject.target);
        hasScrolled = true;
        // resume follow-scroll behavior if we've reached the bottom
        if($elementCache.messagesContainer.scrollTop() === $elementCache.messagesContainer.maxScrollPosition()) {
            hasScrolled = false;
        }
    }

    function populateUsers() {
        var usersList = '';
        $.each(users, function(i, userName) {
            usersList += '<li data-user-name="' + userName + '"><i class="icon-user"></i> ' + userName + '</li>';
        });
        $elementCache.usersContainer.append(usersList);
    }

    function generateRandomInteger(max, min) {
        min = min || 1;
        return Math.floor(Math.random() * max) + min;
    }

    function adjustMessagesContainerHeight() {
        var windowHeight = $(window).height(),
            otherStuffHeight = 0,
            targetHeight = null,
            $otherElements = $();

        // calculate total height of all other vertical elements
        // add anything else within the same row
        $otherElements = $otherElements.add($elementCache.messagesContainer.siblings());
        // add all other siblings rows (same column)
        $otherElements = $otherElements.add($elementCache.messagesContainer.closest('.row').siblings());

        $otherElements.each(function() {
            otherStuffHeight += $(this).outerHeight(true); // include height plus padding AND margin
        });

        // dynamically set the height of the chat window to be full height less room for other content
        targetHeight = windowHeight - (otherStuffHeight + o.bottomPadding);


        window.console.log("Target height is: " + targetHeight);
        $elementCache.messagesContainer.css({
            height: targetHeight + 'px'
        });
    }

    $.spreecastChat = {};
    $.spreecastChat.defaults = {
        animation: {
            defaultColor: "#000000",
            highlightUserDuration: 800,
            highlightColor: "#3a87ad"
        },
        bottomPadding: 160,
        elements: {
            messagesContainer: "ul.messages",
            usersContainer: "ul.users"
        },
        pollDelay: 2000,
        useLoremIpsumRestApi: true
    };

    /**
     * Initializes the spreecast chat module
     *
     * @param options Optional parameters to override default options
     */
    $.spreecastChat.init = function(options) {

        // set up page options
        o = $.extend({}, $.spreecastChat.defaults, options);

        // cache commonly used elements
        $.each(o.elements, function(cacheId, selector) {
            $elementCache[cacheId] = $(selector);
        });

        $elementCache.usersContainer.css('color', o.animation.defaultColor);

        adjustMessagesContainerHeight();
        $(window).resize(function() {
            // re-adjust if window height changes
            adjustMessagesContainerHeight();
        });

        // load the list of dummy users
        populateUsers();

        // stop scroll advancing when user is reviewing history
        $elementCache.messagesContainer.bind('scroll', handleMessagesContainerScroll);

        // this could be a single listener, but showcases the event-driven model and lets it happen in parallel
        $(document).on("newMessagesReceived", appendNewMessages);
        $(document).on("newMessagesReceived", highlightActiveUser);

        // start "polling" for new messages
        setInterval(getMessages, o.pollDelay);
    };

    /**
     * Calculates the maximum scroll bar position of the first matched element
     *
     * @return integer
     */
    $.fn.maxScrollPosition = function() {
        var $element = $(this);
        return $element.prop("scrollHeight") - $element.height();
    };

})(jQuery);