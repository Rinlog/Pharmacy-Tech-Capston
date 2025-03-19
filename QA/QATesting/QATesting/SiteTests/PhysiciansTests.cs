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

                wait.Until(e => e.FindElements(By.CssSelector(PhysiciansElements.CheckboxPhysicianSelector())).Count == 1);
                IWebElement EditButton = PhysiciansElements.CheckboxPhysician(driver);
                EditButton.Click();

                wait.Until(e => e.FindElements(By.CssSelector(PhysiciansElements.EditPhysicianButtonSelector())).Count == 1);
                IWebElement EditPhysicianButton = PhysiciansElements.EditPhysicianButton(driver);
                EditPhysicianButton.Click();

                wait.Until(e => e.FindElements(By.CssSelector(PhysiciansElements.EditPhysicianNameSelector())).Count == 1);
                IWebElement EditPhysicianName = PhysiciansElements.EditPhysicianName(driver);
                EditPhysicianName.Clear();
                EditPhysicianName.SendKeys("Edit Test Physician");

                wait.Until(e => e.FindElements(By.CssSelector(PhysiciansElements.EditPhysicianSubmitButtonSelector())).Count == 1);
                IWebElement EditPhysicianSubmitButton = PhysiciansElements.EditPhysicianSubmitButton(driver);
                EditPhysicianSubmitButton.Click();


                wait.Until(e => e.FindElements(By.CssSelector(PhysiciansElements.EditPhysicianAlertMessageSelector())).Count == 1);
                var DrugAlert = PhysiciansElements.EditPhysicianAlertMessage(driver);
                if (DrugAlert.Text == "Physician edited successfully")
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
