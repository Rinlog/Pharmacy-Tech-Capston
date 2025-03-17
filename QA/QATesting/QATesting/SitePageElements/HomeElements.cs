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
            return driver.FindElement(By.CssSelector(DrugButtonSelector()));
        }
        public static string DrugButtonSelector()
        {
            return "div.button-with-image:nth-child(1) > a:nth-child(2)";
        }
        public static IWebElement PhysicianButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(PhysicianButtonSelector()));
        }
        public static string PhysicianButtonSelector()
        {
            return "div.button-with-image:nth-child(2) > a:nth-child(1)";
        }
        public static IWebElement PatientsButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(PatientsButtonSelector()));
        }
        public static string PatientsButtonSelector()
        {
            return "div.button-with-image:nth-child(3) > a:nth-child(2)";
        }
        public static IWebElement OrdersButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrdersButtonSelector()));
        }
        public static string OrdersButtonSelector()
        {
            return "div.button-with-image:nth-child(4) > a:nth-child(1)";
        }

        public static IWebElement VerificationButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(VerificationButtonSelector()));
        }
        public static string VerificationButtonSelector()
        {
            return "div.button-with-image:nth-child(5) > a:nth-child(2)";
        }
        public static IWebElement UserManagementButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(UserManagementButtonSelector()));
        }
        public static string UserManagementButtonSelector()
        {
            return "div.button-with-image:nth-child(8) > a:nth-child(2)";
        }

        public static IWebElement LogsButton(IWebDriver driver) {
            return driver.FindElement(By.CssSelector(LogsButtonSelector()));
        }
        public static string LogsButtonSelector()
        {
            return "div.button-with-image:nth-child(9) > a:nth-child(1)";
        }

        public static IWebElement LogoutButton(IWebDriver driver)
        {
            return driver.FindElement(By.XPath(LogoutButtonSelector()));
        }
        public static string LogoutButtonSelector()
        {
            return "/html/body/div/div/div[2]/div[2]/div/div[8]/a";
        }
    }
}
