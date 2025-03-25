using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium;

namespace QATesting.Methods
{
    internal class UtilityMethods
    {
        /// <summary>
        /// Will check if the file name specified has been downloaded up to 1 minute ago
        /// </summary>
        /// <param name="FileName"></param>
        /// <returns></returns>
        public static bool CheckIfDownloaded(string FileName)
        {
            //now to verify a download we check the downloads folder, removing the file once we detect it

            string LocalDownloads = System.Environment.GetEnvironmentVariable("USERPROFILE") + "\\Downloads";
            string[] filesInDownload = Directory.GetFiles(LocalDownloads);

            //waits until it can find it with a 30 second buffer
            for (int i = 0; i < 30; i++)
            {
                filesInDownload = Directory.GetFiles(LocalDownloads);
                foreach (var file in filesInDownload)
                {
                    if (file.Contains(FileName))
                    {
                        

                        FileInfo FileToDelete = new FileInfo(file);
                        //checking if the file was last modified a minute ago or less
                        if (DateTime.Now.Subtract(FileToDelete.LastWriteTime).Seconds <= 60)
                        {
                            FileToDelete.Delete();
                            while (FileToDelete.Exists)
                            {
                                Thread.Sleep(100);
                            }
                            return true;
                        }
                        break;
                    }
                }
                Thread.Sleep(1000);
            }
            return false;
        }

        /// <summary>
        /// This is a utility method for selecting anything based on 2 test field values,
        /// index= index of field we are testing for a value
        /// AllRows= a ReadOnlyCollection of all the tr elements in the table
        /// TestMessage1-2= the strings that you are looking for the index field to contain as a value
        /// MultiSelect= if you want to select every occurance of those items or not
        /// 
        /// </summary>
        /// <param name="index"></param>
        /// <param name="AllRows"></param>
        /// <param name="TestMessage"></param>
        /// <param name="TestMessage2"></param>
        /// <param name="MultiSelect"></param>
        /// <returns></returns>
        public static bool SelectTestItem(int index, ReadOnlyCollection<IWebElement> AllRows, string TestMessage, string TestMessage2,IWebDriver driver, bool MultiSelect = false)
        {
            try
            {
                foreach (var tr in AllRows)
                {
                    var Row = tr.FindElements(By.CssSelector("td"));
                    if (Row.Count > 0)
                    {

                        if (Row.ElementAt(index).Text.ToLower().Contains(TestMessage.ToLower()) || Row.ElementAt(index).Text.ToLower().Contains(TestMessage2.ToLower()))
                        {
                            IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
                            js.ExecuteScript("arguments[0].scrollIntoView({block: 'center'});", Row.ElementAt(0));
                            Thread.Sleep(500);
                            Row.ElementAt(0).FindElement(By.CssSelector("input")).Click();
                            if (MultiSelect == false)
                            {
                                break;
                            }
                        }
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
