using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium;
using QATesting.SitePageElements;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QATesting.SiteTests
{
    internal class TimeOutTest
    {
        public static bool TestTimeOut(IWebDriver driver, string BaseUrl)
        {
            IWebElement Email = LoginElements.LoginEmail(driver);
            IWebElement Pass = LoginElements.LoginPass(driver);
            IWebElement Submit = LoginElements.LoginSubmitButton(driver);


            //account must be valid that we are testing with
            Email.SendKeys("test@nbcc.ca");
            Pass.SendKeys("Password1!");
            Thread.Sleep(250);
            Submit.Click();

            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromMinutes(3));
            try
            {
                wait.Until(e => e.FindElements(By.CssSelector(TimeOutElement.TimeoutSelector())).Count == 1);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }
    }
}
