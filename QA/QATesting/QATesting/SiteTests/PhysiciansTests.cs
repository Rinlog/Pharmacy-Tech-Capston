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
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(5));

            IWebElement PhysicianButton = HomeElements.PhysicianButton(driver);
            PhysicianButton.Click();
            IWebElement EditButton = PhysiciansElements.CheckboxPhysician(driver);
            EditButton.Click();
            IWebElement EditPhysicianButton = PhysiciansElements.EditPhysicianButton(driver);
            EditPhysicianButton.Click();
            IWebElement EditPhysicianName = PhysiciansElements.EditPhysicianName(driver);
            EditPhysicianName.Clear();
            EditPhysicianName.SendKeys("Edit Test Physician");
            IWebElement EditPhysicianSubmitButton = PhysiciansElements.EditPhysicianSubmitButton(driver);
            EditPhysicianSubmitButton.Click();

            try
            {
                wait.Until(e => PhysiciansElements.EditPhysicianAlertMessage(e).Displayed);
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
