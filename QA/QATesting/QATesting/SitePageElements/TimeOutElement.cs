using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QATesting.SitePageElements
{
    internal class TimeOutElement
    {
        public static IWebElement TimeoutElement(IWebDriver driver)
        {
            return driver.FindElement(By.CssSelector(TimeoutSelector()));
        }
        public static string TimeoutSelector()
        {
            return ".modal-title > h2:nth-child(1)";
        }
    }
}
