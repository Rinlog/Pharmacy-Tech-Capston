using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QATesting.SitePageElements
{
    internal class PhysiciansElements
    {
        public static IWebElement CheckboxPhysician(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(".page-container > div:nth-child(3) > table:nth-child(5) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1) > input:nth-child(1)"));
        }
        public static IWebElement EditPhysicianButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector("#editPhysician"));
        }
        public static IWebElement EditPhysicianName(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector("#firstName"));
        }
        public static IWebElement EditPhysicianSubmitButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(".button"));
        }
        public static IWebElement AddPhysicianButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector("#addPhysician"));
        }
        public static IWebElement EditPhysicianAlertMessage(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(".modal-body > h5:nth-child(1)"));
        }
    }
}
