using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace QATesting.Methods
{
    internal class MultiWait
    {
        /// <summary>
        /// waits for element(s) to appear based on css selectors, 30 second timeout
        /// </summary>
        /// <param name="selector1"></param>
        /// <param name="driver"></param>
        public static void Wait(string selector1, IWebDriver driver)
        {
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(e => {
                List<bool> results = new List<bool>();
                results.Add(e.FindElements(By.CssSelector(selector1)).Count >= 1);

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
        }
        /// <summary>
        /// waits for element(s) to appear based on css selectors, 30 second timeout
        /// </summary>
        /// <param name="selector1"></param>
        /// <param name="selector2"></param>
        /// <param name="driver"></param>
        public static void Wait(string selector1, string selector2, IWebDriver driver)
        {
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(e => {
                List<bool> results = new List<bool>();
                results.Add(e.FindElements(By.CssSelector(selector1)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector2)).Count >= 1);

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
        }
        /// <summary>
        /// waits for element(s) to appear based on css selectors, 30 second timeout
        /// </summary>
        /// <param name="selector1"></param>
        /// <param name="selector2"></param>
        /// <param name="selector3"></param>
        /// <param name="driver"></param>
        public static void Wait(string selector1, string selector2, string selector3, IWebDriver driver)
        {
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(e => {
                List<bool> results = new List<bool>();
                results.Add(e.FindElements(By.CssSelector(selector1)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector2)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector3)).Count >= 1);

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
        }
        /// <summary>
        /// waits for element(s) to appear based on css selectors, 30 second timeout
        /// </summary>
        /// <param name="selector1"></param>
        /// <param name="selector2"></param>
        /// <param name="selector3"></param>
        /// <param name="selector4"></param>
        /// <param name="driver"></param>
        public static void Wait(string selector1, string selector2, string selector3, string selector4, IWebDriver driver)
        {
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(e => {
                List<bool> results = new List<bool>();
                results.Add(e.FindElements(By.CssSelector(selector1)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector2)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector3)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector4)).Count >= 1);

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
        }
        /// <summary>
        /// waits for element(s) to appear based on css selectors, 30 second timeout
        /// </summary>
        /// <param name="selector1"></param>
        /// <param name="selector2"></param>
        /// <param name="selector3"></param>
        /// <param name="selector4"></param>
        /// <param name="selector5"></param>
        /// <param name="driver"></param>
        public static void Wait(string selector1, string selector2, string selector3, string selector4, string selector5, IWebDriver driver)
        {
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(e => {
                List<bool> results = new List<bool>();
                results.Add(e.FindElements(By.CssSelector(selector1)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector2)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector3)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector4)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector5)).Count >= 1);

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
        }
        /// <summary>
        /// waits for element(s) to appear based on css selectors, 30 second timeout
        /// </summary>
        /// <param name="selector1"></param>
        /// <param name="selector2"></param>
        /// <param name="selector3"></param>
        /// <param name="selector4"></param>
        /// <param name="selector5"></param>
        /// <param name="selector6"></param>
        /// <param name="driver"></param>
        public static void Wait(string selector1, string selector2, string selector3, string selector4, string selector5, string selector6, IWebDriver driver)
        {
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(e => {
                List<bool> results = new List<bool>();
                results.Add(e.FindElements(By.CssSelector(selector1)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector2)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector3)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector4)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector5)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector6)).Count >= 1);

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
        }
        /// <summary>
        /// waits for element(s) to appear based on css selectors, 30 second timeout
        /// </summary>
        /// <param name="selector1"></param>
        /// <param name="selector2"></param>
        /// <param name="selector3"></param>
        /// <param name="selector4"></param>
        /// <param name="selector5"></param>
        /// <param name="selector6"></param>
        /// <param name="selector7"></param>
        /// <param name="driver"></param>
        public static void Wait(string selector1, string selector2, string selector3, string selector4, string selector5, string selector6, string selector7, IWebDriver driver)
        {
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(e => {
                List<bool> results = new List<bool>();
                results.Add(e.FindElements(By.CssSelector(selector1)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector2)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector3)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector4)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector5)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector6)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector7)).Count >= 1);

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
        }
        /// <summary>
        /// waits for element(s) to appear based on css selectors, 30 second timeout
        /// </summary>
        /// <param name="selector1"></param>
        /// <param name="selector2"></param>
        /// <param name="selector3"></param>
        /// <param name="selector4"></param>
        /// <param name="selector5"></param>
        /// <param name="selector6"></param>
        /// <param name="selector7"></param>
        /// <param name="selector8"></param>
        /// <param name="driver"></param>
        public static void Wait(string selector1, string selector2, string selector3, string selector4, string selector5, string selector6, string selector7, string selector8, IWebDriver driver)
        {
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(e => {
                List<bool> results = new List<bool>();
                results.Add(e.FindElements(By.CssSelector(selector1)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector2)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector3)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector4)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector5)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector6)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector7)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector8)).Count >= 1);

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
        }
        /// <summary>
        /// waits for element(s) to appear based on css selectors, 30 second timeout
        /// </summary>
        /// <param name="selector1"></param>
        /// <param name="selector2"></param>
        /// <param name="selector3"></param>
        /// <param name="selector4"></param>
        /// <param name="selector5"></param>
        /// <param name="selector6"></param>
        /// <param name="selector7"></param>
        /// <param name="selector8"></param>
        /// <param name="selector9"></param>
        /// <param name="driver"></param>
        public static void Wait(string selector1, string selector2, string selector3, string selector4, string selector5, string selector6, string selector7, string selector8, string selector9, IWebDriver driver)
        {
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(e => {
                List<bool> results = new List<bool>();
                results.Add(e.FindElements(By.CssSelector(selector1)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector2)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector3)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector4)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector5)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector6)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector7)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector8)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector9)).Count >= 1);

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
        }
        /// <summary>
        /// waits for element(s) to appear based on css selectors, 30 second timeout
        /// </summary>
        /// <param name="selector1"></param>
        /// <param name="selector2"></param>
        /// <param name="selector3"></param>
        /// <param name="selector4"></param>
        /// <param name="selector5"></param>
        /// <param name="selector6"></param>
        /// <param name="selector7"></param>
        /// <param name="selector8"></param>
        /// <param name="selector9"></param>
        /// <param name="selector10"></param>
        /// <param name="driver"></param>
        public static void Wait(string selector1, string selector2, string selector3, string selector4, string selector5, string selector6, string selector7, string selector8, string selector9, string selector10, IWebDriver driver)
        {
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(e => {
                List<bool> results = new List<bool>();
                results.Add(e.FindElements(By.CssSelector(selector1)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector2)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector3)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector4)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector5)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector6)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector7)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector8)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector9)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector10)).Count >= 1);

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
        }

        /// <summary>
        /// waits for element(s) to appear based on css selectors, 30 second timeout
        /// </summary>
        /// <param name="selector1"></param>
        /// <param name="selector2"></param>
        /// <param name="selector3"></param>
        /// <param name="selector4"></param>
        /// <param name="selector5"></param>
        /// <param name="selector6"></param>
        /// <param name="selector7"></param>
        /// <param name="selector8"></param>
        /// <param name="selector9"></param>
        /// <param name="selector10"></param>
        /// <param name="selector11"></param>
        /// <param name="driver"></param>
        public static void Wait(string selector1, string selector2, string selector3, string selector4, string selector5, string selector6, string selector7, string selector8, string selector9, string selector10, string selector11, IWebDriver driver)
        {
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(e => {
                List<bool> results = new List<bool>();
                results.Add(e.FindElements(By.CssSelector(selector1)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector2)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector3)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector4)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector5)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector6)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector7)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector8)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector9)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector10)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector11)).Count >= 1);

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
        }

        /// <summary>
        /// waits for element(s) to appear based on css selectors, 30 second timeout
        /// </summary>
        /// <param name="selector1"></param>
        /// <param name="selector2"></param>
        /// <param name="selector3"></param>
        /// <param name="selector4"></param>
        /// <param name="selector5"></param>
        /// <param name="selector6"></param>
        /// <param name="selector7"></param>
        /// <param name="selector8"></param>
        /// <param name="selector9"></param>
        /// <param name="selector10"></param>
        /// <param name="selector11"></param>
        /// <param name="selector12"></param>
        /// <param name="driver"></param>
        public static void Wait(string selector1, string selector2, string selector3, string selector4, string selector5, string selector6, string selector7, string selector8, string selector9, string selector10, string selector11, string selector12, IWebDriver driver)
        {
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(e => {
                List<bool> results = new List<bool>();
                results.Add(e.FindElements(By.CssSelector(selector1)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector2)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector3)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector4)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector5)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector6)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector7)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector8)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector9)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector10)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector11)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector12)).Count >= 1);

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
        }

        /// <summary>
        /// waits for element(s) to appear based on css selectors, 30 second timeout
        /// </summary>
        /// <param name="selector1"></param>
        /// <param name="selector2"></param>
        /// <param name="selector3"></param>
        /// <param name="selector4"></param>
        /// <param name="selector5"></param>
        /// <param name="selector6"></param>
        /// <param name="selector7"></param>
        /// <param name="selector8"></param>
        /// <param name="selector9"></param>
        /// <param name="selector10"></param>
        /// <param name="selector11"></param>
        /// <param name="selector12"></param>
        /// <param name="selector13"></param>
        /// <param name="driver"></param>
        public static void Wait(string selector1, string selector2, string selector3, string selector4, string selector5, string selector6, string selector7, string selector8, string selector9, string selector10, string selector11, string selector12, string selector13, IWebDriver driver)
        {
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(e => {
                List<bool> results = new List<bool>();
                results.Add(e.FindElements(By.CssSelector(selector1)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector2)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector3)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector4)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector5)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector6)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector7)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector8)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector9)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector10)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector11)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector12)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector13)).Count >= 1);

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
        }

        /// <summary>
        /// waits for element(s) to appear based on css selectors, 30 second timeout
        /// </summary>
        /// <param name="selector1"></param>
        /// <param name="selector2"></param>
        /// <param name="selector3"></param>
        /// <param name="selector4"></param>
        /// <param name="selector5"></param>
        /// <param name="selector6"></param>
        /// <param name="selector7"></param>
        /// <param name="selector8"></param>
        /// <param name="selector9"></param>
        /// <param name="selector10"></param>
        /// <param name="selector11"></param>
        /// <param name="selector12"></param>
        /// <param name="selector13"></param>
        /// <param name="selector14"></param>
        /// <param name="driver"></param>
        public static void Wait(string selector1, string selector2, string selector3, string selector4, string selector5, string selector6, string selector7, string selector8, string selector9, string selector10, string selector11, string selector12, string selector13, string selector14, IWebDriver driver)
        {
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(e => {
                List<bool> results = new List<bool>();
                results.Add(e.FindElements(By.CssSelector(selector1)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector2)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector3)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector4)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector5)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector6)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector7)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector8)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector9)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector10)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector11)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector12)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector13)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector14)).Count >= 1);

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
        }

        /// <summary>
        /// waits for element(s) to appear based on css selectors, 30 second timeout
        /// </summary>
        /// <param name="selector1"></param>
        /// <param name="selector2"></param>
        /// <param name="selector3"></param>
        /// <param name="selector4"></param>
        /// <param name="selector5"></param>
        /// <param name="selector6"></param>
        /// <param name="selector7"></param>
        /// <param name="selector8"></param>
        /// <param name="selector9"></param>
        /// <param name="selector10"></param>
        /// <param name="selector11"></param>
        /// <param name="selector12"></param>
        /// <param name="selector13"></param>
        /// <param name="selector14"></param>
        /// <param name="selector15"></param>
        /// <param name="driver"></param>
        public static void Wait(string selector1, string selector2, string selector3, string selector4, string selector5, string selector6, string selector7, string selector8, string selector9, string selector10, string selector11, string selector12, string selector13, string selector14, string selector15, IWebDriver driver)
        {
            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
            wait.Until(e => {
                List<bool> results = new List<bool>();
                results.Add(e.FindElements(By.CssSelector(selector1)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector2)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector3)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector4)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector5)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector6)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector7)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector8)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector9)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector10)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector11)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector12)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector13)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector14)).Count >= 1);
                results.Add(e.FindElements(By.CssSelector(selector15)).Count >= 1);

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
        }
    }
}
