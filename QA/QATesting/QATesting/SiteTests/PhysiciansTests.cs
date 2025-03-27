using Bogus;
using OpenQA.Selenium;
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
    internal class PhysiciansTests
    {
        public static bool TestViewPhysician(IWebDriver driver, string BaseUrl)
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
                wait.Until(e => e.FindElements(By.CssSelector(HomeElements.PhysicianButtonSelector())).Count == 1);
                IWebElement PhysicianButton = HomeElements.PhysicianButton(driver);
                PhysicianButton.Click();
                wait.Until(e =>
                {
                    var result1 = e.FindElements(By.CssSelector(PhysiciansElements.PhysicianTableSelector())).Count == 1;
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
        public static bool TestAddPhysicianSingle(IWebDriver driver, string BaseUrl)
        {
            try
            {
                if (PhysiciansTests.TestViewPhysician(driver, BaseUrl))
                {
                    MultiWait.Wait(PhysiciansElements.AddPhysicianButtonSelector(), driver);
                    var AddPhysicianButton = PhysiciansElements.AddPhysicianButton(driver);
                    AddPhysicianButton.Click();

                    MultiWait.Wait(
                        PhysiciansElements.FirstNameSelector(),
                        PhysiciansElements.LastNameSelector(),
                        PhysiciansElements.CitySelector(),
                        PhysiciansElements.ProvinceSelector(),
                        PhysiciansElements.SubmitSelector(),
                        driver
                        );
                    var FName = PhysiciansElements.FirstName(driver);
                    var LName = PhysiciansElements.LastName(driver);
                    var City = PhysiciansElements.City(driver);
                    var Province = PhysiciansElements.Province(driver);
                    var Submit = PhysiciansElements.Submit(driver);
                    FName.SendKeys("Fake QA Physician");
                    LName.SendKeys("Blah");
                    City.SendKeys("Fredericton");
                    new SelectElement(Province).SelectByText("New Brunswick");
                    Submit.Click();
                    MultiWait.Wait(PhysiciansElements.AlertMessageSelector(), driver);
                    var AlertMessage = PhysiciansElements.AlertMessage(driver);
                    if (AlertMessage.Text.ToLower().Contains("physician added"))
                    {
                        return true;
                    }
                    else return false;
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
        public static bool TestAddPhysicianBulk(IWebDriver driver, string BaseUrl)
        {
            try
            {
                if (PhysiciansTests.TestViewPhysician(driver, BaseUrl))
                {
                    MultiWait.Wait(PhysiciansElements.BulkAddPhysicianButtonSelector(), driver);
                    var BAddPhysicianButton = PhysiciansElements.BulkAddPhysicianButton(driver);
                    BAddPhysicianButton.Click();
                    MultiWait.Wait(
                        PhysiciansElements.ConfirmBulkAddButtonSelector(),
                        PhysiciansElements.BulkAddFileSelectSelector(),
                        driver);
                    var FileSelect = PhysiciansElements.BulkAddFileSelect(driver);
                    var ConfirmBulkAdd = PhysiciansElements.ConfirmBulkAddButton(driver);

                    //sending bulk add file name, make sure it exists or else test will fail
                    string Path = System.IO.Path.GetFullPath("../../../../BulkAdd/Physician.xlsx");
                    FileSelect.SendKeys(Path);

                    ConfirmBulkAdd.Click();
                    MultiWait.Wait(PhysiciansElements.AlertMessageSelector(), driver);
                    var AlertMessage = PhysiciansElements.AlertMessage(driver);
                    if (AlertMessage.Text.ToLower().Contains("all physicians added successfully"))
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
        public static bool TestDeletePhysician(IWebDriver driver, string BaseUrl, bool Multi = false)
        {
            try
            {
                if (PhysiciansTests.TestViewPhysician(driver, BaseUrl))
                {
                    var AllPhysicians = PhysiciansElements.AllPhysicians(driver);
                    UtilityMethods.SelectTestItem(2, AllPhysicians, "Edit Test Physician", "Fake QA Physician", driver, Multi);

                    var DeletePhysicians = PhysiciansElements.DeletePhysicianButton(driver);
                    IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
                    js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", DeletePhysicians);
                    Thread.Sleep(500);
                    DeletePhysicians.Click();

                    MultiWait.Wait(PhysiciansElements.ConfirmDeleteSelector(), driver);
                    var ConfirmDelete = PhysiciansElements.ConfirmDelete(driver);
                    ConfirmDelete.Click();

                    MultiWait.Wait(PhysiciansElements.ConfirmConfirmDeleteSelector(), driver);
                    var ConfirmConfirmDelete = PhysiciansElements.ConfirmConfirmDelete(driver);
                    ConfirmConfirmDelete.Click();

                    MultiWait.Wait(PhysiciansElements.AlertMessageSelector(), driver);
                    var AlertMessage = PhysiciansElements.AlertMessage(driver);
                    if (AlertMessage.Text.ToLower().Contains("physician deleted successfully"))
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
        public static bool TestEditPhysician(IWebDriver driver, string BaseUrl)
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
                wait.Until(e => e.FindElements(By.CssSelector(HomeElements.PhysicianButtonSelector())).Count == 1);
                IWebElement PhysicianButton = HomeElements.PhysicianButton(driver);
                PhysicianButton.Click();

                var AllPhysicians = PhysiciansElements.AllPhysicians(driver);
                UtilityMethods.SelectTestItem(2, AllPhysicians, "Edit Test Physician", "Fake QA Physician", driver, false);

                wait.Until(e => e.FindElements(By.CssSelector(PhysiciansElements.EditPhysicianButtonSelector())).Count == 1);
                IWebElement EditPhysicianButton = PhysiciansElements.EditPhysicianButton(driver);
                IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
                js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", EditPhysicianButton);
                Thread.Sleep(500);
                EditPhysicianButton.Click();

                wait.Until(e => e.FindElements(By.CssSelector(PhysiciansElements.EditPhysicianNameSelector())).Count == 1);
                IWebElement EditPhysicianName = PhysiciansElements.EditPhysicianName(driver);
                EditPhysicianName.Clear();
                EditPhysicianName.SendKeys("Edit Test Physician");

                wait.Until(e => e.FindElements(By.CssSelector(PhysiciansElements.EditPhysicianSubmitButtonSelector())).Count == 1);
                IWebElement EditPhysicianSubmitButton = PhysiciansElements.EditPhysicianSubmitButton(driver);
                EditPhysicianSubmitButton.Click();


                wait.Until(e => e.FindElements(By.CssSelector(PhysiciansElements.AlertMessageSelector())).Count == 1);
                var PhysicianAlert = PhysiciansElements.AlertMessage(driver);
                if (PhysicianAlert.Text == "Physician edited successfully")
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
