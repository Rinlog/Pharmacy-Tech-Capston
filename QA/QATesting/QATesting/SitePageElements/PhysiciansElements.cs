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
            return driver.FindElement(By.CssSelector(CheckboxPhysicianSelector()));
        }
        public static string CheckboxPhysicianSelector()
        {
            return ".page-container > div:nth-child(3) > table:nth-child(5) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1) > input:nth-child(1)";
        }
        public static IWebElement PhysicianTable(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(PhysicianTableSelector()));
        }
        public static string PhysicianTableSelector()
        {
            return ".page-container > div:nth-child(3) > table:nth-child(5)";
        }
        public static IWebElement PhysicianTableLoading(IWebElement driver)
        {
            return driver.FindElement(By.CssSelector(PhysicianTableLoadingSelector())); //fetching data label
        }
        public static string PhysicianTableLoadingSelector()
        {
            return ".page-container > div:nth-child(3) > label:nth-child(5)";
        }
        public static IWebElement EditPhysicianButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(EditPhysicianButtonSelector()));
        }
        public static string EditPhysicianButtonSelector()
        {
            return "#editPhysician";
        }
        public static IWebElement EditPhysicianName(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(EditPhysicianNameSelector()));
        }
        public static string EditPhysicianNameSelector()
        {
            return "#firstName";
        }
        public static IWebElement EditPhysicianSubmitButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(EditPhysicianSubmitButtonSelector()));
        }
        public static string EditPhysicianSubmitButtonSelector()
        {
            return ".button";
        }
        public static IWebElement AddPhysicianButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(AddPhysicianButtonSelector()));
        }
        public static string AddPhysicianButtonSelector()
        {
            return "#addPhysician";
        }
        public static IWebElement EditPhysicianAlertMessage(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(EditPhysicianAlertMessageSelector()));
        }
        public static string EditPhysicianAlertMessageSelector()
        {
            return ".modal-body > h5:nth-child(1)";
        }
    }
}
