using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium;
using OpenQA.Selenium.Internal;
using OpenQA.Selenium.Support.UI;
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
            Thread.Sleep(250);
            Submit.Click();
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            try
            {
                var PageLoaded = wait.Until(e => e.Url == BaseUrl + "/home");

                if (driver.Url == BaseUrl + "/login")
                {
                    return false;
                }
                else if (driver.Url == BaseUrl + "/home")
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public static bool TestFailedLogin(IWebDriver driver, string BaseUrl)
        {
            IWebElement Email = LoginElements.LoginEmail(driver);
            IWebElement Pass = LoginElements.LoginPass(driver);
            IWebElement Submit = LoginElements.LoginSubmitButton(driver);

            //account must be INVALID that we are testing with
            Email.SendKeys("test@nbcc.ca");
            Pass.SendKeys("Password!");
            Thread.Sleep(250);
            Submit.Click();

            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30))
            {
                PollingInterval = TimeSpan.FromSeconds(1)
            };
            try
            {
                wait.Until(e => e.FindElements(By.CssSelector(LoginElements.LoginAlertSelector())).Count == 1); //waits until the alert pops up
                var AlertPopup = LoginElements.LoginAlertResponse(driver);
                if (AlertPopup.Text.ToLower().Contains("wrong email or password"))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
