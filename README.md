#Important Messages App v1.3 for SharePoint 2013

This is the source for our Important Messages app, which you can also [find in the SharePoint app store](http://office.microsoft.com/en-us/store/important-messages-WA103809916.aspx). It supports SharePoint 2013 (both on premise and O365) and is used for surfacing important notifications that can be categorized and color-coded.

##Getting Started

Pull all the files from the "src" folder and open up ImportantMessages.sln using Visual Studio (built using VS 2012). 

If you want to deploy the app to your O365 tenant:

1. Make sure the site collection you are testing was created using the Developer site template. Otherwise when you try to deploy you will see "sideloading of apps is not enabled on this site".
2. In Visual Studio, open up the Properties Window for the ImportantMessages project. Put the full path to your developer site collection in the "Site URL" property (e.g. "https://contoso.sharepoint.com/sites/dev").
3. This will prompt you to authenticate against your tenant.
4. Once you're authenticated you can publish the app by right clicking the ImportantMessages project and clicking "Deploy".
5. You'll now see Visual Studio doing it's thing. If you go to Site Contents on your developer site collection you'll see the app installing there as well.

#### NOTE: If O365 is not being responsive Visual Studio could take awhile to deploy the app. Sometimes it can deploy for 10 minutes or longer. This app typically should deploy in 10 seconds so if you notice it taking too long you can cancel it by going into Site Contents in your dev collection and just cancel the install. Then try the deploy function again.

You can also right click and "Publish", which will package and open up the folder where the .app file is stored. This .app file can be manually installed into an environment as well.

## Support

If you have a bug, or a feature request, please post in the [issue tracker](https://github.com/habaneroconsulting/sp-app-importantmessages/issues).

## License

Copyright (c) 2013 [Habanero Consulting Group] (http://www.habaneroconsulting.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: 

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
