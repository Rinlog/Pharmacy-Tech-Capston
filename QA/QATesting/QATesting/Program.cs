//this will be the main zone where we execute all our tests
using OpenQA.Selenium;
using OpenQA.Selenium.Firefox;
using QATesting.SiteTests;

string Path = System.IO.Path.GetFullPath("../../../../../GeckoDriver");
Console.WriteLine("Path to GeckoDriver: "+ Path);
string BaseUrl = "https://pharmtech.nbcc.ca"; //feel free to change this to a local frontend ip. //http://localhost:5173  //https://pharmtech.nbcc.ca
Console.WriteLine("Site Testing: "+ BaseUrl);

////Valid Signup Test
//IWebDriver signup = new FirefoxDriver(Path);
//signup.Url = BaseUrl;
//bool US1SignUp = SignupTests.TestValidSignup(signup, BaseUrl);
//Console.Clear();
//signup.Quit();

////Leave this commented out for now, uncomment it when we have a create user test
////Delete User Test
//IWebDriver driver8 = new FirefoxDriver(Path);
//driver8.Url = BaseUrl;
//bool US2DeleteUser = UserManagementTests.DeleteUser(driver8, BaseUrl);
//Console.Clear();
//driver8.Quit();

////Valid Login Test
//IWebDriver driver = new FirefoxDriver(Path);
//driver.Url = BaseUrl;
//bool US3ValidLogin = LoginTests.TestValidLogin(driver, BaseUrl);
//Console.Clear();
//driver.Quit();

////Failed Login Test
//IWebDriver driver1 = new FirefoxDriver(Path);
//driver1.Url = BaseUrl;
//bool US3FailedLogin = LoginTests.TestFailedLogin(driver1, BaseUrl);
//Console.Clear();
//driver1.Quit();

////Reset Password Test
//IWebDriver driver10 = new FirefoxDriver(Path);
//driver10.Url = BaseUrl;
//bool US3PasswordReset = LoginTests.TestPasswordReset(driver10, BaseUrl);
//Console.Clear();
//driver10.Quit();

//Create Order Test
IWebDriver driver11 = new FirefoxDriver(Path);
driver11.Url = BaseUrl;
bool US4CreateOrder = OrderTests.US4EnterPrescriptionOrder(driver11, BaseUrl);
Console.Clear();
driver11.Quit();

//Reject Order Test
IWebDriver driver13 = new FirefoxDriver(Path);
driver13.Url = BaseUrl;
bool US7RejectOrder = VerificationTests.US7TestRejectOrderVerification(driver13, BaseUrl);
Console.Clear();
driver13.Quit();

//Amend Order Test, doing it after reject order test so we can amend that rejected order
IWebDriver driver14 = new FirefoxDriver(Path);
driver14.Url = BaseUrl;
bool US8AmendOrder = OrderTests.US8AmendPrescriptionOrder(driver14, BaseUrl);
Console.Clear();
driver14.Quit();

//Verify Order Test
IWebDriver driver12 = new FirefoxDriver(Path);
driver12.Url = BaseUrl;
bool US7VerifyOrder = VerificationTests.US7TestApprovedVerification(driver12, BaseUrl);
Console.Clear();
driver12.Quit();

//ImageUpload, aka everything above tested with images, not complete but i planned on doing it all in one driver test, basically just using above logic

////View Drug Test
//IWebDriver driver2 = new FirefoxDriver(Path);
//driver2.Url = BaseUrl;
//bool US14ViewDrugs = DrugsTests.TestViewDrug(driver2, BaseUrl);
//Console.Clear();
//driver2.Quit();

////Edit Drug Test
//IWebDriver driver3 = new FirefoxDriver(Path);
//driver3.Url = BaseUrl;
//bool US16EditDrug = DrugsTests.TestEditDrug(driver3, BaseUrl);
//Console.Clear();
//driver3.Quit();

////View physician Test
//IWebDriver driver4 = new FirefoxDriver(Path);
//driver4.Url = BaseUrl;
//bool US18ViewPhysician = PhysiciansTests.TestViewPhysician(driver4, BaseUrl);
//Console.Clear();
//driver4.Quit();

////Edit physician Test
//IWebDriver driver5 = new FirefoxDriver(Path);
//driver5.Url = BaseUrl;
//bool US20EditPhysician = PhysiciansTests.TestEditPhysician(driver5, BaseUrl);
//Console.Clear();
//driver5.Quit();

////View Patient Test
//IWebDriver driver6 = new FirefoxDriver(Path);
//driver6.Url = BaseUrl;
//bool US22ViewPatients = PatientsTests.TestViewPatient(driver6, BaseUrl);
//Console.Clear();
//driver6.Quit();

////Edit patient Test
//IWebDriver driver7 = new FirefoxDriver(Path);
//driver7.Url = BaseUrl;
//bool US24EditPatient = PatientsTests.TestEditPatient(driver7, BaseUrl);
//Console.Clear();
//driver7.Quit();


//Setup for outputting results nicely
Console.Clear();
Console.WriteLine("################## RESULTS ##################");
Console.WriteLine("In case a test fails, always start with first one that \nfails, as that may be the reason for others failing");
Console.WriteLine();

//output all results below

//OutPutResult(US1SignUp, "US1SignUp: ");
//OutPutResult(US2DeleteUser, "US2DeleteUser: ");
//OutPutResult(US3ValidLogin, "US3ValidLogin: ");
//OutPutResult(US3FailedLogin, "US3FailedLogin: ");
OutPutResult(US4CreateOrder, "US3CreateOrder: ");
OutPutResult(US7RejectOrder, "US7RejectOrder: ");
OutPutResult(US7VerifyOrder, "US7VerifyOrder: ");
OutPutResult(US8AmendOrder, "US8AmendOrder: ");
//OutPutResult(US3PasswordReset, "US3PasswordReset: ");
//OutPutResult(US14ViewDrugs, "US14ViewDrugs: ");
//OutPutResult(US16EditDrug, "US16EditDrug: ");
//OutPutResult(US18ViewPhysician, "US18ViewPhysicians: ");
//OutPutResult(US20EditPhysician, "US20EditPhysician: ");
//OutPutResult(US22ViewPatients, "US22ViewPatients: ");
//OutPutResult(US24EditPatient, "US24EditPatient: ");



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