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
            return driver.FindElement(By.CssSelector(".scroll-table > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1) > input:nth-child(1)"));
        }
        public static IWebElement DrugTable(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(".scroll-table"));
        }
        public static IWebElement DrugTableLoading(IWebElement driver)
        {
            return driver.FindElement(By.CssSelector(".page-container > div:nth-child(3) > label:nth-child(5)")); //fetching data label
        }
        public static IWebElement EditDrugButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector("#editDrug"));
        }
        public static IWebElement EditDrugName(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector("#drugName"));
        }
        public static IWebElement EditDrugSubmitButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(".button"));
        }
        public static IWebElement AddDrugButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector("#addDrug"));
        }
        public static IWebElement EditDrugsAlertMessage(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(".modal-body > h5:nth-child(1)"));
        }
    }
}
