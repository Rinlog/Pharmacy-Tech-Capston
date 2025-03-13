using OpenQA.Selenium;
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
            IWebElement Email = LoginElements.LoginEmail(driver);
            IWebElement Pass = LoginElements.LoginPass(driver);
            IWebElement Submit = LoginElements.LoginSubmitButton(driver);
            

            //account must be valid that we are testing with
            Email.SendKeys("test@nbcc.ca");
            Pass.SendKeys("Password1!");
            Thread.Sleep(1000);
            Submit.Click();

            Thread.Sleep(2000);
            IWebElement DrugButton = HomeElements.DrugsButton(driver);

            DrugButton.Click();

            if (driver.Url == BaseUrl + "/drugs")
            {
                return true;
            }
            else if (driver.Url == BaseUrl + "/home")
            {
                return false;
            }
            else
            {
                return false;
            }
        }

        public static bool TestPhysiciansButton(IWebDriver driver, string BaseUrl)
        {
            IWebElement Email = LoginElements.LoginEmail(driver);
            IWebElement Pass = LoginElements.LoginPass(driver);
            IWebElement Submit = LoginElements.LoginSubmitButton(driver);


            //account must be valid that we are testing with
            Email.SendKeys("test@nbcc.ca");
            Pass.SendKeys("Password1!");
            Thread.Sleep(1000);
            Submit.Click();
            Thread.Sleep(2000);
            IWebElement PhysicianButton = HomeElements.PhysicianButton(driver);

            PhysicianButton.Click();

            if (driver.Url == BaseUrl + "/physicians")
            {
                return true;
            }
            else if (driver.Url == BaseUrl + "/home")
            {
                return false;
            }
            else
            {
                return false;
            }
        }

        public static bool TestPatientsButton(IWebDriver driver, string BaseUrl)
        {
            IWebElement Email = LoginElements.LoginEmail(driver);
            IWebElement Pass = LoginElements.LoginPass(driver);
            IWebElement Submit = LoginElements.LoginSubmitButton(driver);


            //account must be valid that we are testing with
            Email.SendKeys("test@nbcc.ca");
            Pass.SendKeys("Password1!");
            Thread.Sleep(1000);
            Submit.Click();
            Thread.Sleep(2000);
            IWebElement PatientsButton = HomeElements.PatientsButton(driver);

            PatientsButton.Click();

            if (driver.Url == BaseUrl + "/patients")
            {
                return true;
            }
            else if (driver.Url == BaseUrl + "/home")
            {
                return false;
            }
            else
            {
                return false;
            }
        }

        public static bool TestOrdersButton(IWebDriver driver, string BaseUrl)
        {
            IWebElement Email = LoginElements.LoginEmail(driver);
            IWebElement Pass = LoginElements.LoginPass(driver);
            IWebElement Submit = LoginElements.LoginSubmitButton(driver);


            //account must be valid that we are testing with
            Email.SendKeys("test@nbcc.ca");
            Pass.SendKeys("Password1!");
            Thread.Sleep(1000);
            Submit.Click();
            Thread.Sleep(2000);
            IWebElement OrdersButton = HomeElements.OrdersButton(driver);

            OrdersButton.Click();

            if (driver.Url == BaseUrl + "/orders")
            {
                return true;
            }
            else if (driver.Url == BaseUrl + "/home")
            {
                return false;
            }
            else
            {
                return false;
            }
        }

        public static bool TestVerificationButton(IWebDriver driver, string BaseUrl)
        {
            IWebElement Email = LoginElements.LoginEmail(driver);
            IWebElement Pass = LoginElements.LoginPass(driver);
            IWebElement Submit = LoginElements.LoginSubmitButton(driver);


            //account must be valid that we are testing with
            Email.SendKeys("test@nbcc.ca");
            Pass.SendKeys("Password1!");
            Thread.Sleep(1000);
            Submit.Click();
            Thread.Sleep(2000);
            IWebElement VerificationButton = HomeElements.VerificationButton(driver);

            VerificationButton.Click();

            if (driver.Url == BaseUrl + "/verification")
            {
                return true;
            }
            else if (driver.Url == BaseUrl + "/home")
            {
                return false;
            }
            else
            {
                return false;
            }
        }
    }
}
