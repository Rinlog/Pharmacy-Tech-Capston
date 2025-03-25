//this will be the main zone where we execute all our tests
using OpenQA.Selenium;
using OpenQA.Selenium.Firefox;
using QATesting.SiteTests;

string Path = System.IO.Path.GetFullPath("../../../../../GeckoDriver");
Console.WriteLine("Path to GeckoDriver: "+ Path);
string BaseUrl = "https://pharmtech.nbcc.ca"; //feel free to change this to a local frontend ip. //http://localhost:5173  //https://pharmtech.nbcc.ca
Console.WriteLine("Site Testing: "+ BaseUrl);

//Valid Signup Test
IWebDriver signup = new FirefoxDriver(Path);
signup.Url = BaseUrl;
bool US1SignUp = SignupTests.TestValidSignup(signup, BaseUrl);
Console.Clear();
signup.Quit();

//Leave this commented out for now, uncomment it when we have a create user test
//Delete User Test
IWebDriver driver8 = new FirefoxDriver(Path);
driver8.Url = BaseUrl;
bool US2DeleteUser = UserManagementTests.DeleteUser(driver8, BaseUrl);
Console.Clear();
driver8.Quit();

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

//Reset Password Test
IWebDriver driver10 = new FirefoxDriver(Path);
driver10.Url = BaseUrl;
bool US3PasswordReset = LoginTests.TestPasswordReset(driver10, BaseUrl);
Console.Clear();
driver10.Quit();

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

//ImageUpload, aka everything above tested with images
IWebDriver driver15 = new FirefoxDriver(Path);
driver15.Url = BaseUrl;
bool US5UploadImage = OrderTests.US5UploadPrescriptionOrder(driver15, BaseUrl);
Console.Clear();
driver15.Quit();

//Print Order To PDF
IWebDriver driver16 = new FirefoxDriver(Path);
driver16.Manage().Window.Maximize();
driver16.Url = BaseUrl;
bool US9PrintOrderToPDF = OrderTests.US9PrintOrderToPDF(driver16, BaseUrl);
Console.Clear();
driver16.Quit();

//Print Order To Printer
IWebDriver driver17 = new FirefoxDriver(Path);
driver17.Manage().Window.Maximize();
driver17.Url = BaseUrl;
bool US9PrintOrderToPrinter = OrderTests.US9PrintOrderToPrinter(driver17, BaseUrl);
Console.Clear();
driver17.Quit();

//RePrint Order To PDF
IWebDriver driver18 = new FirefoxDriver(Path);
driver18.Manage().Window.Maximize();
driver18.Url = BaseUrl;
bool US10RePrintOrderToPDF = OrderTests.US10RePrintOrderToPDF(driver18, BaseUrl);
Console.Clear();
driver18.Quit();

//RePrint Order To Printer
IWebDriver driver19 = new FirefoxDriver(Path);
driver19.Manage().Window.Maximize();
driver19.Url = BaseUrl;
bool US10RePrintOrderToPrinter = OrderTests.US10RePrintOrderToPrinter(driver19, BaseUrl);
Console.Clear();
driver19.Quit();

//Add Drug Test (Single)
IWebDriver driver20 = new FirefoxDriver(Path);
driver20.Url = BaseUrl;
bool US13AddDrugSingle = DrugsTests.TestAddDrugSingle(driver20, BaseUrl);
Console.Clear();
driver20.Quit();

//Add Drug Test (Bulk)
IWebDriver driver21 = new FirefoxDriver(Path);
driver21.Url = BaseUrl;
bool US13AddDrugBulk = DrugsTests.TestAddDrugBulk(driver21, BaseUrl);
Console.Clear();
driver21.Quit();

//View Drug Test
IWebDriver driver2 = new FirefoxDriver(Path);
driver2.Url = BaseUrl;
bool US14ViewDrugs = DrugsTests.TestViewDrug(driver2, BaseUrl);
Console.Clear();
driver2.Quit();

