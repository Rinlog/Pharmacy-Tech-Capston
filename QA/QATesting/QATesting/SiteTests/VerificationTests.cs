using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium;
using QATesting.Methods;
using QATesting.SitePageElements;

namespace QATesting.SiteTests
{
    internal class VerificationTests
    {
        public static bool US7TestApprovedVerification(IWebDriver driver, string BaseURL)
        {
            if (LoginTests.LoginAsUserSpecified(driver, BaseURL,"test5@nbcc.ca","Password1!"))
            {
                try
                {
                    MultiWait.Wait(HomeElements.VerificationButtonSelector(), driver);
                    var VerificationButton = HomeElements.VerificationButton(driver);
                    IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
                    js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", VerificationButton);
                    Thread.Sleep(500);
                    VerificationButton.Click();

                    //wait for the order to be found
                    MultiWait.Wait(
                        VerificationElements.VerificationTableSelector(),
                        VerificationElements.TestOrderSelector(),
                        driver);

                    var TestOrder = VerificationElements.TestOrder(driver);
                    js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", TestOrder);
                    Thread.Sleep(500);
                    TestOrder.Click();

                    //waiting for the first set of visible checkboxes
                    MultiWait.Wait(
                        VerificationElements.RxNumberSelector(),
                        VerificationElements.PatientSelector(),
                        VerificationElements.DrugSelector(),
                        VerificationElements.PhysicianSelector(),
                        VerificationElements.InitiatorSelector(),
                        VerificationElements.SIGCodeSelector(),
                        VerificationElements.SIGDescriptionSelector(),
                        VerificationElements.FormSelector(),
                        VerificationElements.RouteSelector(),
                        VerificationElements.PrescribedDoseSelector(),
                        VerificationElements.FrequencySelector(),
                        driver);
                    var RxNum = VerificationElements.RxNumber(driver);
                    var Patient = VerificationElements.Patient(driver);
                    var Drug = VerificationElements.Drug(driver);
                    var Physician = VerificationElements.Physician(driver);
                    var Initiator = VerificationElements.Initiator(driver);
                    var SIGCode = VerificationElements.SIGCode(driver);
                    var SIGDescription = VerificationElements.SIGDescription(driver);
                    var Form = VerificationElements.Form(driver);
                    var Route = VerificationElements.Route(driver);
                    var PrescribedDose = VerificationElements.PrescribedDose(driver);
                    var Frequency = VerificationElements.Frequency(driver);
                    RxNum.Click();
                    Patient.Click();
                    Drug.Click();
                    Physician.Click();
                    Initiator.Click();
                    SIGCode.Click();
                    SIGDescription.Click();
                    Form.Click();
                    Route.Click();
                    PrescribedDose.Click();
                    Frequency.Click();

                    //waiting for the second set of elements
                    MultiWait.Wait(
                        VerificationElements.DurationSelector(),
                        VerificationElements.QuantitySelector(),
                        VerificationElements.StartDateSelector(),
                        VerificationElements.StartTimeSelector(),
                        VerificationElements.CommentsSelector(),
                        VerificationElements.VerifySelector(),
                        driver);
                    var Duration = VerificationElements.Duration(driver);
                    var Quantity = VerificationElements.Quantity(driver);
                    var StartDate = VerificationElements.StartDate(driver);
                    var StartTime = VerificationElements.StartTime(driver);
                    var Comments = VerificationElements.Comments(driver);
                    var Verify = VerificationElements.Verify(driver);

                    js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", Verify);
                    Thread.Sleep(500);

                    Duration.Click();
                    Quantity.Click();
                    StartDate.Click();
                    StartTime.Click();
                    Comments.Click();
                    Verify.Click();

                    MultiWait.Wait(
                        VerificationElements.OrderVerifiedMessageSelector()
                        , driver);
                    var verified = VerificationElements.OrderVerifiedMessage(driver);
                    if (verified.Text.ToLower().Contains("has been successfully verified"))
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
            else
            {
                return false;
            }
        }
        public static bool US7TestRejectOrderVerification(IWebDriver driver, string BaseURL)
        {
            if (LoginTests.LoginAsUserSpecified(driver, BaseURL, "test5@nbcc.ca", "Password1!"))
            {
                try
                {
                    MultiWait.Wait(HomeElements.VerificationButtonSelector(), driver);
                    var VerificationButton = HomeElements.VerificationButton(driver);
                    IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
                    js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", VerificationButton);
                    Thread.Sleep(500);
                    VerificationButton.Click();

                    //wait for the order to be found
                    MultiWait.Wait(
                        VerificationElements.VerificationTableSelector(),
                        VerificationElements.TestOrderSelector(),
                        driver);

                    var TestOrder = VerificationElements.TestOrder(driver);
                    js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", TestOrder);
                    Thread.Sleep(500);
                    TestOrder.Click();

                    //waiting for the second set of elements
                    MultiWait.Wait(
                        VerificationElements.RejectSelector(),
                        driver);
                    var Reject = VerificationElements.Reject(driver);

                    js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", Reject);
                    Thread.Sleep(500);

                    Reject.Click();

                    MultiWait.Wait(
                        VerificationElements.OrderRejectedMessageSelector()
                        , driver);
                    var verified = VerificationElements.OrderRejectedMessage(driver);
                    if (verified.Text.ToLower().Contains("rejected"))
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
            else
            {
                return false;
            }
        }
    }
}
