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
    internal class DrugsTests
    {
        public static bool TestViewDrug(IWebDriver driver, string BaseUrl)
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
                wait.Until(e => e.FindElements(By.CssSelector(HomeElements.DrugButtonSelector())).Count == 1);
                IWebElement DrugButton = HomeElements.DrugsButton(driver);
                DrugButton.Click();
                wait.Until(e => 
                {
                    var result1 = e.FindElements(By.CssSelector(DrugsElements.DrugTableSelector())).Count == 1;
                    return result1;
                }); //waits for table to appear, if it appears than we know that we can view the drug page
                return true;
                

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }
        public static bool TestAddDrugSingle(IWebDriver driver, string BaseUrl)
        {
            try
            {
                if (DrugsTests.TestViewDrug(driver,BaseUrl))
                {
                    MultiWait.Wait(DrugsElements.AddDrugButtonSelector(), driver);
                    var DrugButton = DrugsElements.AddDrugButton(driver);
                    DrugButton.Click();
                    MultiWait.Wait(
                        DrugsElements.DINSelector(),
                        DrugsElements.DNameSelector(),
                        DrugsElements.DosageSelector(),
                        DrugsElements.StrengthSelector(),
                        DrugsElements.ManufacturerSelector(),
                        DrugsElements.ConcentrationSelector(),
                        DrugsElements.ReferenceBrandSelector(),
                        DrugsElements.ContainerSizeSelector(),
                        DrugsElements.SubmitSelector(),
                        driver);
                    var DIN = DrugsElements.DIN(driver);
                    var DName = DrugsElements.DName(driver);
                    var Dosage = DrugsElements.Dosage(driver);
                    var Strength = DrugsElements.Strength(driver);
                    var Manufacturer = DrugsElements.Manufacturer(driver);
                    var Concentration = DrugsElements.Concentration(driver);
                    var ReferenceBrand = DrugsElements.ReferenceBrand(driver);
                    var ContainerSize = DrugsElements.ContainerSize(driver);
                    var Submit = DrugsElements.Submit(driver);

                    int Attempts = 0;
                    while (true)
                    {
                        Faker faker = new Faker();
                        int[] FakeDIN = faker.Random.Digits(8);
                        foreach (int i in FakeDIN)
                        {
                            DIN.SendKeys(i.ToString());
                        }
                        DName.SendKeys("Fake QA Drug");
                        Dosage.SendKeys("100mg");
                        Strength.SendKeys("100x");
                        Concentration.SendKeys("100ml/mg");
                        Manufacturer.SendKeys("Bill Nye Inc");
                        ReferenceBrand.SendKeys("None");
                        ContainerSize.SendKeys("1000");
                        Submit.Click();
                        MultiWait.Wait(DrugsElements.AlertMessageSelector(), driver);
                        var AlertMessage = DrugsElements.AlertMessage(driver);

                        if (AlertMessage.Text.ToLower().Contains("drug added"))
                        {
                            return true;
                        }
                        else if (AlertMessage.Text.ToLower().Contains("drug not added, please make sure din number is unique"))
                        {
                            //if we get the drug not added message, we will retry up to 3 times(to make sure din is unique), if it still fails return false
                            var CloseButton = DrugsElements.CloseAlertMessage(driver);
                            CloseButton.Click();
                            DIN.Clear();
                            DName.Clear();
                            Dosage.Clear();
                            Strength.Clear();
                            Concentration.Clear();
                            Manufacturer.Clear();
                            ReferenceBrand.Clear();
                            ContainerSize.Clear();
                            Attempts++;
                            if (Attempts >= 3)
                            {
                                return false;
                            }
                            Thread.Sleep(1000);//waiting one second because the website doesn't register us if we go to fast
                            continue;
                        }
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
        public static bool TestAddDrugBulk(IWebDriver driver, string BaseUrl)
        {
            try
            {
                if (DrugsTests.TestViewDrug(driver, BaseUrl))
                {
                    MultiWait.Wait(DrugsElements.BulkAddDrugButtonSelector(),driver);
                    var BAddDrugButton = DrugsElements.BulkAddDrugButton(driver);
                    BAddDrugButton.Click();
                    MultiWait.Wait(
                        DrugsElements.ConfirmBulkAddButtonSelector(),
                        DrugsElements.BulkAddFileSelectSelector(),
                        driver);
                    var FileSelect = DrugsElements.BulkAddFileSelect(driver);
                    var ConfirmBulkAdd = DrugsElements.ConfirmBulkAddButton(driver);

                    //sending bulk add file name, make sure it exists or else test will fail
                    string Path = System.IO.Path.GetFullPath("../../../../BulkAdd/Drug.xlsx");
                    FileSelect.SendKeys(Path);

                    ConfirmBulkAdd.Click();
                    MultiWait.Wait(DrugsElements.AlertMessageSelector(), driver);
                    var AlertMessage = DrugsElements.AlertMessage(driver);
                    if (AlertMessage.Text.ToLower().Contains("all drugs added successfully"))
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
        public static bool TestDeleteDrug(IWebDriver driver, string BaseUrl, bool Multi = false)
        {
            try
            {
                if (DrugsTests.TestViewDrug(driver, BaseUrl))
                {
                    var AllDrugs = DrugsElements.AllDrugs(driver);
                    UtilityMethods.SelectTestItem(2, AllDrugs, "Edit Test Drug", "Fake QA Drug",driver, Multi);

                    var DeleteDrugs = DrugsElements.DeleteDrugButton(driver);
                    IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
                    js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", DeleteDrugs);
                    Thread.Sleep(500);
                    DeleteDrugs.Click();

                    MultiWait.Wait(DrugsElements.ConfirmDeleteSelector(), driver);
                    var ConfirmDelete = DrugsElements.ConfirmDelete(driver);
                    ConfirmDelete.Click();

                    MultiWait.Wait(DrugsElements.ConfirmConfirmDeleteSelector(), driver);
                    var ConfirmConfirmDelete = DrugsElements.ConfirmConfirmDelete(driver);
                    ConfirmConfirmDelete.Click();

                    MultiWait.Wait(DrugsElements.AlertMessageSelector(), driver);
                    var AlertMessage = DrugsElements.AlertMessage(driver);
                    if (AlertMessage.Text.ToLower().Contains("drugs deleted successfully"))
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

        public static bool TestEditDrug(IWebDriver driver, string BaseUrl)
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
                wait.Until(e => e.FindElements(By.CssSelector(HomeElements.DrugButtonSelector())).Count == 1);
                IWebElement DrugButton = HomeElements.DrugsButton(driver);
                DrugButton.Click();

                //selects a test drug created to edit
                var AllDrugs = DrugsElements.AllDrugs(driver);
                UtilityMethods.SelectTestItem(2, AllDrugs, "Edit Test Drug", "Fake QA Drug", driver, false);

                wait.Until(e => e.FindElements(By.CssSelector(DrugsElements.EditDrugButtonSelector())).Count == 1);
                IWebElement EditDrugButton = DrugsElements.EditDrugButton(driver);
                IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
                js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", EditDrugButton);
                Thread.Sleep(500);
                EditDrugButton.Click();

                wait.Until(e => e.FindElements(By.CssSelector(DrugsElements.EditDrugNameSelector())).Count == 1);
                IWebElement EditDrugName = DrugsElements.EditDrugName(driver);
                EditDrugName.Clear();
                EditDrugName.SendKeys("Edit Test Drug");

                wait.Until(e => e.FindElements(By.CssSelector(DrugsElements.EditDrugSubmitButtonSelector())).Count == 1);
                IWebElement EditDrugSubmitButton = DrugsElements.EditDrugSubmitButton(driver);
                EditDrugSubmitButton.Click();

                wait.Until(e => e.FindElements(By.CssSelector(DrugsElements.AlertMessageSelector())).Count == 1);
                var DrugAlert = DrugsElements.AlertMessage(driver);
                if (DrugAlert.Text == "Drug edited successfully!")
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
