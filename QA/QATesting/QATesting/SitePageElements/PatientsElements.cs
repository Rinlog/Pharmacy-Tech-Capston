using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
        public static ReadOnlyCollection<IWebElement> AllPatients(IWebDriver driver)
        {
            return driver.FindElements(By.CssSelector(AllPatientsSelector()));
        }
        public static string AllPatientsSelector()
        {
            return "table tbody tr";
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
        public static IWebElement AlertMessage(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(AlertMessageSelector()));
        }
        public static string AlertMessageSelector()
        {
            return ".modal-body > h5:nth-child(1)";
        }
        //delete elements
        public static IWebElement DeletePatientButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(DeletePatientButtonSelector()));
        }
        public static string DeletePatientButtonSelector()
        {
            return "#deletePatient";
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
        public static IWebElement BulkAddPatientButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(BulkAddPatientButtonSelector()));
        }
        public static string BulkAddPatientButtonSelector()
        {
            return "#bulkPatient";
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

        //add patient (single) below
        public static IWebElement Submit(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(SubmitSelector()));
        }
        public static string SubmitSelector()
        {
            return ".modal-body > form:nth-child(1) > button:nth-child(2)";
        }

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
        public static IWebElement DOB(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(DOBSelector()));
        }
        public static string DOBSelector()
        {
            return "#dob";
        }
        public static IWebElement Sex(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(SexSelector()));
        }
        public static string SexSelector()
        {
            return "#sex";
        }
        public static IWebElement Address(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(AddressSelector()));
        }
        public static string AddressSelector()
        {
            return "#address";
        }
        public static IWebElement City(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(CitySelector()));
        }
        public static string CitySelector()
        {
            return "#city";
        }
        public static IWebElement Hospital(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(HospitalSelector()));
        }
        public static string HospitalSelector()
        {
            return "#hospital";
        }
        public static IWebElement Unit(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(UnitSelector()));
        }
        public static string UnitSelector()
        {
            return "#unit";
        }
        public static IWebElement Room(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(RoomSelector()));
        }
        public static string RoomSelector()
        {
            return "#room";
        }
        public static IWebElement Allergies(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(AllergiesSelector()));
        }
        public static string AllergiesSelector()
        {
            return "#allergies";
        }
        public static IWebElement Conditions(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(ConditionsSelector()));
        }
        public static string ConditionsSelector()
        {
            return "#conditions";
        }



    }
}
