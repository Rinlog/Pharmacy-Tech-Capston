using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QATesting.SitePageElements
{
    internal class UserManagementElements
    {
        public static IWebElement EditDeleteButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector("#userEdit"));
        }
        public static IWebElement RadioButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(UserManagementRadioButtonSelector()));
        }
        public static string UserManagementRadioButtonSelector()
        {
            return "input[qa-id^='QATEST']";
        }
        public static IWebElement LastNameEdit(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector("input.text-input:nth-child(7)"));
        }
        public static IWebElement DeleteButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(DeleteButtonSelector()));
        }
        public static string DeleteButtonSelector()
        {
            return "button.button:nth-child(18)";
        }
        public static IWebElement ConfirmDelete(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(".ModalbuttonG"));
        }
        public static IWebElement SecondConfirmDelete(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector("div.fade:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > button:nth-child(2)"));
        }
        public static IWebElement AlertMessage(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(AlertMessageSelector()));
        }
        public static string AlertMessageSelector()
        {
            return ".modal-md > div:nth-child(1) > div:nth-child(2) > h5:nth-child(1)";
        }
    }
}
