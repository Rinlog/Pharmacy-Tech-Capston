using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QATesting.SitePageElements
{
    internal class DrugsElements
    {
        public static IWebElement CheckboxDrug(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(CheckboxDrugSelector()));
        }
        public static string CheckboxDrugSelector()
        {
            return ".scroll-table > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1) > input:nth-child(1)";
        }
        public static IWebElement DrugTable(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(DrugTableSelector()));
        }
        public static string DrugTableSelector()
        {
            return ".scroll-table";
        }
        public static IWebElement DrugTableLoading(IWebElement driver)
        {
            return driver.FindElement(By.CssSelector(DrugTableLoadingSelector())); //fetching data label
        }
        public static string DrugTableLoadingSelector()
        {
            return ".page-container > div:nth-child(3) > label:nth-child(5)";
        }
        public static IWebElement EditDrugButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(EditDrugButtonSelector()));
        }
        public static string EditDrugButtonSelector()
        {
            return "#editDrug";
        }
        public static IWebElement EditDrugName(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(EditDrugNameSelector()));
        }
        public static string EditDrugNameSelector()
        {
            return "#drugName";
        }
        public static IWebElement EditDrugSubmitButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(EditDrugSubmitButtonSelector()));
        }
        public static string EditDrugSubmitButtonSelector()
        {
            return ".button";
        }
        public static IWebElement AddDrugButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(AddDrugButtonSelector()));
        }
        public static string AddDrugButtonSelector()
        {
            return "#addDrug";
        }
        public static IWebElement EditDrugsAlertMessage(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(EditDrugsAlertMessageSelector()));
        }
        public static string EditDrugsAlertMessageSelector()
        {
            return ".modal-body > h5:nth-child(1)";
        }
    }
}
