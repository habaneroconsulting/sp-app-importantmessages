/**
 * @fileOverview App js Important Messages application code
 *
 * @author Mark Bice
 */

/*! Habanero - Licensed under MIT */


//#region $SHIMS, $UTILITY

/**
* Date ISO conversion shim for IE <= 8
*/
if (!Date.prototype.toISOString) {
    (function () {
        function pad(number) {
            var r = String(number);
            if (r.length === 1) {
                r = '0' + r;
            }
            return r;
        }

        Date.prototype.toISOString = function () {
            return this.getUTCFullYear()
                + '-' + pad(this.getUTCMonth() + 1)
                + '-' + pad(this.getUTCDate())
                + 'T' + pad(this.getUTCHours())
                + ':' + pad(this.getUTCMinutes())
                + ':' + pad(this.getUTCSeconds())
                + '.' + String((this.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5)
                + 'Z';
        };
    }());
}


/**
* Converts hex values to RGBA
*
* @param {string} hex Hex code to be converted
* @param {string} opacity Opacity to apply
*/
function hexToRGBA(hex, opacity) {
    var output = '';

    if (isValidHex(hex)) {
        var rgb = hex.replace('#', '').match(/(.{2})/g);

        var i = 3;
        while (i--) {
            rgb[i] = parseInt(rgb[i], 16);
        }

        if (typeof opacity === 'undefined') {
            return 'rgb(' + rgb.join(', ') + ')';
        }

        output = 'rgba(' + rgb.join(', ') + ', ' + opacity + ')';
    }

    return output;
}

/**
* Converts hex values to filters (for IE <= 8)
*
* @param {string} hex Hex code to be converted
* @param {string} opacity Opacity to apply
*/

function hexToFilter(hex, opacity) {
    var output = 'none';

    if (isValidHex(hex)) {
        var ieHex = '#' + (Math.floor(opacity * 255)).toString(16) + hex.substring(1);
        output = 'progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=\'' + ieHex + '\',endColorstr=\'' + ieHex + '\')';
    }

    return output;
}


/**
* Validator for hex codes
*
* @param {string} hex Hex code to be validated
* @returns {boolean} Returns whether or not hex inputted is a valid hex code
*/
function isValidHex(hex) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex);
}


/**
* Checks to see if input is empty (string or empty HTML tag)
*
* @param {string} html HTML to be checked
* @returns {boolean} Returns whether or not input is empty (string or empty HTML tags)
*/
function isEmpty(html) {
    if (html === null || $.trim(html) === '') return true;

    var el = $('<div>' + $.trim(html) + '</div>');
    return ($.trim(el.text()) === '');
}

//#endregion


