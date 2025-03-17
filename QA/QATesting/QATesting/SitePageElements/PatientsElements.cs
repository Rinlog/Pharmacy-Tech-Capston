using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QATesting.SitePageElements
{
    internal class PatientsElements
    {
        public static IWebElement CheckboxPatient(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(".page-container > div:nth-child(3) > table:nth-child(5) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1) > input:nth-child(1)"));
        }
        public static IWebElement EditPatientButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector("#editPatient"));
        }
        public static IWebElement EditPatientName(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector("#firstName"));
        }
        public static IWebElement EditPatientSubmitButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(".button"));
        }
        public static IWebElement AddPatientButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector("#addPatient"));
        }
        public static IWebElement EditPatientAlertMessage(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(".modal-body > h5:nth-child(1)"));
        }
    }
}
