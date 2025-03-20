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
    internal class VerificationTests
    {
        public static bool US7TestApprovedVerification(IWebDriver driver, string BaseURL)
        {
            if (LoginTests.LoginAsUserSpecified(driver, BaseURL,"test5@nbcc.ca","Password1!"))
            {
                MultiWait.Wait(HomeElements.VerificationButtonSelector(), driver);
                var VerificationButton = HomeElements.VerificationButton(driver);
                IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
                js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", VerificationButton);
                Thread.Sleep(500);
                VerificationButton.Click();
                MultiWait.Wait(VerificationElements.VerificationTableSelector(), driver);
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
