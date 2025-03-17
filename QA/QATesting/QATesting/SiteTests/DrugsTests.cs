using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
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
                    var result2 = e.FindElements(By.CssSelector(DrugsElements.DrugTableLoadingSelector())).Count == 1;

                    if (result1 == true || result2 == true)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                    
                }); //waits for table to appear, or for loading text to appear, if they appear than we know that we can view the drug page
                return true;
                

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
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
            
            IWebElement DrugButton = HomeElements.DrugsButton(driver);
            DrugButton.Click();
            IWebElement EditButton = DrugsElements.CheckboxDrug(driver);
            EditButton.Click();
            IWebElement EditDrugButton = DrugsElements.EditDrugButton(driver);
            EditDrugButton.Click();
            IWebElement EditDrugName = DrugsElements.EditDrugName(driver);
            EditDrugName.Clear();
            EditDrugName.SendKeys("Edit Test Drug");
            IWebElement EditDrugSubmitButton = DrugsElements.EditDrugSubmitButton(driver);
            EditDrugSubmitButton.Click();

            try
            {
                wait.Until(e => DrugsElements.EditDrugsAlertMessage(e).Displayed);
                var DrugAlert = DrugsElements.EditDrugsAlertMessage(driver);
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
