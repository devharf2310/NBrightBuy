// --- Copyright (c) notice NevoWeb ---
//  Copyright (c) 2014 SARL NevoWeb.  www.nevoweb.com. The MIT License (MIT).
// Author: D.C.Lee
// ------------------------------------------------------------------------
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
// TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
// THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
// CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.
// ------------------------------------------------------------------------
// This copyright notice may NOT be removed, obscured or modified without written consent from the author.
// --- End copyright notice --- 

using System;
using System.Collections.Generic;
using System.Globalization;
using System.Web.UI.WebControls;
using DotNetNuke.Common;
using DotNetNuke.Entities.Portals;
using NBrightCore.common;
using NBrightCore.render;
using NBrightDNN;
using NEvoWeb.Modules.NB_Store;
using Nevoweb.DNN.NBrightBuy.Base;
using Nevoweb.DNN.NBrightBuy.Components;
using DataProvider = DotNetNuke.Data.DataProvider;

namespace Nevoweb.DNN.NBrightBuy
{

    /// -----------------------------------------------------------------------------
    /// <summary>
    /// The ViewNBrightGen class displays the content
    /// </summary>
    /// -----------------------------------------------------------------------------
    public partial class ProfileForm : NBrightBuyBase
    {

        private String _templinp = "";
        private ProfileData _profileData;
        const string Resxpath = "/DesktopModules/NBright/NBrightBuy/App_LocalResources/ProfileFormSettings.ascx.resx";

        #region Event Handlers


        override protected void OnInit(EventArgs e)
        {
            base.OnInit(e);

            _profileData = new ProfileData();

            if (ModSettings.Get("themefolder") == "")  // if we don't have module setting jump out
            {
                rpInp.ItemTemplate = new GenXmlTemplate("NO MODULE SETTINGS");
                return;
            }

            try
            {
                _templinp = ModSettings.Get("txtinputform");

                // Get Display
                var rpInpTempl = ModCtrl.GetTemplateData(ModSettings, _templinp, Utils.GetCurrentCulture(), DebugMode);
                rpInp.ItemTemplate = NBrightBuyUtils.GetGenXmlTemplate(rpInpTempl, ModSettings.Settings(), PortalSettings.HomeDirectory); 


            }
            catch (Exception exc)
            {
                rpInp.ItemTemplate = new GenXmlTemplate(exc.Message, ModSettings.Settings());
                // catch any error and allow processing to continue, output error as footer template.
            }

        }

        protected override void OnLoad(EventArgs e)
        {
            try
            {
                base.OnLoad(e);
                if (Page.IsPostBack == false)
                {
                    PageLoad();
                }
            }
            catch (Exception exc) //Module failed to load
            {
                //display the error on the template (don;t want to log it here, prefer to deal with errors directly.)
                var l = new Literal();
                l.Text = exc.ToString();
                phData.Controls.Add(l);
            }
        }

        private void PageLoad()
        {

            var objprof = _profileData.GetProfile();
            if (objprof == null) objprof = new NBrightInfo(true); //assume new address
            base.DoDetail(rpInp, objprof);

        }

        #endregion


        #region  "Events "

        protected void CtrlItemCommand(object source, RepeaterCommandEventArgs e)
        {
            var cArg = e.CommandArgument.ToString();
            var param = new string[3];

            switch (e.CommandName.ToLower())
            {
                case "saveprofile":
                    _profileData.UpdateProfile(rpInp,DebugMode);
                    var addr = new AddressData(); //this will update the default profile addres int he addressbook.

                    var emaillist = _templinp = ModSettings.Get("emaillist");
                    if (emaillist != "")
                    {
                        var emailtemplate = _templinp = ModSettings.Get("emailtemplate");
                        var emailTempl = ModCtrl.GetTemplateData(ModSettings, emailtemplate, Utils.GetCurrentCulture(), DebugMode);
                        var emailbody = GenXmlFunctions.RenderRepeater(_profileData.GetProfile(),emailTempl);
                        var emailfrom = ModSettings.Get("emailfrom");
                        if (emailfrom == "") emailfrom = StoreSettings.Current.AdminEmail;
                        var emailsubject = DnnUtils.GetLocalizedString("emailsubject.Text", Resxpath, Utils.GetCurrentCulture());
                        if (emailsubject == null) emailsubject = "";
                        var emailarray = emaillist.Split(',');
                        foreach (var email in emailarray)
                        {
                            if (!string.IsNullOrEmpty(email) && Utils.IsEmail(emailfrom))
                            {
                                DotNetNuke.Services.Mail.Mail.SendMail(emailfrom, email, "", emailsubject, emailbody, "", "HTML", "", "", "", "");
                            }
                        }
                    }
                    param[0] = "msg=okprofileupdated";
                    if (!UserInfo.IsInRole("Client") && ModSettings.Get("clientrole") == "True") param[0] = "msg=okprofileclientrole";
                    Response.Redirect(Globals.NavigateURL(TabId, "", param), true);
                    break;
            }

        }

        #endregion


    }

}
