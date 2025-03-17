using OpenQA.Selenium;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium.Support.UI;
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
                    var result2 = e.FindElements(By.CssSelector(PatientsElements.PatientTableLoadingSelector())).Count == 1;

                    if (result1 == true || result2 == true)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }

                }); //waits for table to appear, or for loading text to appear, if they appear than we know that we can view the patient page
                return true;


            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
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

            IWebElement PatientButton = HomeElements.PatientsButton(driver);
            PatientButton.Click();
            IWebElement EditButton = PatientsElements.CheckboxPatient(driver);
            EditButton.Click();
            IWebElement EditPatientButton = PatientsElements.EditPatientButton(driver);
            EditPatientButton.Click();
            IWebElement EditPatientName = PatientsElements.EditPatientName(driver);
            EditPatientName.Clear();
            EditPatientName.SendKeys("Edit Test Patient");
            IWebElement EditPatientSubmitButton = PatientsElements.EditPatientSubmitButton(driver);
            IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
            js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", EditPatientSubmitButton);
            Thread.Sleep(500);
            EditPatientSubmitButton.Click();

            try
            {
                wait.Until(e => PatientsElements.EditPatientAlertMessage(e).Displayed);
                var PatientAlert = PatientsElements.EditPatientAlertMessage(driver);
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