//Edit Drug Test
IWebDriver driver3 = new FirefoxDriver(Path);
driver3.Url = BaseUrl;
bool US16EditDrug = DrugsTests.TestEditDrug(driver3, BaseUrl);
Console.Clear();
driver3.Quit();

//Delete Drug Test (Single)
IWebDriver driver22 = new FirefoxDriver(Path);
driver22.Url = BaseUrl;
bool US15DeleteDrugSingle = DrugsTests.TestDeleteDrug(driver22, BaseUrl, false);
Console.Clear();
driver22.Quit();

//Delete Drug Test (Multi)
IWebDriver driver23 = new FirefoxDriver(Path);
driver23.Url = BaseUrl;
bool US15DeleteDrugMulti = DrugsTests.TestDeleteDrug(driver23, BaseUrl, true);
Console.Clear();
driver23.Quit();

//Add Physician (single)
IWebDriver driver24 = new FirefoxDriver(Path);
driver24.Url = BaseUrl;
bool US17AddPhysicianSingle = PhysiciansTests.TestAddPhysicianSingle(driver24, BaseUrl);
Console.Clear();
driver24.Quit();

//Add Physician (bulk)
IWebDriver driver25 = new FirefoxDriver(Path);
driver25.Url = BaseUrl;
bool US17AddPhysicianBulk = PhysiciansTests.TestAddPhysicianBulk(driver25, BaseUrl);
Console.Clear();
driver25.Quit();

//View physician Test
IWebDriver driver4 = new FirefoxDriver(Path);
driver4.Url = BaseUrl;
bool US18ViewPhysician = PhysiciansTests.TestViewPhysician(driver4, BaseUrl);
Console.Clear();
driver4.Quit();

//Edit physician Test
IWebDriver driver5 = new FirefoxDriver(Path);
driver5.Url = BaseUrl;
bool US20EditPhysician = PhysiciansTests.TestEditPhysician(driver5, BaseUrl);
Console.Clear();
driver5.Quit();

//Delete Physician (single)
IWebDriver driver26 = new FirefoxDriver(Path);
driver26.Url = BaseUrl;
bool US19DeletePhysicianSingle = PhysiciansTests.TestDeletePhysician(driver26, BaseUrl, false);
Console.Clear();
driver26.Quit();

//Delete Physician (multi)
IWebDriver driver27 = new FirefoxDriver(Path);
driver27.Url = BaseUrl;
bool US19DeletePhysicianMulti = PhysiciansTests.TestDeletePhysician(driver27, BaseUrl, true);
Console.Clear();
driver27.Quit();

//Add Patient (Single)
IWebDriver driver28 = new FirefoxDriver(Path);
driver28.Url = BaseUrl;
bool US21AddPatientSingle = PatientsTests.TestAddPatientSingle(driver28,BaseUrl);
Console.Clear();
driver28.Quit();

//Add Patient (Bulk)
IWebDriver driver29 = new FirefoxDriver(Path);
driver29.Url = BaseUrl;
bool US21AddPatientBulk = PatientsTests.TestAddPatientBulk(driver29, BaseUrl);
Console.Clear();
driver29.Quit();

//View Patient Test
IWebDriver driver6 = new FirefoxDriver(Path);
driver6.Url = BaseUrl;
bool US22ViewPatients = PatientsTests.TestViewPatient(driver6, BaseUrl);
Console.Clear();
driver6.Quit();

//Edit patient Test
IWebDriver driver7 = new FirefoxDriver(Path);
driver7.Url = BaseUrl;
bool US24EditPatient = PatientsTests.TestEditPatient(driver7, BaseUrl);
Console.Clear();
driver7.Quit();

//Delete Patient (Single)
IWebDriver driver30 = new FirefoxDriver(Path);
driver30.Url = BaseUrl;
bool US23DeletePatientSingle = PatientsTests.TestDeletePatient(driver30, BaseUrl,false);
Console.Clear();
driver30.Quit();

