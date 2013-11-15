<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" language="C#" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<WebPartPages:AllowFraming ID="AllowFraming1" runat="server" />
<!DOCTYPE html>
<html lang="en-us">
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <title>Important Messages</title>
        <meta name="description" content="Important Messages app part." />
        <meta name="viewport" content="width=device-width" />

		<script type="text/javascript" src="../Scripts/jquery.min.js"></script>
        <script type="text/javascript" src="../Scripts/modernizr.min.js"></script>
        <script type="text/javascript" src="../Scripts/purl.min.js"></script>
        <script type="text/javascript" src="../Scripts/knockout.min.js"></script>
        <script type="text/javascript" src="../Scripts/Resources.js"></script>
    	<script type="text/javascript" src="../Scripts/App.js"></script>

        <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
    </head>

    <body>
        <%-- Template HTML here --%>
        <div class="app-container">
            <span class="app-loader app-hide-text">Loading...</span>

            <div id="app-messages" class="app-messages" data-bind="template: { name: 'message-template', data: messages, afterRender: app.postRender }">
            </div> <!-- /#app-messages -->

            <script type="text/html" id="message-template">
                <!-- ko foreach: $data -->
                <div class="app-message" data-bind="css: { 'empty-body': HasEmptyBody }">
                    <div class="app-message-icon" data-bind="if: ImportantMessageCategory.ImportantMessageCategoryIconUrl, style: { backgroundColor: ImportantMessageCategory.UIBackgroundColor, color: ImportantMessageCategory.UIForegroundColor }">
                        <img data-bind="attr: { src: ImportantMessageCategory.ImportantMessageCategoryIconUrl }" alt="Icon" />
                    </div>
                    <div class="app-message-inner" data-bind="style: { background: $root.toRGBA(ImportantMessageCategory.UIBackgroundColor), filter: $root.toFilter(ImportantMessageCategory.UIBackgroundColor), color: ImportantMessageCategory.UIForegroundColor }">
                        <h3 data-bind="style: { color: ImportantMessageCategory.UIForegroundColor }">
                            <!-- ko ifnot: HideCategoryTitleInRollup -->
                            <span class="app-message-category" data-bind="text: ImportantMessageCategory.Title"></span>
                            <!-- /ko -->
                            <span class="app-message-title" data-bind="text: Title"></span>
                            <!-- ko ifnot: HasEmptyBody -->
                            <a href="javascript:;" class="app-message-toggle app-hide-text">toggle</a>
                            <!-- /ko -->
                        </h3>

                        <!-- ko ifnot: HasEmptyBody -->
                        <div class="app-message-body" data-bind="html: ImportantMessageBody"></div>
                        <!-- /ko -->
                    </div> <!-- /.app-message-inner -->
                </div> <!-- /.app-message -->
                <!-- /ko -->
            </script>
        </div>
    </body>
</html>