//this will be the main zone where we execute all our tests
using OpenQA.Selenium;
using OpenQA.Selenium.Firefox;
using QATesting.SiteTests;

string Path = System.IO.Path.GetFullPath("../../../../../GeckoDriver");
Console.WriteLine("Path to GeckoDriver: "+ Path);
string BaseUrl = "https://pharmtech.nbcc.ca"; //feel free to change this to a local frontend ip.
Console.WriteLine("Site Testing: "+ BaseUrl);

//Valid Login Test
IWebDriver driver = new FirefoxDriver(Path);
driver.Url = BaseUrl;
bool US3ValidLogin = LoginTests.TestValidLogin(driver, BaseUrl);
Console.Clear();
driver.Quit();

//Failed Login Test
IWebDriver driver1 = new FirefoxDriver(Path);
driver1.Url = BaseUrl;
bool US3FailedLogin = LoginTests.TestFailedLogin(driver1, BaseUrl);
Console.Clear();
driver1.Quit();


//Setup for outputting results nicely
Console.Clear();
Console.WriteLine("################## RESULTS ##################");
Console.WriteLine();

//output all results below

OutPutResult(US3ValidLogin, "US3ValidLogin: ");
OutPutResult(US3FailedLogin, "US3FailedLogin: ");


Console.ReadLine();


//used to display nice result messages for people running the tests
void OutPutResult(bool result, string PreMessage)
{
    Console.ForegroundColor = ConsoleColor.White;
    Console.Write(PreMessage);
    if (result == true)
    {
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("PASS");
    }
    else
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine("FAIL");
    }
}