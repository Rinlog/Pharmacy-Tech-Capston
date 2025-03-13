using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium;

namespace QATesting.SitePageElements
{
    internal class HomeElements
    {
        public static IWebElement DrugsButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector("html body div#root div.page-container div.home-container div.home-content div.button-grid div.button-with-image a.home-button"));
        }

        public static IWebElement PhysicianButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector("div.button-with-image:nth-child(2) > a:nth-child(1)"));
        }

        public static IWebElement PatientsButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector("div.button-with-image:nth-child(3) > a:nth-child(2)"));
        }

        public static IWebElement OrdersButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector("div.button-with-image:nth-child(4) > a:nth-child(1)"));
        }

        public static IWebElement VerificationButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector("div.button-with-image:nth-child(5) > a:nth-child(2)"));
        }

        public static IWebElement UserManagementButton(IWebDriver driver)
        {
            return driver.FindElement(By.XPath("/html/body/div/div/div[2]/div[2]/div/div[7]/a"));
        }

        public static IWebElement LogoutButton(IWebDriver driver)
        {
            return driver.FindElement(By.XPath("/html/body/div/div/div[2]/div[2]/div/div[8]/a"));
        }
    }
}
