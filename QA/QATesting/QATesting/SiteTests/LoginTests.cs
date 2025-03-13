using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium;
using OpenQA.Selenium.Internal;
using QATesting.SitePageElements;
using static System.Net.WebRequestMethods;

namespace QATesting.SiteTests
{
    internal class LoginTests
    {
        public static bool TestValidLogin(IWebDriver driver, string BaseUrl)
        {
            IWebElement Email = LoginElements.LoginEmail(driver);
            IWebElement Pass = LoginElements.LoginPass(driver);
            IWebElement Submit = LoginElements.LoginSubmitButton(driver);
            
            //account must be valid that we are testing with
            Email.SendKeys("test@nbcc.ca");
            Pass.SendKeys("Password1!");
            Thread.Sleep(1000);
            Submit.Click();
            Thread.Sleep(1000);

            if (driver.Url == BaseUrl+"/login")
            {
                return false;
            }
            else if (driver.Url == BaseUrl+"/home")
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public static bool TestFailedLogin(IWebDriver driver, string BaseUrl)
        {
            IWebElement Email = LoginElements.LoginEmail(driver);
            IWebElement Pass = LoginElements.LoginPass(driver);
            IWebElement Submit = LoginElements.LoginSubmitButton(driver);

            //account must be valid that we are testing with
            Email.SendKeys("test@nbcc.ca");
            Pass.SendKeys("Password!");
            Thread.Sleep(1000);
            Submit.Click();
            Thread.Sleep(1000);

            if (driver.Url == BaseUrl + "/login")
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