//Delete Patient (Multi)
IWebDriver driver31 = new FirefoxDriver(Path);
driver31.Url = BaseUrl;
bool US23DeletePatientMulti = PatientsTests.TestDeletePatient(driver31, BaseUrl, true);
Console.Clear();
driver31.Quit();

//View Orders Test
IWebDriver driver33 = new FirefoxDriver(Path);
driver33.Url = BaseUrl;
bool US12ViewOrders = HomePageButtons.TestOrdersButton(driver33, BaseUrl);
Console.Clear();
driver33.Quit();

//Timeout Test
IWebDriver driver34 = new FirefoxDriver(Path);
driver34.Url = BaseUrl;
bool US11TimeOut = TimeOutTest.TestTimeOut(driver34, BaseUrl);
Console.Clear();
driver34.Quit();

//Setup for outputting results nicely
Console.Clear();
Console.WriteLine("################## RESULTS ##################");
Console.WriteLine("In case a test fails, always start with first one that \nfails, as that may be the reason for others failing");
Console.WriteLine();

//output all results below

OutPutResult(US1SignUp, "US1SignUp: ");
OutPutResult(US2DeleteUser, "US2DeleteUser: ");
OutPutResult(US3ValidLogin, "US3ValidLogin: ");
OutPutResult(US3FailedLogin, "US3FailedLogin: ");
OutPutResult(US3PasswordReset, "US3PasswordReset: ");
OutPutResult(US4CreateOrder, "US4CreateOrder: ");
OutPutResult(US5UploadImage, "US5UploadImage: ");
OutPutResult(US7RejectOrder, "US7RejectOrder: ");
OutPutResult(US7VerifyOrder, "US7VerifyOrder: ");
OutPutResult(US8AmendOrder, "US8AmendOrder: ");
OutPutResult(US9PrintOrderToPDF, "US9PrintOrderToPDF: ");
OutPutResult(US9PrintOrderToPrinter, "US9PrintOrderToPrinter: ");
OutPutResult(US10RePrintOrderToPDF, "US10RePrintOrderToPDF: ");
OutPutResult(US10RePrintOrderToPrinter, "US10RePrintOrderToPrinter: ");
OutPutResult(US11TimeOut, "US11TimeOut: ");
OutPutResult(US12ViewOrders, "US12ViewOrders: ");
OutPutResult(US13AddDrugSingle, "US13AddDrugSingle: ");
OutPutResult(US13AddDrugBulk, "US13AddDrugBulk: ");
OutPutResult(US14ViewDrugs, "US14ViewDrugs: ");
OutPutResult(US15DeleteDrugSingle, "US15DeleteDrugSingle: ");
OutPutResult(US15DeleteDrugMulti, "US15DeleteDrugMulti: ");
OutPutResult(US16EditDrug, "US16EditDrug: ");
OutPutResult(US17AddPhysicianSingle, "US17AddPhysicianSingle: ");
OutPutResult(US17AddPhysicianBulk, "US17AddPhysicianBulk: ");
OutPutResult(US18ViewPhysician, "US18ViewPhysicians: ");
OutPutResult(US19DeletePhysicianSingle, "US19DeletePhysicianSingle: ");
OutPutResult(US19DeletePhysicianMulti, "US19DeletePhysicianMulti: ");
OutPutResult(US20EditPhysician, "US20EditPhysician: ");
OutPutResult(US21AddPatientSingle, "US21AddPatientSingle: ");
OutPutResult(US21AddPatientBulk, "US21AddPatientBulk: ");
OutPutResult(US22ViewPatients, "US22ViewPatients: ");
OutPutResult(US23DeletePatientSingle, "US23DeletePatientSingle: ");
OutPutResult(US23DeletePatientMulti, "US23DeletePatientMulti: ");
OutPutResult(US24EditPatient, "US24EditPatient: ");

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