/** 
* Important Messages app
*/
(function (app, $, ko, AppResources, Modernizr, undefined) {
    'use strict';

    var params = $.url().param(),  // Fetch querystring params object
        config,
        MessagesViewModel,
        lastDataCache = [],
        appContainer, messagesContainer, errorContainer,
        loaderTimeout;


    //#region $PUBLIC METHODS

    /**
    * App initialization routine, post DOM ready (i.e. binding rendering templates)
    */
    app.DOMReady = function () {
        var containerNode = document.getElementById('app-messages');  // Non jQuery-node for KO
        messagesContainer = $(containerNode);

        appContainer = $('.app-container');

        if (config.renderMode.iframe) {
            // Init loading indicator
            loaderTimeout = window.setTimeout(showLoader, config.loadingTimeout);  // Init our loader timeout

            // Bind DOM events
            bindEvents();

            // Scope and apply bindings for our rendering template
            ko.applyBindings(MessagesViewModel, containerNode);

            // Fetch app data
            getData();

            // Bind refresh event if defined
            if (config.refreshInterval !== null) {
                window.setInterval(updateData, (config.refreshInterval * 1000));
            }
        }
        else {
            // We're in full screen mode so look for list controls and bind their links to
            // add list item forms
            $('.app-list-controls input').on('click', function () {
                var pageType = $(this).data('list-type');
                var url;

                switch (pageType) {
                    case 'categories':
                        url = '../Lists/ImportantMessageCategories';
                        break;
                    case 'messages':
                        url = '../Lists/ImportantMessages';
                        break;
                    default:
                        break;
                }

                if (url) {
                    window.location.href = url + '/NewForm.aspx?Source=' + window.location.href;
                }
            });
        }
    };


    /**
    * Fires after the DOM is ready and SharePoint scripts are loaded
    */
    app.sharePointReady = function () {
        //config.context = new SP.ClientContext.get_current();
        //config.web = context.get_web();
        console.log('SharePoint ready');
    };


    /**
    * Fires after our rendering template is bound with data
    */
    app.postRender = function () {
        if (!MessagesViewModel.loaded) {
            MessagesViewModel.loaded = true;
        }
        else {
            // Adding a small timeout to prevent evaluating height before render is 
            // completely finished
            window.setTimeout(function () {
                var body, header;
                messagesContainer.find('.app-message').each(function () {
                    body = $(this).find('.app-message-body');
                    // Message body exists, evaluate if it's content is overflowing. Need to evaluate this b/c
                    // we have the open/close arrow that needs to only show when the body content has overflowed.
                    if (body.length) {
                        if (body[0].scrollHeight > (body.height() + body[0].offsetHeight)) {
                            $(this).addClass('overflow-active');
                        }
                    }
                });

                window.clearTimeout(loaderTimeout);
                hideLoaders();

                // Evaluate the new height of our messages content and resize the container iframe
                autoResize();
            }, 200);
        }
    };

    //#endregion


    // #region $PRIVATE METHODS */

    /**
    * Pre-render initialization of our app. So this would include any functions that need to occur early in lifecycle or
    * do not require the app to be rendered (i.e. fetch properties from querystring).
    */
    function preRender() {
        config = getConfig();

        if (config.renderMode.iframe) {

            // Initialize our view model
            MessagesViewModel = {
                loaded: false,
                messages: ko.observableArray(),
                toRGBA: function (hex) {
                    // IE doesn't support RGBA and chokes KO so have to return transparent as the background.
                    // Otherwise call our hex to RGBA conversion function.
                    return (Modernizr.rgba) ? hexToRGBA(hex, 0.75) : 'transparent';
                },
                toFilter: function (hex) {
                    return (Modernizr.cssgradients) ? 'none' : hexToFilter(hex, 0.75);
                }
            };

            loadSPCss();  // Load SP CSS here, before anything else to reduce flicker (only happens for app part in iframe)
        }
    }


    /**
    * Binds DOM events
    */
    function bindEvents() {
        // Override all message body hyperlinks (with no target specified) to open in host
        messagesContainer.on('click', '.app-message-body a:not([target])', function () {
            window.top.location.href = $(this).attr('href');
        });

        // Bind any message body hyperlink clicks so we don't bubble up and activate the toggle of the message content
        messagesContainer.on('click', '.app-message-body a', function (e) {
            e.stopPropagation();
        });

        // Bind message body hide/show when clicking the title or the toggle link
        messagesContainer.on('click', '.app-message.overflow-active', function (e) {
            $(this).toggleClass('active');
            autoResize();
        });
    }


    /**
    * Puts container into loading state
    */
    function showLoader() {
        // Loader timeout still active, set container to loading state
        if (loaderTimeout !== null) {
            appContainer.addClass('loading');
        }
    }


    /**
    * Removes container's loading/updating state
    */
    function hideLoaders() {
        window.clearTimeout(loaderTimeout);
        loaderTimeout = null;
        appContainer.removeClass('loading updating error');
    }


    /**
    * Messages our parent using postMessage to resize the container iframe (if we are rendered in one). 
    * We have to pass through fixed pixel height/width as MS currently doesn't support fluid values here.
    *
    * @param {integer} w New width, in pixels, for container
    * @param {integer} h New height, in pixels, for container
    */
    function resize(w, h) {
        if (config.renderMode.iframe) {
            window.parent.postMessage('<message senderId=' + config.senderId + '>resize(' + w + ',' + h + ')</message>', config.spHostUrl);
        }
    }


    /**
    * Calls our resize method so that container iframe height can be dynamically resized according to content inside it
    */
    function autoResize() {
        resize(config.spAppDefaultWidth, appContainer.height());
    }


    /**
    * Returns a config object with various Urls and App Part properties that have been initialized
    * via the querystring.
    *
    * @returns {object} JSON object representing all configuration settings for the app
    */
    function getConfig() {
        var listsAPIRoot = params.SPAppWebUrl + '/_api/web/lists/';
        var categoryFieldName = 'ImportantMessageCategory';
        var renderModeParam = (params.RenderMode === undefined) ? '' : params.RenderMode;

        // Set the iframe render mode... Either we're actually in an iframe OR explicitly defined as one through
        // the querystring
        var renderMode = {
            iframe: ((window.top !== window.self) || renderModeParam.toLowerCase() === 'iframe')
        };

        return {
            context: null,
            web: null,
            language: (params.SPLanguage === undefined) ? 'en-us' : params.SPLanguage.toLowerCase(),
            currentDateTimeISO: new Date().toISOString(),
            spHostUrl: params.SPHostUrl,
            spAppWebUrl: params.SPAppWebUrl,
            spAppDefaultWidth: 800,
            renderMode: renderMode,
            layoutsRoot: params.SPHostUrl + '/_layouts/15/',
            listsAPIRoot: listsAPIRoot,
            messagesListUrl: listsAPIRoot + params.MessagesListName,
            categoryFieldName: categoryFieldName,
            maxMessageCount: params.MaxMessageCount,
            senderId: params.SenderId,
            refreshInterval: (params.RefreshInterval === '' || params.RefreshInterval === '0') ? null : parseInt(params.RefreshInterval, 10),  // Refresh interval of zero or empty is invalid
            querySelectFields: 'Id,Title,ImportantMessageBody,ImportantMessageStartDate,ImportantMessageEndDate,HideCategoryTitleInRollup,ImportantMessageSortOrder,' + categoryFieldName + '/Title,' + categoryFieldName + '/ImportantMessageCategoryIconUrl,' + categoryFieldName + '/UIBackgroundColor,' + categoryFieldName + '/UIForegroundColor',
            loadingTimeout: 300,
            xhrTimeout: 7000
        };
    }


    /**
    * This funtion fetches, from the SP REST API, our important messages and binds them to our
    * rendering template. This method can be called at any time to re-bind this data.
    */
    function getData() {
        // Take a snapshot of the datetime and convert it to ISO so it can be passed in to properly 
        // datetime filter our REST call
        config.currentDateTimeISO = new Date().toISOString();

        //var queryFilter = '$filter=ImportantMessageStartDate le \'' + config.currentDateTimeISO + '\' and (ImportantMessageEndDate ge \'' + config.currentDateTimeISO + '\' or ImportantMessageEndDate ne null)';
        var queryFilter = '$filter=ImportantMessageStartDate le \'' + config.currentDateTimeISO + '\' and ImportantMessageEndDate ge \'' + config.currentDateTimeISO + '\'';

        $.ajax({
            headers: {
                'ACCEPT': 'application/json;odata=verbose'
            },
            timeout: config.xhrTimeout,
            url: config.messagesListUrl + '/items?$select=' + config.querySelectFields + '&$expand=' + config.categoryFieldName + '&' + queryFilter + '&$top=' + config.maxMessageCount + '&$orderBy=ImportantMessageSortOrder asc, ImportantMessageStartDate desc',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                fetchDataSuccess(data);
            },
            error: function () {
                fetchDataFail();
            }
        });
    }


    /**
    * Gets called after each successful fetch of message data
    *
    * @param {object} data JSON object with message data
    */
    function fetchDataSuccess(data) {
        // Cleanse our results to speed up multiple evaluations of data in our
        // rendering template (e.g. whether body is empty or has only an empty tag)
        var changeModel = true;
        var newDataCache = [];

        // Cycle through our data and empty out message bodies if they have only empty tags
        $(data.d.results).each(function (i) {
            var el = $(this)[0];
            data.d.results[i].HasEmptyBody = (isEmpty(el.ImportantMessageBody));
            newDataCache.push(el.Id + ':' + el.__metadata.etag);
        });

        // We are on a refresh. Compare new eTag dataset against last fresh one. If no changes then we don't want to bind the view
        // model unnecessarily.
        if ((lastDataCache.length > 0) && (lastDataCache.length === newDataCache.length)) {
            if ($(lastDataCache).not(newDataCache).length === 0 && $(newDataCache).not(lastDataCache).length === 0) {
                changeModel = false;
            }
        }

        // Our model needs to change so cycle through refreshed data, cleanse the message bodies
        // and then update our model.
        if (changeModel) {
            lastDataCache = newDataCache;
            MessagesViewModel.messages(data.d.results);  // Bind our view model to the result data
        }

        updateAppState();
    }


    /**
    * Gets called after each failed fetch of message data
    */
    function fetchDataFail() {
        updateAppState('error');

        // We have no rendered messages, show the error inline
        if (messagesContainer.find('.app-message').length <= 0) {
            var msgError = messagesContainer.find('.app-message-error');

            if (msgError.length) {
                msgError.html(AppResources.Error);
            }
            else {
                messagesContainer.prepend('<div class="app-message-error">' + AppResources.Error + '</div>');
            }

            autoResize();
        }
    }


    /**
    * Updates the app state (e.g. loading, updating, error, etc)
    */
    function updateAppState(cssClass) {
        hideLoaders();

        if (cssClass !== null) {
            appContainer.addClass(cssClass);
        }
    }


    /**
    * Can be called to refresh our data-bind. Simply makes another call to getData(), but also puts the container 
    * into an update state.
    */
    function updateData() {
        updateAppState('updating');
        getData();
    }


    /**
    * Creates CSS reference to OOB SharePoint CSS. This way we can inherit those OOB styles and extend/override them.
    * Used from an App Part iframe.
    */
    function loadSPCss() {
        if (config.renderMode.iframe) {
            // In the app part so inject link to SharePoint's default CSS
            var linkEl = document.createElement('link');
            linkEl.setAttribute('rel', 'stylesheet');
            linkEl.setAttribute('href', config.layoutsRoot + 'defaultcss.ashx');

            var headElement = document.getElementsByTagName('head');
            headElement[0].appendChild(linkEl);
        }
    }

    //#endregion


    // App pre-render (inline, before any ready event occurs)
    preRender();

}(window.app = window.app || {}, $, window.ko, window.AppResources, window.Modernizr));


jQuery(function ($) {
    // If using the JSOM, a function can be called once all SP javascript libraries are loaded and ready.
    // SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () { app.sharePointReady(); });
    app.DOMReady();  // DOM ready, fire off app ready method
});
