using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium;

namespace QATesting.SitePageElements
{
    internal class LoginElements
    {
        public static IWebElement LoginEmail(IWebDriver driver) {
            return driver.FindElement(By.CssSelector("input[qa-id='Email']"));
        }
        public static IWebElement LoginPass(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector("input[qa-id='Password']"));
        }
        public static IWebElement LoginSubmitButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector("button[qa-id='Login']"));
        }
        public static IWebElement LoginSignUp(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector("button[qa-id='SignUp']"));
        }
        public static IWebElement LoginResetPass(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector("button[qa-id='ResetPass']"));
        }
        public static IWebElement LoginAlertResponse(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(LoginAlertSelector()));
        }
        public static string LoginAlertSelector()
        {
            return ".modal-body > h5:nth-child(1)";
        }
    }
}
