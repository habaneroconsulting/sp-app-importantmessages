<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />

    <script type="text/javascript" src="../Scripts/jquery.min.js"></script>
    <script src="../Scripts/purl.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="../Scripts/App.js"></script>
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div class="app-messages app-configuration">
        <div class="app-icon">
            <img src="../Images/AppIcon.png" alt="App icon" />
        </div>
        <h2>Important Messages</h2>
        <p>This app allows you to define message categories and then create messages bound to a particular category. Furthermore this app can be dropped onto a page as an App Part, where
            it will dynamically pull in all messages that haven't expired.
        </p>

        <SharePoint:SPSecurityTrimmedControl ID="SPSecurityTrimmedControlName" PermissionsString="AddListItems" runat="server">
            <div class="app-list-controls">
                <p>Use the following to add custom messages and/or message categories.</p>
                <input type="button" value="Add a message" data-list-type="messages" />
                <input type="button" value="Add a message category" data-list-type="categories" /><br />
            </div>

            <hr />

            <WebPartPages:WebPartZone runat="server" FrameType="TitleBarOnly" ID="full" Title="loc:full">
                <WebPartPages:XsltListViewWebPart runat="server" ListUrl="Lists/ImportantMessages" IsIncluded="True"
                    NoDefaultStyle="TRUE" Title="Important Messages" PageType="PAGE_NORMALVIEW"
                    Default="False" ViewContentTypeId="0x">
                </WebPartPages:XsltListViewWebPart>
            </WebPartPages:WebPartZone>
    
            <p>Listed below are the categories for your Important Messages app. <b>Please note the following:</b></p>
            <ul>
                <li>When entering an Icon URL, only reference images that are contained within the App Web otherwise you may run into access denied errors when trying to render the image</li>
                <li>When referencing an Icon from the AppImages library, make sure to use a relative URL (i.e. ../Lists/AppImages)</li>
                <li>If you upload your own icons into the App Images picture library, we recommend making them 36x36 pixels</li>
                <li>If you enter an invalid <a href="http://www.w3schools.com/html/html_colornames.asp" target="_blank">HEX color code</a> the default color will be used (this applies to both the foreground and background color fields)</li>
            </ul>

            <hr />

            <WebPartPages:WebPartZone runat="server" FrameType="TitleBarOnly" ID="WebPartZone1" Title="loc:full">
                <WebPartPages:XsltListViewWebPart runat="server" ListUrl="Lists/ImportantMessageCategories" IsIncluded="True"
                    NoDefaultStyle="TRUE" Title="Important Message Categories" PageType="PAGE_NORMALVIEW"
                    Default="False" ViewContentTypeId="0x">
                </WebPartPages:XsltListViewWebPart>
            </WebPartPages:WebPartZone>

            <hr />

            <WebPartPages:WebPartZone runat="server" FrameType="TitleBarOnly" ID="WebPartZone2" Title="loc:full">
                <WebPartPages:XsltListViewWebPart runat="server" ListUrl="Lists/AppImages" IsIncluded="True"
                    NoDefaultStyle="TRUE" Title="App Images" PageType="PAGE_NORMALVIEW"
                    Default="False" ViewContentTypeId="0x">
                </WebPartPages:XsltListViewWebPart>
            </WebPartPages:WebPartZone>
        </SharePoint:SPSecurityTrimmedControl>
    </div>
</asp:Content>
