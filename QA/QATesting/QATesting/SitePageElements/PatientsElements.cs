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
            return driver.FindElement(By.CssSelector(CheckboxPatientSelector()));
        }
        public static string CheckboxPatientSelector()
        {
            return ".page-container > div:nth-child(3) > table:nth-child(5) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1) > input:nth-child(1)";
        }
        public static IWebElement PatientTable(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(PatientTableSelector()));
        }
        public static string PatientTableSelector()
        {
            return ".page-container > div:nth-child(3) > table:nth-child(5)";
        }
        public static IWebElement PatientTableLoading(IWebElement driver)
        {
            return driver.FindElement(By.CssSelector(PatientTableLoadingSelector())); //fetching data label
        }
        public static string PatientTableLoadingSelector()
        {
            return ".page-container > div:nth-child(3) > label:nth-child(5)";
        }
        public static IWebElement EditPatientButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(EditPatientButtonSelector()));
        }
        public static string EditPatientButtonSelector()
        {
            return "#editPatient";
        }
        public static IWebElement EditPatientName(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(EditPatientNameSelector()));
        }
        public static string EditPatientNameSelector()
        {
            return "#firstName";
        }
        public static IWebElement EditPatientSubmitButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(EditPatientSubmitButtonSelector()));
        }
        public static string EditPatientSubmitButtonSelector()
        {
            return ".button";
        }
        public static IWebElement AddPatientButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(AddPatientButtonSelector()));
        }
        public static string AddPatientButtonSelector()
        {
            return "#addPatient";
        }
        public static IWebElement EditPatientAlertMessage(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(EditPatientAlertMessageSelector()));
        }
        public static string EditPatientAlertMessageSelector()
        {
            return ".modal-body > h5:nth-child(1)";
        }
    }
}
