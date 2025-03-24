using OpenQA.Selenium;
using OpenQA.Selenium.DevTools.V131.Storage;
using OpenQA.Selenium.Support.UI;
using QATesting.SitePageElements;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QATesting.SiteTests
{
    internal class HomePageButtons
    {
        public static bool TestDrugsButton(IWebDriver driver, string BaseUrl)
        {
            bool result = LoginTests.TestValidLogin(driver, BaseUrl);
            if (result == true)
            {
                WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
                wait.Until(e => e.FindElements(By.CssSelector(HomeElements.DrugButtonSelector())).Count == 1);
                IWebElement DrugButton = HomeElements.DrugsButton(driver);
                DrugButton.Click();

                if (driver.Url == BaseUrl + "/drugs")
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }

        }

        public static bool TestPhysiciansButton(IWebDriver driver, string BaseUrl)
        {
            bool result = LoginTests.TestValidLogin(driver, BaseUrl);

            if (result == true)
            {
                WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
                wait.Until(e => e.FindElements(By.CssSelector(HomeElements.PhysicianButtonSelector())).Count == 1);
                IWebElement PhysicianButton = HomeElements.PhysicianButton(driver);
                PhysicianButton.Click();

                if (driver.Url == BaseUrl + "/physicians")
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else 
            {
                return false;
            }

        }

        public static bool TestPatientsButton(IWebDriver driver, string BaseUrl)
        {
            bool result = LoginTests.TestValidLogin(driver, BaseUrl);

            if (result == false)
            {
                WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
                wait.Until(e => e.FindElements(By.CssSelector(HomeElements.PatientsButtonSelector())).Count == 1);
                IWebElement PatientsButton = HomeElements.PatientsButton(driver);
                PatientsButton.Click();

                if (driver.Url == BaseUrl + "/patients")
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
            
        }

        public static bool TestOrdersButton(IWebDriver driver, string BaseUrl)
        {
            bool result = LoginTests.TestValidLogin(driver, BaseUrl);

            if (result == true)
            {
                IWebElement OrdersButton = HomeElements.OrdersButton(driver);
                WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
                wait.Until(e => e.FindElements(By.CssSelector(HomeElements.OrdersButtonSelector())).Count == 1);
                OrdersButton.Click();

                if (driver.Url == BaseUrl + "/orders")
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
            
        }

        public static bool TestVerificationButton(IWebDriver driver, string BaseUrl)
        {
            bool result = LoginTests.TestValidLogin(driver, BaseUrl);

            if (result == true )
            {
                IWebElement VerificationButton = HomeElements.VerificationButton(driver);
                WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
                wait.Until(e => e.FindElements(By.CssSelector(HomeElements.VerificationButtonSelector())).Count == 1);
                VerificationButton.Click();
                if (driver.Url == BaseUrl + "/verification")
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
            
        }
    }
}
