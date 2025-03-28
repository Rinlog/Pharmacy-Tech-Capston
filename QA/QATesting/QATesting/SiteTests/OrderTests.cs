﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Security.Authentication;
using System.Text;
using System.Threading.Tasks;
using Bogus;
using OpenQA.Selenium;
using OpenQA.Selenium.DevTools.V131.Network;
using OpenQA.Selenium.Support.UI;
using QATesting.Methods;
using QATesting.SitePageElements;

namespace QATesting.SiteTests
{
    internal class OrderTests
    {
        public static bool FillInOrderForm(IWebDriver driver)
        {
            try
            {
                //waits for all form elements (except image upload things)
                MultiWait.Wait(
                    OrderElements.OrderAddPatientButtonSelector(),
                    OrderElements.OrderAddDrugButtonSelector(),
                    OrderElements.OrderAddDrugDoseSelector(),
                    OrderElements.OrderFormSelector(),
                    OrderElements.OrderRouteSelector(),
                    OrderElements.OrderFrequencySelector(),
                    OrderElements.OrderDurationSelector(),
                    OrderElements.OrderQuantitySelector(),
                    OrderElements.OrderAddPhysicianButtonSelector(),
                    OrderElements.OrderAddSIGButtonSelector(),
                    OrderElements.OrderStartSelector(),
                    OrderElements.OrderStartTimeSelector(),
                    OrderElements.OrderCommentsSelector(),
                    OrderElements.OrderAddSubmitButtonSelector(),
                    driver
                );
                var AddPatientButton = OrderElements.OrderAddPatientButton(driver);
                var AddDrugButton = OrderElements.OrderAddDrugButton(driver);
                var DrugDose = OrderElements.OrderAddDrugDose(driver);
                var Form = OrderElements.OrderForm(driver);
                var Route = OrderElements.OrderRoute(driver);
                var Frequency = OrderElements.OrderFrequency(driver);
                var Duration = OrderElements.OrderDuration(driver);
                var Quantity = OrderElements.OrderQuantity(driver);
                var PhysicianButton = OrderElements.OrderAddPhysicianButton(driver);
                var SigButton = OrderElements.OrderAddSIGButton(driver);
                var StartDate = OrderElements.OrderStart(driver);
                var StartTime = OrderElements.OrderStartTime(driver);
                var Comments = OrderElements.OrderComments(driver);

                AddPatientButton.Click();
                MultiWait.Wait(OrderElements.OrderAddModalRadioSelector(), OrderElements.OrderAddModalPatientConfirmButtonSelector(), driver);
                var ModalRadio = OrderElements.OrderAddModalRadio(driver);
                var PatientConfirm = OrderElements.OrderAddPatientModalConfirmButton(driver);
                ModalRadio.Click();
                PatientConfirm.Click();

                AddDrugButton.Click();
                MultiWait.Wait(OrderElements.OrderAddModalRadioSelector(), OrderElements.OrderAddDrugModalConfirmButtonSelector(), driver);
                var ModalRadio2 = OrderElements.OrderAddModalRadio(driver);
                var DrugConfrim = OrderElements.OrderAddDrugModalConfirmButton(driver);
                ModalRadio2.Click();
                DrugConfrim.Click();

                PhysicianButton.Click();
                MultiWait.Wait(OrderElements.OrderAddModalRadioSelector(), OrderElements.OrderAddPhysicianModalConfirmButtonSelector(), driver);
                var ModalRadio3 = OrderElements.OrderAddModalRadio(driver);
                var PhysicianConfrim = OrderElements.OrderAddPhysicianModalConfirmButton(driver);
                ModalRadio3.Click();
                PhysicianConfrim.Click();

                SigButton.Click();
                MultiWait.Wait(OrderElements.OrderAddModalRadioSelector(), OrderElements.OrderAddSIGModalConfirmButtonSelector(), driver);
                var ModalRadio4 = OrderElements.OrderAddModalRadio(driver);
                var SIGConfrim = OrderElements.OrderAddSIGModalConfirmButton(driver);
                ModalRadio4.Click();
                SIGConfrim.Click();

                Faker fake = new Faker();
                var Random = fake.Random;
                DrugDose.SendKeys(Random.Digits(1)[0].ToString());

                Form.SendKeys("Pill");
                Route.SendKeys("Oral");
                Frequency.SendKeys("100 times per second");
                Duration.SendKeys("10 years");
                Quantity.SendKeys("2 tons");
                //regardless of locale we will format the date yyyy-mm-dd because thats how firefox wants the value, browser will auto translate into locale
                DateOnly FakeDate = fake.Date.RecentDateOnly();
                var Month = (FakeDate.Month.ToString().Length == 2) ? FakeDate.Month.ToString() : "0"+FakeDate.Month.ToString();
                var Day = (FakeDate.Day.ToString().Length == 2) ? FakeDate.Day.ToString() : "0"+FakeDate.Day.ToString();
                string StringFakeDate = FakeDate.Year.ToString() + "-" + Month + "-" + Day;
                StartDate.SendKeys(StringFakeDate);
                StartTime.SendKeys("12:00");
                Comments.Clear();
                Comments.SendKeys("Generated By QATESTS");
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public static bool US4EnterPrescriptionOrder(IWebDriver driver, string BaseUrl)
        {
            try
            {
                bool result = LoginTests.TestValidLogin(driver, BaseUrl);
                if (result == true)
                {
                    WebDriverWait wait = new WebDriverWait(driver,TimeSpan.FromSeconds(30));
                    wait.Until(e => e.FindElements(By.CssSelector(HomeElements.OrdersButtonSelector())).Count == 1);
                    IWebElement OrderButton = HomeElements.OrdersButton(driver);
                    OrderButton.Click();
                    wait.Until(e => e.FindElements(By.CssSelector(OrderElements.OrderAddSelector())).Count == 1);
                    var OrderAdd = OrderElements.OrderAdd(driver);
                    OrderAdd.Click();
                    
                    if (FillInOrderForm(driver))
                    {
                        
                        var Submit = OrderElements.OrderAddSubmitButton(driver);
                        Submit.Click();
                        MultiWait.Wait(OrderElements.OrderAlertMessageSelector(), driver);
                        var AlertMessage = OrderElements.OrderAlertMessage(driver);
                        if (AlertMessage.Text.ToLower().Contains("order successfully created"))
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

        public static bool US8AmendPrescriptionOrder(IWebDriver driver, string BaseUrl, bool ChangeImage = false)
        {
            try
            {
                bool result = LoginTests.TestValidLogin(driver, BaseUrl);
                if (result == true)
                {
                    WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
                    wait.Until(e => e.FindElements(By.CssSelector(HomeElements.OrdersButtonSelector())).Count == 1);
                    IWebElement OrderButton = HomeElements.OrdersButton(driver);
                    OrderButton.Click();
                    wait.Until(e => e.FindElements(By.CssSelector(OrderElements.MyOrderSelector())).Count == 1);
                    var MyOrder = OrderElements.MyOrder(driver);
                    MyOrder.Click();

                    MultiWait.Wait(
                        OrderElements.AmendOrderSelector()
                        , driver);
                    //amending last order as that is newest
                    var OrdersToAmend = OrderElements.AmendOrders(driver);
                    var LastOrder = OrdersToAmend.Count - 1;
                    IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
                    js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", OrdersToAmend[LastOrder]);
                    Thread.Sleep(500);
                    OrdersToAmend[LastOrder].Click();

                    if (ChangeImage == true)
                    {
                        MultiWait.Wait(OrderElements.RemoveSavedImageSelector() , driver);
                        var RemoveSavedImage = OrderElements.RemoveSavedImage(driver);
                        RemoveSavedImage.Click();
                        //need a static wait because UploadImageSelector gets detected instantly, but image sometimes does not get removed instantly
                        Thread.Sleep(250); 
                        MultiWait.Wait(OrderElements.UploadImageSelector() , driver);
                        var UploadImage = OrderElements.UploadImage(driver);
                        string FullPath = System.IO.Path.GetFullPath(@".\Images\TestImage.jpg");
                        UploadImage.SendKeys(FullPath); //make sure this file exists otherwise test will not work

                        MultiWait.Wait(OrderElements.SaveImageSelector() , driver);
                        var SaveImage = OrderElements.SaveImage(driver);
                        SaveImage.Click();

                    }
                    MultiWait.Wait(OrderElements.AmendSubmitSelector() , driver);
                    var Submit = OrderElements.AmendSubmit(driver);
                    js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", Submit);
                    Thread.Sleep(500);
                    Submit.Click();

                    MultiWait.Wait(OrderElements.OrderAlertMessageSelector(), driver);
                    var AlertMessage = OrderElements.OrderAlertMessage(driver);
                    if (AlertMessage.Text.ToLower().Contains("order successfully amended"))
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
                return false;
            }
        }

        public static bool US5UploadPrescriptionOrder(IWebDriver driver, string BaseUrl)
        {
            try
            {
                bool result = LoginTests.TestValidLogin(driver, BaseUrl);
                if (result == true)
                {
                    WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
                    wait.Until(e => e.FindElements(By.CssSelector(HomeElements.OrdersButtonSelector())).Count == 1);
                    IWebElement OrderButton = HomeElements.OrdersButton(driver);
                    OrderButton.Click();
                    wait.Until(e => e.FindElements(By.CssSelector(OrderElements.OrderAddSelector())).Count == 1);
                    var OrderAdd = OrderElements.OrderAdd(driver);
                    OrderAdd.Click();

                    if (FillInOrderForm(driver))
                    {
                        //once we filled in the order form, now we test the image upload
                        MultiWait.Wait(OrderElements.UploadImageSelector(), driver);
                        var UploadImage = OrderElements.UploadImage(driver);
                        IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
                        js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", UploadImage);
                        Thread.Sleep(500);
                        string FullPath = System.IO.Path.GetFullPath(@".\Images\TestImage.jpg");
                        //make sure this file exists otherwise test will not work
                        //(image may not be there by default, add the image next to executable for QA tests, NOT .sln file, put it next to .exe file with proper directory pathing)
                        UploadImage.SendKeys(FullPath); 

                        MultiWait.Wait(
                            OrderElements.SaveImageSelector(),
                            OrderElements.OrderAddSubmitButtonSelector(),
                            driver);
                        var SaveImage = OrderElements.SaveImage(driver);
                        SaveImage.Click();

                        var Submit = OrderElements.OrderAddSubmitButton(driver);
                        js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", Submit);
                        Thread.Sleep(500);
                        Submit.Click();

                        MultiWait.Wait(OrderElements.OrderAlertMessageSelector(), driver);
                        var AlertMessage = OrderElements.OrderAlertMessage(driver);
                        if (AlertMessage.Text.ToLower().Contains("order successfully created"))
                        {
                            driver.Url = BaseUrl + "/orders";
                            NavTests.NavLogout(driver,BaseUrl);
                            if (VerificationTests.US7TestRejectOrderVerification(driver, BaseUrl)) //rejects the order so we can test uploading an image on the amend order screen
                            {
                                driver.Url = BaseUrl + "/orders";
                                NavTests.NavLogout(driver, BaseUrl);

                                //amend the prescription order and change the image to test image upload there
                                if (OrderTests.US8AmendPrescriptionOrder(driver, BaseUrl, true) == true)
                                {
                                    driver.Url = BaseUrl + "/orders";
                                    NavTests.NavLogout(driver, BaseUrl);

                                    bool result3 = VerificationTests.US7TestApprovedVerification(driver, BaseUrl,true);//verifys the order with an image, making sure an image is associated
                                    return result3;
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
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Thread.Sleep(10000);
                return false;
            }
        }
        
        public static bool US9PrintOrderToPDF(IWebDriver driver, string BaseUrl)
        {
            try
            {
                if (LoginTests.LoginAsUserSpecified(driver, BaseUrl, "test5@nbcc.ca", "Password1!"))
                {
                    WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
                    wait.Until(e => e.FindElements(By.CssSelector(HomeElements.OrdersButtonSelector())).Count == 1);
                    IWebElement OrderButton = HomeElements.OrdersButton(driver);
                    OrderButton.Click();

                    MultiWait.Wait(OrderElements.AllOrdersSectionSelector(), driver);
                    var AllOrdersSection = OrderElements.AllOrdersSection(driver);
                    AllOrdersSection.Click();

                    //first print will be to pdf
                    MultiWait.Wait(OrderElements.PrintButtonSelector(), driver);
                    var PrintButton = OrderElements.PrintButtons(driver);

                    IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
                    int SecondLast = (PrintButton.Count >= 2) ? PrintButton.Count - 2 : 0; //using the second last print button, in some cases thats the first

                    js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", PrintButton[SecondLast]);
                    Thread.Sleep(500);
                    PrintButton[SecondLast].Click();

                    MultiWait.Wait(
                        OrderElements.ChangePrintOptionSelector(),
                        OrderElements.ConfirmPrintSelector(),
                        driver);
                    var ConfirmPrint1 = OrderElements.ConfirmPrint(driver);
                    ConfirmPrint1.Click();

                    if (UtilityMethods.CheckIfDownloaded("PrintedPDF"))
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
            catch(Exception ex)
            {
                return false;
            }
            
        }
        public static bool US10RePrintOrderToPDF(IWebDriver driver, string BaseUrl)
        {
            try
            {
                if (LoginTests.LoginAsUserSpecified(driver, BaseUrl, "test5@nbcc.ca", "Password1!"))
                {
                    WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
                    wait.Until(e => e.FindElements(By.CssSelector(HomeElements.OrdersButtonSelector())).Count == 1);
                    IWebElement OrderButton = HomeElements.OrdersButton(driver);
                    OrderButton.Click();

                    MultiWait.Wait(OrderElements.AllOrdersSectionSelector(), driver);
                    var AllOrdersSection = OrderElements.AllOrdersSection(driver);
                    AllOrdersSection.Click();

                    //first print will be to pdf
                    MultiWait.Wait(OrderElements.RePrintButtonSelector(), driver);
                    var PrintButton = OrderElements.RePrintButtons(driver);

                    IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
                    int SecondLast = (PrintButton.Count >= 2) ? PrintButton.Count - 2 : 0; //using the second last print button, in some cases thats the first

                    js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", PrintButton[SecondLast]);
                    Thread.Sleep(500);
                    PrintButton[SecondLast].Click();

                    MultiWait.Wait(
                        OrderElements.ChangePrintOptionSelector(),
                        OrderElements.ConfirmPrintSelector(),
                        driver);
                    var ConfirmPrint1 = OrderElements.ConfirmPrint(driver);
                    ConfirmPrint1.Click();

                    if (UtilityMethods.CheckIfDownloaded("PrintedPDF"))
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
                return false;
            }

        }

        public static bool US9PrintOrderToPrinter(IWebDriver driver, string BaseUrl)
        {
            try
            {
                if (LoginTests.LoginAsUserSpecified(driver, BaseUrl, "test5@nbcc.ca", "Password1!"))
                {
                    WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
                    wait.Until(e => e.FindElements(By.CssSelector(HomeElements.OrdersButtonSelector())).Count == 1);
                    IWebElement OrderButton = HomeElements.OrdersButton(driver);
                    OrderButton.Click();

                    MultiWait.Wait(OrderElements.AllOrdersSectionSelector(), driver);
                    var AllOrdersSection = OrderElements.AllOrdersSection(driver);
                    AllOrdersSection.Click();

                    //print to printer below
                    MultiWait.Wait(OrderElements.PrintButtonSelector(), driver);
                    var PrintButton = OrderElements.PrintButtons(driver);

                    IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
                    int Last = (PrintButton.Count >= 2) ? PrintButton.Count - 1 : 0; //using the second last print button, in some cases thats the first

                    js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", PrintButton[Last]);
                    Thread.Sleep(500);
                    PrintButton[Last].Click();

                    //change print option first
                    MultiWait.Wait(
                        OrderElements.ChangePrintOptionSelector(),
                        OrderElements.ConfirmPrintSelector(),
                        driver);
                    var ChangePrintOption = OrderElements.ChangePrintOption(driver);
                    ChangePrintOption.Click();

                    MultiWait.Wait(OrderElements.ChangePrintOptionDropDownItemSelector(),driver);
                    var ChangePrintOptionDropDownItem = OrderElements.ChangePrintOptionDropDownItem(driver);
                    ChangePrintOptionDropDownItem.Click();

                    //then confirm print
                    var ConfirmPrint1 = OrderElements.ConfirmPrint(driver);
                    ConfirmPrint1.Click();

                    MultiWait.Wait(OrderElements.AlertMessageSelector(), driver);
                    var AlertMessage = OrderElements.AlertMessage(driver);
                    if (AlertMessage.Text.ToLower().Contains("successfully printed"))
                    {
                        return true;
                    }
                    else
                    {
                        Thread.Sleep(5000);
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
                return false;
            }

        }
        public static bool US10RePrintOrderToPrinter(IWebDriver driver, string BaseUrl)
        {
            try
            {
                if (LoginTests.LoginAsUserSpecified(driver, BaseUrl, "test5@nbcc.ca", "Password1!"))
                {
                    WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
                    wait.Until(e => e.FindElements(By.CssSelector(HomeElements.OrdersButtonSelector())).Count == 1);
                    IWebElement OrderButton = HomeElements.OrdersButton(driver);
                    OrderButton.Click();

                    MultiWait.Wait(OrderElements.AllOrdersSectionSelector(), driver);
                    var AllOrdersSection = OrderElements.AllOrdersSection(driver);
                    AllOrdersSection.Click();

                    //print to printer below
                    MultiWait.Wait(OrderElements.RePrintButtonSelector(), driver);
                    var PrintButton = OrderElements.RePrintButtons(driver);

                    IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
                    int Last = (PrintButton.Count >= 2) ? PrintButton.Count - 1 : 0; //using the second last print button, in some cases thats the first

                    js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", PrintButton[Last]);
                    Thread.Sleep(500);
                    PrintButton[Last].Click();

                    //change print option first
                    MultiWait.Wait(
                        OrderElements.ChangePrintOptionSelector(),
                        OrderElements.ConfirmPrintSelector(),
                        driver);
                    var ChangePrintOption = OrderElements.ChangePrintOption(driver);
                    ChangePrintOption.Click();

                    MultiWait.Wait(OrderElements.ChangePrintOptionDropDownItemSelector(), driver);
                    var ChangePrintOptionDropDownItem = OrderElements.ChangePrintOptionDropDownItem(driver);
                    ChangePrintOptionDropDownItem.Click();

                    //Enter print quantity
                    MultiWait.Wait(OrderElements.RePrintQuantityTextBoxSelector(), driver);
                    var RePrintQuantity = OrderElements.RePrintQuantityTextBox(driver);
                    RePrintQuantity.SendKeys("1");
                    //then confirm print
                    var ConfirmPrint1 = OrderElements.ConfirmPrint(driver);
                    ConfirmPrint1.Click();

                    MultiWait.Wait(OrderElements.AlertMessageSelector(), driver);
                    var AlertMessage = OrderElements.AlertMessage(driver);
                    if (AlertMessage.Text.ToLower().Contains("successfully printed"))
                    {
                        return true;
                    }
                    else
                    {
                        Thread.Sleep(5000);
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
                return false;
            }

        }
    }
}
