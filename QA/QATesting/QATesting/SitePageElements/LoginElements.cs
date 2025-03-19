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
            return driver.FindElement(By.CssSelector(LoginEmailSelector()));
        }
        public static string LoginEmailSelector()
        {
            return "input[qa-id='Email']";
        }
        public static IWebElement LoginPass(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(LoginPassSelector()));
        }
        public static string LoginPassSelector()
        {
            return "input[qa-id='Password']";
        }
        public static IWebElement LoginSubmitButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(LoginSubmitButtonSelector()));
        }
        public static string LoginSubmitButtonSelector()
        {
            return "button[qa-id='Login']";
        }
        public static IWebElement LoginSignUp(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(LoginSignUpSelector()));
        }
        public static string LoginSignUpSelector()
        {
            return "button[qa-id='SignUp']";
        }
        public static IWebElement LoginResetPass(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(LoginResetPassSelector()));
        }
        public static string LoginResetPassSelector()
        {
            return "button[qa-id='ResetPass']";
        }
        public static IWebElement LoginAlert(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(LoginAlertSelector()));
        }
        public static string LoginAlertSelector()
        {
            return ".modal-body > h5:nth-child(1)";
        }
        public static IWebElement ResetPassInputBox(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(ResetPassInputBoxSelector()));
        }
        public static string ResetPassInputBoxSelector()
        {
            return ".form-control";
        }
        public static IWebElement ResetPassSubmit(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(ResetPassSubmitSelector()));
        }
        public static string ResetPassSubmitSelector()
        {
            return ".ModalbuttonG";
        }
    }
}
