using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium;

namespace QATesting.SitePageElements
{
    internal class NavElements
    {
        public static IWebElement Logout(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(LogoutSelector()));
        }
        public static string LogoutSelector()
        {
            return ".dropdown-item";
        }
        public static IWebElement LogoutButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(LogoutButtonSelector()));
        }
        public static string LogoutButtonSelector()
        {
            return ".dropdown button[id*=':r1:']";
        }

    }
}
