using OpenQA.Selenium.Support.UI;
using OpenQA.Selenium;
using QATesting.SitePageElements;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QATesting.SiteTests
{
    internal class UserManagementTests
    {
        public static bool DeleteUser(IWebDriver driver, string baseUrl)
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

            wait.Until(e => e.FindElements(By.CssSelector(HomeElements.UserManagementButtonSelector())).Count == 1);
            IWebElement UserManagementButton = HomeElements.UserManagementButton(driver);
            IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
            js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", UserManagementButton);
            Thread.Sleep(500);
            UserManagementButton.Click();

            IWebElement EditDeleteButton = UserManagementElements.EditDeleteButton(driver);
            EditDeleteButton.Click();

            wait.Until(e => e.FindElements(By.CssSelector(UserManagementElements.UserManagementRadioButtonSelector())).Count == 1);
            IWebElement RadioButton = UserManagementElements.RadioButton(driver);

            js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", RadioButton);
            Thread.Sleep(500);
            RadioButton.Click();
            IWebElement DeleteButton = UserManagementElements.DeleteButton(driver);
            DeleteButton.Click();
            IWebElement ConfirmDelete = UserManagementElements.ConfirmDelete(driver);
            ConfirmDelete.Click();
            IWebElement SecondConfirmDelete = UserManagementElements.SecondConfirmDelete(driver);
            SecondConfirmDelete.Click();

            try
            {
                wait.Until(e => e.FindElements(By.CssSelector(UserManagementElements.AlertMessageSelector())).Count == 1);
                var UserAlert = UserManagementElements.AlertMessage(driver);
                if (UserAlert.Text == "User Successfully Deleted")
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
                Console.WriteLine(ex.Message);
                return false;
            }
        }
    }
}
