using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium;

namespace QATesting.SitePageElements
{
    internal class OrderElements
    {
        //the below elements are for the add order section
        public static IWebElement OrderAdd(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderAddSelector()));
        }
        public static string OrderAddSelector()
        {
            return "#orderadd";
        }

        public static IWebElement OrderAddPatientButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderAddPatientButtonSelector()));
        }
        public static string OrderAddPatientButtonSelector()
        {
            return "#addorder > button:nth-child(3)";
        }
        public static IWebElement OrderAddModalRadio(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderAddModalRadioSelector()));
        }
        public static string OrderAddModalRadioSelector()
        {
            return "div.justify-content-center:nth-child(2) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1) > input:nth-child(1)";
        }
        public static IWebElement OrderAddPatientModalConfirmButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderAddModalPatientConfirmButtonSelector()));
        }
        public static string OrderAddModalPatientConfirmButtonSelector()
        {
            return "#PatientConfirm";
        }
        public static IWebElement OrderAddDrugModalConfirmButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderAddDrugModalConfirmButtonSelector()));
        }
        public static string OrderAddDrugModalConfirmButtonSelector()
        {
            return "#DrugConfirm";
        }
        public static IWebElement OrderAddPhysicianModalConfirmButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderAddPhysicianModalConfirmButtonSelector()));
        }
        public static string OrderAddPhysicianModalConfirmButtonSelector()
        {
            return "#PhysicianConfirm";
        }
        public static IWebElement OrderAddSIGModalConfirmButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderAddSIGModalConfirmButtonSelector()));
        }
        public static string OrderAddSIGModalConfirmButtonSelector()
        {
            return "#SIGConfirm";
        }
        public static IWebElement OrderAddDrugButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderAddDrugButtonSelector()));
        }
        public static string OrderAddDrugButtonSelector()
        {
            return "#drugBtn";
        }
        public static IWebElement OrderAddDrugDose(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderAddDrugDoseSelector()));
        }
        public static string OrderAddDrugDoseSelector()
        {
            return "#orderDose";
        }
        public static IWebElement OrderForm(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderFormSelector()));
        }
        public static string OrderFormSelector()
        {
            return "#orderForm";
        }
        public static IWebElement OrderRoute(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderRouteSelector()));
        }
        public static string OrderRouteSelector()
        {
            return "#orderRoute";
        }
        public static IWebElement OrderFrequency(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderFrequencySelector()));
        }
        public static string OrderFrequencySelector()
        {
            return "#orderFrequency";
        }
        public static IWebElement OrderDuration(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderDurationSelector()));
        }
        public static string OrderDurationSelector()
        {
            return "#orderDuration";
        }
        public static IWebElement OrderQuantity(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderQuantitySelector()));
        }
        public static string OrderQuantitySelector()
        {
            return "#orderQuantity";
        }
        public static IWebElement OrderStart(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderStartSelector()));
        }
        public static string OrderStartSelector()
        {
            return ".date-input";
        }
        public static IWebElement OrderStartTime(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderStartTimeSelector()));
        }
        public static string OrderStartTimeSelector()
        {
            return "#orderTime";
        }
        public static IWebElement OrderComments(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderCommentsSelector()));
        }
        public static string OrderCommentsSelector()
        {
            return "#orderComments";
        }
        public static IWebElement OrderAddPhysicianButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderAddPhysicianButtonSelector()));
        }
        public static string OrderAddPhysicianButtonSelector()
        {
            return "button.button:nth-child(29)";
        }
        public static IWebElement OrderAddSIGButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderAddSIGButtonSelector()));
        }
        public static string OrderAddSIGButtonSelector()
        {
            return "button.button:nth-child(33)";
        }
        public static IWebElement OrderAddSubmitButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderAddSubmitButtonSelector()));
        }
        public static string OrderAddSubmitButtonSelector()
        {
            return "button.button:nth-child(49)";
        }
        public static IWebElement OrderAddUploadImage(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderAddUploadImageSelector()));
        }
        public static string OrderAddUploadImageSelector()
        {
            return ".hidden";
        }
        public static IWebElement OrderAddUploadImageSaveButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderAddUploadImageSaveButtonSelector()));
        }
        public static string OrderAddUploadImageSaveButtonSelector()
        {
            return "div.d-flex:nth-child(2) > div:nth-child(1) > div:nth-child(4) > button:nth-child(2)";
        }
        public static IWebElement OrderAddUploadImageRemoveSavedButton(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderAddUploadImageRemoveSavedButtonSelector()));
        }
        public static string OrderAddUploadImageRemoveSavedButtonSelector()
        {
            return "div.col:nth-child(2) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > button:nth-child(2)";
        }
        //end of add order section elements
        public static IWebElement OrderAlertMessage(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderAlertMessageSelector()));
        }
        public static string OrderAlertMessageSelector()
        {
            return ".modal-body > h5:nth-child(1)";
        }
    }
}
