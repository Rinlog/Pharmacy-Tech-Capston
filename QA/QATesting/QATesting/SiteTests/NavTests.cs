using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium;
using QATesting.Methods;
using QATesting.SitePageElements;

namespace QATesting.SiteTests
{
    internal class NavTests
    {
        public static bool NavLogout(IWebDriver driver,string BaseUrl)
        {
            MultiWait.Wait(NavElements.LogoutButtonSelector(),driver);
            var LogoutButton = NavElements.LogoutButton(driver);
            LogoutButton.Click();

            MultiWait.Wait(NavElements.LogoutSelector(), driver);
            var Logout = NavElements.Logout(driver);
            Logout.Click();
            
            if (driver.Url + "/login" == BaseUrl + "/login")
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
