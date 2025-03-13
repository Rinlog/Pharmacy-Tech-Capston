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

//Drug Button Test
IWebDriver driver2 = new FirefoxDriver(Path);
driver2.Url = BaseUrl;
bool US3DrugButton = HomePageButtons.TestDrugsButton(driver2, BaseUrl);
Console.Clear();
driver2.Quit();

//Physician Button Test
IWebDriver driver3 = new FirefoxDriver(Path);
driver3.Url = BaseUrl;
bool US3PhysicianButton = HomePageButtons.TestPhysiciansButton(driver3, BaseUrl);
Console.Clear();
driver3.Quit();

//Patients Button Test
IWebDriver driver4 = new FirefoxDriver(Path);
driver4.Url = BaseUrl;
bool US3PatientsButton = HomePageButtons.TestPatientsButton(driver4, BaseUrl);
Console.Clear();
driver4.Quit();

//Orders Button Test
IWebDriver driver5 = new FirefoxDriver(Path);
driver5.Url = BaseUrl;
bool US4OrdersButton = HomePageButtons.TestOrdersButton(driver5, BaseUrl);
Console.Clear();
driver5.Quit();

//Verification Button Test
IWebDriver driver6 = new FirefoxDriver(Path);
driver6.Url = BaseUrl;
bool US4VerificationButton = HomePageButtons.TestVerificationButton(driver6, BaseUrl);
Console.Clear();
driver6.Quit();


//Setup for outputting results nicely
Console.Clear();
Console.WriteLine("################## RESULTS ##################");
Console.WriteLine();

//output all results below

OutPutResult(US3ValidLogin, "US3ValidLogin: ");
OutPutResult(US3FailedLogin, "US3FailedLogin: ");
OutPutResult(US3DrugButton, "US3DrugButton: ");
OutPutResult(US3PhysicianButton, "US3PhysicianButton: ");
OutPutResult(US3PatientsButton, "US3PatientsButton: ");
OutPutResult(US4OrdersButton, "US4OrdersButton: ");
OutPutResult(US4VerificationButton, "US4VerificationButton: ");


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