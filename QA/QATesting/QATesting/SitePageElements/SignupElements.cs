using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium;

namespace QATesting.SitePageElements
{
    internal class SignupElements
    {
        public static IWebElement FirstName(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(FirstNameSelector()));
        }
        public static string FirstNameSelector()
        {
            return "#firstName";
        }

        public static IWebElement LastName(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(LastNameSelector()));
        }
        public static string LastNameSelector()
        {
            return ".right > input:nth-child(3)";
        }

        public static IWebElement Campus(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(CampusSelector()));
        }
        public static string CampusSelector()
        {
            return ".combo-input";
        }

        public static IWebElement Email(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(EmailSelector()));
        }
        public static string EmailSelector()
        {
            return "input.text-input:nth-child(9)";
        }

        public static IWebElement Password(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(PasswordSelector()));
        }
        public static string PasswordSelector()
        {
            return ".left > input:nth-child(15)";
        }

        public static IWebElement ConfirmPassword(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(ConfirmPasswordSelector()));
        }
        public static string ConfirmPasswordSelector()
        {
            return ".right > input:nth-child(15)";
        }

        public static IWebElement Submit(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(SubmitSelector()));
        }
        public static string SubmitSelector()
        {
            return "button.button:nth-child(5)";
        }

        public static IWebElement ModalAlert(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(ModalAlertSelector()));
        }

        public static string ModalAlertSelector()
        {
            return ".modal-body > h5:nth-child(1)";
        }

        public static IWebElement ModalAlertCloseButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(ModalAlertCloseButtonSelector()));
        }

        public static string ModalAlertCloseButtonSelector()
        {
            return ".btn-close";
        }
    }
}
