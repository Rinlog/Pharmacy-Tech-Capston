using System;
using System.CodeDom.Compiler;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Bogus;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using QATesting.SitePageElements;

namespace QATesting.SiteTests
{
    internal class SignupTests
    {
        public static string GenerateFakeEmail()
        {
            Faker faker = new Faker();
            var hacker = faker.Hacker.Random;
            return "QATEST"+ hacker.Hash() +"@nbcc.ca";
        }
        public static bool TestValidSignup(IWebDriver driver, string BaseUrl)
        {
            try
            {
                //this doesn't need wait as it is first page element
                var SignUpButton = LoginElements.LoginSignUp(driver);
                SignUpButton.Click();

                WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
                wait.Until(e =>{
                    List<bool> results = new List<bool>();
                    results.Add(e.FindElements(By.CssSelector(SignupElements.FirstNameSelector())).Count == 1);
                    results.Add(e.FindElements(By.CssSelector(SignupElements.LastNameSelector())).Count == 1);
                    results.Add(e.FindElements(By.CssSelector(SignupElements.CampusSelector())).Count == 1);
                    results.Add(e.FindElements(By.CssSelector(SignupElements.EmailSelector())).Count == 1);
                    results.Add(e.FindElements(By.CssSelector(SignupElements.PasswordSelector())).Count == 1);
                    results.Add(e.FindElements(By.CssSelector(SignupElements.ConfirmPasswordSelector())).Count == 1);
                    results.Add(e.FindElements(By.CssSelector(SignupElements.SubmitSelector())).Count == 1);

                    foreach (var result in results)
                    {
                        if (result == false)
                        {
                            return false;
                        }
                    }
                    //if none turn out to be false we return true to show they are all loaded
                    return true;
                });
                var FirstName = SignupElements.FirstName(driver);
                var LastName = SignupElements.LastName(driver);
                var Campus = SignupElements.Campus(driver);
                var Email = SignupElements.Email(driver);
                var Password = SignupElements.Password(driver);
                var ConfirmPassword = SignupElements.ConfirmPassword(driver);
                var Submit = SignupElements.Submit(driver);

                while (true)
                {
                    FirstName.Clear();
                    FirstName.SendKeys("QATEST");

                    LastName.Clear();
                    LastName.SendKeys("QATEST");

                    new SelectElement(Campus).SelectByText("Fredericton");

                    Email.Clear();
                    Email.SendKeys(GenerateFakeEmail());

                    Password.Clear();
                    Password.SendKeys("Password1!");

                    ConfirmPassword.Clear();
                    ConfirmPassword.SendKeys("Password1!");

                    Submit.Click();

                    wait.Until(e => e.FindElements(By.CssSelector(SignupElements.ModalAlertSelector())).Count == 1);
                    wait.Until(e => e.FindElements(By.CssSelector(SignupElements.ModalAlertCloseButtonSelector())).Count == 1);

                    var ModalAlert = SignupElements.ModalAlert(driver);
                    var CloseButton = SignupElements.ModalAlertCloseButton(driver);
                    if (ModalAlert.Text.ToLower().Contains("email already exists"))
                    {
                        CloseButton.Click();
                    }
                    else if (ModalAlert.Text.ToLower().Contains("user added successfully"))
                    {
                        CloseButton.Click();
                        break;
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
