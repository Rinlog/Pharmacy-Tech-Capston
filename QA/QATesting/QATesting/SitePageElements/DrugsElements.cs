using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
        public static ReadOnlyCollection<IWebElement> AllDrugs(IWebDriver driver)
        {
            return driver.FindElements(By.CssSelector(AllDrugsSelector()));
        }
        public static string AllDrugsSelector()
        {
            return ".scroll-table tr";
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
        //bulk below
        public static IWebElement BulkAddDrugButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(BulkAddDrugButtonSelector()));
        }
        public static string BulkAddDrugButtonSelector()
        {
            return "#bulkDrug";
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
        //alert messages on drug page
        public static IWebElement AlertMessage(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(AlertMessageSelector()));
        }
        public static string AlertMessageSelector()
        {
            return ".modal-body > h5:nth-child(1)";
        }
        public static IWebElement CloseAlertMessage(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(CloseAlertMessageSelector()));
        }
        public static string CloseAlertMessageSelector()
        {
            return ".modal-md > div:nth-child(1) > div:nth-child(1) > button:nth-child(2)";
        }

        //below is all elements related to add drug(single)
        public static IWebElement DIN(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(DINSelector()));
        }
        public static string DINSelector()
        {
            return "#DIN";
        }
        public static IWebElement DName(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(DNameSelector()));
        }
        public static string DNameSelector()
        {
            return "#drugName";
        }
        public static IWebElement Dosage(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(DosageSelector()));
        }
        public static string DosageSelector()
        {
            return "#dosage";
        }
        public static IWebElement Strength(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(StrengthSelector()));
        }
        public static string StrengthSelector()
        {
            return "#strength";
        }
        public static IWebElement Manufacturer(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(ManufacturerSelector()));
        }
        public static string ManufacturerSelector()
        {
            return "#manufacturer";
        }
        public static IWebElement Concentration(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(ConcentrationSelector()));
        }
        public static string ConcentrationSelector()
        {
            return "#concentration";
        }
        public static IWebElement ReferenceBrand(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(ReferenceBrandSelector()));
        }
        public static string ReferenceBrandSelector()
        {
            return "#referenceBrand";
        }
        public static IWebElement ContainerSize(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(ContainerSizeSelector()));
        }
        public static string ContainerSizeSelector()
        {
            return "#containerSize";
        }
        public static IWebElement Submit(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(SubmitSelector()));
        }
        public static string SubmitSelector()
        {
            return ".modal-body > form:nth-child(1) > button:nth-child(26)";
        }

        //delete drug related elements below
        public static IWebElement DeleteDrugButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(DeleteDrugButtonSelector()));
        }
        public static string DeleteDrugButtonSelector()
        {
            return "#deleteDrug";
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
    }
}
