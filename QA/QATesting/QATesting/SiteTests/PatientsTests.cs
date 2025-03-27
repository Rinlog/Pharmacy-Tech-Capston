using Bogus;
using OpenQA.Selenium;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium.Support.UI;
using QATesting.Methods;
using QATesting.SitePageElements;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace QATesting.SiteTests
{
    internal class PatientsTests
    {
        public static bool TestViewPatient(IWebDriver driver, string BaseUrl)
        {
            IWebElement Email = LoginElements.LoginEmail(driver);
            IWebElement Pass = LoginElements.LoginPass(driver);
            IWebElement Submit = LoginElements.LoginSubmitButton(driver);


            //account must be valid that we are testing with
            Email.SendKeys("test@nbcc.ca");
            Pass.SendKeys("Password1!");
            Thread.Sleep(250);
            Submit.Click();

            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            try
            {
                wait.Until(e => e.FindElements(By.CssSelector(HomeElements.PatientsButtonSelector())).Count == 1);
                IWebElement PatientButton = HomeElements.PatientsButton(driver);
                PatientButton.Click();
                wait.Until(e =>
                {
                    var result1 = e.FindElements(By.CssSelector(PatientsElements.PatientTableSelector())).Count == 1;
                    return result1;
                }); //waits for table to appear, or for loading text to appear, if they appear than we know that we can view the patient page
                return true;


            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }
        public static bool TestAddPatientSingle(IWebDriver driver, string BaseUrl)
        {
            try
            {
                if (PatientsTests.TestViewPatient(driver, BaseUrl))
                {
                    MultiWait.Wait(PatientsElements.AddPatientButtonSelector(), driver);
                    var AddPatient = PatientsElements.AddPatientButton(driver);
                    AddPatient.Click();

                    MultiWait.Wait(
                        PatientsElements.FirstNameSelector(),
                        PatientsElements.LastNameSelector(),
                        PatientsElements.DOBSelector(),
                        PatientsElements.SexSelector(),
                        PatientsElements.AddressSelector(),
                        PatientsElements.CitySelector(),
                        PatientsElements.HospitalSelector(),
                        PatientsElements.UnitSelector(),
                        PatientsElements.RoomSelector(),
                        PatientsElements.AllergiesSelector(),
                        PatientsElements.ConditionsSelector(),
                        PatientsElements.SubmitSelector(),
                        driver
                        );
                    var FName = PatientsElements.FirstName(driver);
                    var LName = PatientsElements.LastName(driver);
                    var DOB = PatientsElements.DOB(driver);
                    var Sex = PatientsElements.Sex(driver);
                    var Address = PatientsElements.Address(driver);
                    var City = PatientsElements.City(driver);
                    var Hospital = PatientsElements.Hospital(driver);
                    var Unit = PatientsElements.Unit(driver);
                    var Room = PatientsElements.Room(driver);
                    var Allergies = PatientsElements.Allergies(driver);
                    var Conditions = PatientsElements.Conditions(driver);
                    var Submit = PatientsElements.Submit(driver);

                    FName.SendKeys("Fake QA Patient");
                    LName.SendKeys("Blah");
                    //regardless of locale we will format the date yyyy-mm-dd because thats how firefox wants the value, browser will auto translate into locale
                    Faker fake = new Faker();
                    DateOnly FakeDate = fake.Date.RecentDateOnly();
                    var Month = (FakeDate.Month.ToString().Length == 2) ? FakeDate.Month.ToString() : "0" + FakeDate.Month.ToString();
                    var Day = (FakeDate.Day.ToString().Length == 2) ? FakeDate.Day.ToString() : "0" + FakeDate.Day.ToString();
                    string StringFakeDate = FakeDate.Year.ToString() + "-" + Month + "-" + Day;
                    DOB.SendKeys(StringFakeDate);
                    new SelectElement(Sex).SelectByText("Male");
                    Address.SendKeys("123 Foo st.");
                    City.SendKeys("Fredericton");
                    Hospital.SendKeys("QA Hospital");
                    Room.SendKeys("123");
                    Unit.SendKeys("456");
                    Allergies.SendKeys("Air");
                    Conditions.SendKeys("Fractured Spinal, Discombobulated");
                    Submit.Click();

                    MultiWait.Wait(PatientsElements.AlertMessageSelector(), driver);
                    var AlertMessage = PatientsElements.AlertMessage(driver);
                    if (AlertMessage.Text.ToLower().Contains("patient added"))
                    {
                        return true;
                    }
                    else { return false; }

                }
                else
                {
                    return false;
                }
            }
            catch (Exception e) {
                Thread.Sleep(5000);
                Console.WriteLine(e.Message);
                return false;
            }
        }
        public static bool TestAddPatientBulk(IWebDriver driver, string BaseUrl)
        {
            try
            {
                if (PatientsTests.TestViewPatient(driver, BaseUrl))
                {
                    MultiWait.Wait(PatientsElements.BulkAddPatientButtonSelector(), driver);
                    var BAddPatientButton = PatientsElements.BulkAddPatientButton(driver);
                    BAddPatientButton.Click();
                    MultiWait.Wait(
                        PatientsElements.ConfirmBulkAddButtonSelector(),
                        PatientsElements.BulkAddFileSelectSelector(),
                        driver);
                    var FileSelect = PatientsElements.BulkAddFileSelect(driver);
                    var ConfirmBulkAdd = PatientsElements.ConfirmBulkAddButton(driver);

                    //sending bulk add file name, make sure it exists or else test will fail
                    string Path = System.IO.Path.GetFullPath("../../../../BulkAdd/Patient.xlsx");
                    FileSelect.SendKeys(Path);

                    ConfirmBulkAdd.Click();
                    MultiWait.Wait(PatientsElements.AlertMessageSelector(), driver);
                    var AlertMessage = PatientsElements.AlertMessage(driver);
                    if (AlertMessage.Text.ToLower().Contains("all patients added successfully"))
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                Thread.Sleep(5000);
                return false;
            }
        }
        public static bool TestDeletePatient(IWebDriver driver, string BaseUrl, bool Multi = false)
        {
            try
            {
                if (PatientsTests.TestViewPatient(driver, BaseUrl))
                {
                    var AllPatients = PatientsElements.AllPatients(driver);
                    UtilityMethods.SelectTestItem(2, AllPatients, "Edit Test Patient", "Fake QA Patient", driver, Multi);

                    var DeletePatients = PatientsElements.DeletePatientButton(driver);
                    IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
                    js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", DeletePatients);
                    Thread.Sleep(500);
                    DeletePatients.Click();

                    MultiWait.Wait(PatientsElements.ConfirmDeleteSelector(), driver);
                    var ConfirmDelete = PatientsElements.ConfirmDelete(driver);
                    ConfirmDelete.Click();

                    MultiWait.Wait(PatientsElements.ConfirmConfirmDeleteSelector(), driver);
                    var ConfirmConfirmDelete = PatientsElements.ConfirmConfirmDelete(driver);
                    ConfirmConfirmDelete.Click();

                    MultiWait.Wait(PatientsElements.AlertMessageSelector(), driver);
                    var AlertMessage = PatientsElements.AlertMessage(driver);
                    if (AlertMessage.Text.ToLower().Contains("patient deleted") || AlertMessage.Text.ToLower().Contains("patients deleted"))
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                Thread.Sleep(5000);
                return false;
            }
        }
        public static bool TestEditPatient(IWebDriver driver, string BaseUrl)
        {
            IWebElement Email = LoginElements.LoginEmail(driver);
            IWebElement Pass = LoginElements.LoginPass(driver);
            IWebElement Submit = LoginElements.LoginSubmitButton(driver);

            //account must be valid that we are testing with
            Email.SendKeys("test@nbcc.ca");
            Pass.SendKeys("Password1!");
            Thread.Sleep(250);
            Submit.Click();
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));

            try
            {
                wait.Until(e => e.FindElements(By.CssSelector(HomeElements.PatientsButtonSelector())).Count == 1);
                IWebElement PatientButton = HomeElements.PatientsButton(driver);
                PatientButton.Click();

                var AllPatients = PatientsElements.AllPatients(driver);
                UtilityMethods.SelectTestItem(2, AllPatients, "Edit Test Patient", "Fake QA Patient", driver, false);


                wait.Until(e => e.FindElements(By.CssSelector(PatientsElements.EditPatientButtonSelector())).Count == 1);
                IWebElement EditPatientButton = PatientsElements.EditPatientButton(driver);
                IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
                js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", EditPatientButton);
                Thread.Sleep(500);
                EditPatientButton.Click();

                wait.Until(e => e.FindElements(By.CssSelector(PatientsElements.EditPatientNameSelector())).Count == 1);
                IWebElement EditPatientName = PatientsElements.EditPatientName(driver);
                EditPatientName.Clear();
                EditPatientName.SendKeys("Edit Test Patient");

                wait.Until(e => e.FindElements(By.CssSelector(PatientsElements.EditPatientSubmitButtonSelector())).Count == 1);
                IWebElement EditPatientSubmitButton = PatientsElements.EditPatientSubmitButton(driver);
                js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", EditPatientSubmitButton);
                Thread.Sleep(500);
                EditPatientSubmitButton.Click();

                wait.Until(e => e.FindElements(By.CssSelector(PatientsElements.AlertMessageSelector())).Count == 1);
                var PatientAlert = PatientsElements.AlertMessage(driver);
                if (PatientAlert.Text == "Patient edited successfully")
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
