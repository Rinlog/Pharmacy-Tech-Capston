using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
        public static ReadOnlyCollection<IWebElement> AllPhysicians(IWebDriver driver)
        {
            return driver.FindElements(By.CssSelector(AllPhysiciansSelector()));
        }
        public static string AllPhysiciansSelector()
        {
            return "table tbody tr";
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
        public static IWebElement AlertMessage(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(AlertMessageSelector()));
        }
        public static string AlertMessageSelector()
        {
            return ".modal-body > h5:nth-child(1)";
        }

        //add Physician (single) elements below
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
            return "#lastName";
        }
        public static IWebElement City(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(CitySelector()));
        }
        public static string CitySelector()
        {
            return "#city";
        }
        public static IWebElement Province(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(ProvinceSelector()));
        }
        public static string ProvinceSelector()
        {
            return "#province";
        }
        public static IWebElement Submit(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(SubmitSelector()));
        }
        public static string SubmitSelector()
        {
            return ".modal-body > form:nth-child(1) > button:nth-child(13)";
        }

        //delete elements
        public static IWebElement DeletePhysicianButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(DeletePhysicianButtonSelector()));
        }
        public static string DeletePhysicianButtonSelector()
        {
            return "#deletePhysician";
        }
        public static IWebElement ConfirmDelete(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(ConfirmDeleteSelector()));
        }
        public static string ConfirmDeleteSelector()
        {
            return ".ModalbuttonG";
        }
        public static IWebElement ConfirmConfirmDelete(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(ConfirmConfirmDeleteSelector()));
        }
        public static string ConfirmConfirmDeleteSelector()
        {
            return "div.fade:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > button:nth-child(3)";
        }
        //bulk below
        public static IWebElement BulkAddPhysicianButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(BulkAddPhysicianButtonSelector()));
        }
        public static string BulkAddPhysicianButtonSelector()
        {
            return "#bulkPhysician";
        }
        public static IWebElement BulkAddFileSelect(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(BulkAddFileSelectSelector()));
        }
        public static string BulkAddFileSelectSelector()
        {
            return ".page-container > div:nth-child(3) > div:nth-child(5) > div:nth-child(2) > input:nth-child(1)";

        }
        public static IWebElement ConfirmBulkAddButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(ConfirmBulkAddButtonSelector()));
        }
        public static string ConfirmBulkAddButtonSelector()
        {
            return ".button";
        }
    }
}
