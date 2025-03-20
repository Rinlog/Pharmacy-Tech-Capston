using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium;

namespace QATesting.SitePageElements
{
    internal class VerificationElements
    {
        public static IWebElement VerificationTable(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(VerificationTableSelector()));
        }
        public static string VerificationTableSelector()
        {
            return ".scroll-table";
        }
        public static IWebElement TestOrder(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(TestOrderSelector()));
        }
        public static string TestOrderSelector()
        {
            return ".scroll-table > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1) > input[id='TESTORDER']:nth-child(1)";
        }
        public static IWebElement RxNumber(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(RxNumberSelector()));
        }
        public static string RxNumberSelector()
        {
            return "#RxNumber";
        }
        public static IWebElement Patient(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(PatientSelector()));
        }
        public static string PatientSelector()
        {
            return "#Patient";
        }
        public static IWebElement Drug(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(DrugSelector()));
        }
        public static string DrugSelector()
        {
            return "#Drug";
        }
        public static IWebElement Physician(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(PhysicianSelector()));
        }
        public static string PhysicianSelector()
        {
            return "#Physician";
        }
        public static IWebElement Initiator(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(InitiatorSelector()));
        }
        public static string InitiatorSelector()
        {
            return "#Initiator";
        }
        public static IWebElement SIGCode(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(SIGCodeSelector()));
        }
        public static string SIGCodeSelector()
        {
            return "#SIGCode";
        }
        public static IWebElement SIGDescription(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(SIGDescriptionSelector()));
        }
        public static string SIGDescriptionSelector()
        {
            return "#SIGDescription";
        }
        public static IWebElement Form(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(FormSelector()));
        }
        public static string FormSelector()
        {
            return "#Form";
        }
        public static IWebElement Route(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(RouteSelector()));
        }
        public static string RouteSelector()
        {
            return "#Route";
        }
        public static IWebElement PrescribedDose(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(PrescribedDoseSelector()));
        }
        public static string PrescribedDoseSelector()
        {
            return "#PrescribedDose";
        }
        public static IWebElement Frequency(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(FrequencySelector()));
        }
        public static string FrequencySelector()
        {
            return "#Frequency";
        }
        public static IWebElement Duration(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(DurationSelector()));
        }
        public static string DurationSelector()
        {
            return "#Duration";
        }
        public static IWebElement Quantity(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(QuantitySelector()));
        }
        public static string QuantitySelector()
        {
            return "#Quantity";
        }
        public static IWebElement StartDate(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(StartDateSelector()));
        }
        public static string StartDateSelector()
        {
            return "#StartDate";
        }
        public static IWebElement StartTime(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(StartTimeSelector()));
        }
        public static string StartTimeSelector()
        {
            return "#StartTime";
        }
        public static IWebElement Comments(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(CommentsSelector()));
        }
        public static string CommentsSelector()
        {
            return "#Comments";
        }
        public static IWebElement Reject(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(RejectSelector()));
        }
        public static string RejectSelector()
        {
            return "#reject";
        }
        public static IWebElement Verify(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(VerifySelector()));
        }

        public static string VerifySelector()
        {
            return "#verify";
        }
        public static IWebElement OrderVerifiedMessage(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderVerifiedMessageSelector()));
        }
        public static string OrderVerifiedMessageSelector()
        {
            return ".Header > h1:nth-child(1)";
        }
        public static IWebElement OrderRejectedMessage(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(OrderRejectedMessageSelector()));
        }
        public static string OrderRejectedMessageSelector()
        {
            return ".modal-body > h5:nth-child(1)";
        }

    }
}
