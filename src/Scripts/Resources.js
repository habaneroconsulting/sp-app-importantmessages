/**
 * @fileOverview Resources.js Determines language and pulls localized resource file. All languages additional to
 * en-us will be contained in separate resource JS files (i.e. fr-ca would be in Resources.fr-ca.js) where
 * the AppResources object gets re-defined for that particular language.
 *
 * @author Mark Bice <mbice@habaneroconsulting.com>
 */

/*! Habanero - Licensed under MIT */

// Global var where all localized app resources will be stored
var AppResources;

(function ($, undefined) {
    'use strict';

    var availableLanguages = ['en-us'];  // Put all supported language codes here - i.e. ['en-us', 'fr-ca']
    var params = $.url().param();  // Fetch querystring params object
    var spLanguage = (params.SPLanguage === null) ? null : params.SPLanguage.toLowerCase();
    var selectedLanguage = (spLanguage === null || $.inArray(spLanguage, availableLanguages) < 0) ? 'en-us' : spLanguage;
    var resourcesFile = '../Scripts/Resources.' + selectedLanguage + '.js';

    if (selectedLanguage !== 'en-us') {
        document.writeln('<script src="' + resourcesFile + '" type="text\/javascript"><\/script>');
    }
    else {
        AppResources = {
            Error: 'Error retrieving data',
            Loading: 'Loading',
            MoreLink: 'More',
            Title: 'Important Messages',
            Updating: 'Updating'
        };
    }
}(jQuery));