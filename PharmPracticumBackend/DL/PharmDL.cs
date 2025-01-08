using System.Data;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System.Net.Mail;
using System.Net;
using PharmPracticumBackend.DTO;
using PharmPracticumBackend.DTO;
using System.Numerics;
using Microsoft.Extensions.Configuration.UserSecrets;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;
using System.ComponentModel;


namespace PharmPracticumBackend.DL
{
    public class PharmDL
    {

        //private readonly IConfiguration _configuration;

        private readonly string _connectionString;

        public PharmDL(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnectionRemoteServer");
        }

        //Opens connection
        private SqlConnection GetOpenConnection()
        {
            Console.WriteLine("GetOpenConnection");
            var connection = new SqlConnection(_connectionString);
            Console.WriteLine("Connection State: " + connection.State);
            if (connection.State != ConnectionState.Open)
            {
                connection.Open();
            }
            return connection;
        }

        //used for creating commands
        public SqlCommand CreateCommand(SqlConnection connection, SqlTransaction transaction)
        {
            var command = connection.CreateCommand();
            command.Transaction = transaction;
            return command;
        }

        //Close Connection
        public void Disconnect(SqlConnection connection)
        {
            connection.Close();
        }

        //db connection test
        public async Task<string> CanIConnect()
        {

            string result = "Could not connect";

            try
            {

                using var connection = GetOpenConnection();

                SqlCommand cmd = new SqlCommand("SELECT fName from dbo.UserTable WHERE userID = 000000", connection);

                using var reader = cmd.ExecuteReader();

                if (reader.Read())
                {

                    result = reader["fName"].ToString();

                }

                return result;

            }
            catch (Exception ex)
            {
                result = ex.Message;
                return result;
            }

        }

        public async Task<namesRequestDTO> GetNames(namesRequestDTO request)
        {
            try
            {
                using var connection = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.getNames", connection);

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@userID", request.UserID);
                cmd.Parameters.AddWithValue("@PPR", request.PPR);
                cmd.Parameters.AddWithValue("@physicianID", request.PhysicianID);
                cmd.Parameters.AddWithValue("@DIN", request.DIN);

                using (var reader = await cmd.ExecuteReaderAsync())
                {

                    while (reader.Read())
                    {
                        request.UserFName = reader["userFName"].ToString();
                        request.UserLName = reader["userLName"].ToString();
                        request.PatientFName = reader["patientFName"].ToString();
                        request.PatientLName = reader["patientLName"].ToString();
                        request.PhysicianFName = reader["physicianFName"].ToString();
                        request.PhysicianLName = reader["physicianLName"].ToString();
                        request.DrugName = reader["drugName"].ToString();

                    }
                }
            }
            catch(Exception ex)
            {
                request.UserFName = "Error: " + ex.Message;
            }


            return request;
        }

        //USER METHODS

        //Login authorization
        public async Task<authUserDTO> ValidateUserAsync(string email, string pass)
        {

            authUserDTO user = new authUserDTO();

            user.Admin = "N";
            user.UserId = "";

            try
            {

                //grab the ID using email
                string userID = await GetIDByEmailAsync(email);

                Console.WriteLine(userID);

                //if this returns a valid userID, check if active
                if (userID != "")
                {

                    //check if user is active
                    bool active = await IsUserActive(userID);

                    Console.WriteLine(active.ToString());   

                    //if not, return
                    if (!active)
                    {
                        return user;
                    }

                    //SQL to validate user's pass
                    using var connection = GetOpenConnection();

                    SqlCommand cmd = new SqlCommand("dbo.checkPassword", connection);

                    cmd.Parameters.AddWithValue("@userID", userID);
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {

                        if (reader.Read())
                        {

                            string dbHash = reader["password"].ToString();

                            //if we don't get one, send back an empty user
                            if (string.IsNullOrEmpty(dbHash))
                            {
                                return user;
                            }

                            //if we do, run the check
                            PasswordHasher<object> hasher = new PasswordHasher<object>();

                            PasswordVerificationResult verified = hasher.VerifyHashedPassword(null, dbHash, pass);

                            switch (verified)
                            {

                                case PasswordVerificationResult.Success:
                                    //pull info
                                    user = await GetLoginInfoAsync(userID);

                                    //return user info we need (email, id, admin)
                                    return user;
                                case PasswordVerificationResult.Failed:
                                    return user;

                            }

                        }

                    }

                }

                return user;

            }
            catch (Exception ex)
            {
                Console.Write(ex.Message);
                user.Admin = "N";
                user.UserId = "";
                return user;
            }

        }

        public async Task<string> SignupUserAsync(signupDTO user, bool isAdmin)
        {
            // Default error message
            string result = "User could not be signed up";

            try
            {
                using var connection = GetOpenConnection();

                // Make sure the campus is valid
                //                      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  IMPORTANT  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                // This list will need to be updated AS WELL AS the list in the insertUser stored procedure in the DB
                // If there is a mismatch it will not work as intended, either not accepting valid campuses (according to the DB)
                // Or the back-end accepting campuses whose codes will be set to XX in the user ID
                List<string> validCampuses = new List<string> { "Fredericton", "St. John", "Moncton", "St. Andrews", "Miramichi", "Woodstock" };
                if (!validCampuses.Contains(user.Campus))
                {
                    // Campus is not in the approved list, reject it
                    return "User was not signed up: Invalid Campus";
                }

                // Check if the email is already in the system
                SqlCommand emailCheck = new SqlCommand("dbo.isEmailInUse", connection);

                emailCheck.CommandType = CommandType.StoredProcedure;

                emailCheck.Parameters.AddWithValue("@email", user.Email);
                var returnParameter = emailCheck.Parameters.Add("@returnVal", SqlDbType.Int);
                returnParameter.Direction = ParameterDirection.ReturnValue;

                await emailCheck.ExecuteNonQueryAsync();
                int emailFound = (int)returnParameter.Value;

                Console.WriteLine(emailFound);
                if (emailFound > 0)
                {
                    return "User was not signed up: Email already exists";
                }
                
                // Email does not exist, continue with insert

                SqlCommand cmd = new SqlCommand("dbo.insertUser", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@firstname", user.FirstName);
                cmd.Parameters.AddWithValue("@lastname", user.LastName);
                cmd.Parameters.AddWithValue("@password", user.Password);
                cmd.Parameters.AddWithValue("@email", user.Email);
                cmd.Parameters.AddWithValue("@campus", user.Campus);
                cmd.Parameters.AddWithValue("@admin", isAdmin).SqlDbType = SqlDbType.Bit;

                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                if (rowsAffected == 1)
                {
                    result = "User added successfully";
                }

                connection.Close();
            }
            catch (Exception ex)
            {
                result = ex.Message;
            }

            return result;
        }

        //get userID
        public async Task<string> GetIDByEmailAsync(string email)
        {

            //populate as empty string
            string id = "";

            try
            {

                using var connection = GetOpenConnection();

                SqlCommand cmd = new SqlCommand("dbo.getIDByEmail", connection);

                cmd.Parameters.AddWithValue("@email", email);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {

                    if (reader.Read())
                    {

                        id = reader["userID"].ToString();
                        Console.WriteLine(id);

                    }

                }

                return id;

            }
            catch (Exception ex)
            {
                id = "";
                Console.Write(ex.Message);
                return id;
            }

        }

        //Get a user's info
        public async Task<authUserDTO> GetLoginInfoAsync(string id)
        {

            authUserDTO user = new authUserDTO();
            user.Admin = "N";
            user.UserId = "";
            

            try
            {

                using var connection = GetOpenConnection();

                SqlCommand cmd = new SqlCommand("dbo.GetUserInfo", connection);

                cmd.Parameters.AddWithValue("@userID", id);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {

                    if (reader.Read())
                    {

                        //admin
                        bool admin = reader.GetBoolean(reader.GetOrdinal("admin"));
                        if (admin) user.Admin = "Y";
                        else user.Admin = "N";

                        user.UserId = id;

                        return user;

                    }

                }

                return user;

            }
            catch (Exception ex)
            {

                Console.Write(ex.Message);
                user.Admin = "N";
                user.UserId = "";
                return user;

            }



        }

        //bulk add user 
        public async Task<List<bulkUserDTO>> BulkUserAsync(List<bulkUserDTO> users)
        {

            //iterate through users
            foreach (bulkUserDTO user in users)
            {

                //if they should be inserted, attempt to do so
                if (user.ShouldInsert.Equals("Y"))
                {
                    signupDTO signup = new signupDTO();
                    signup.FirstName = user.FirstName;
                    signup.LastName = user.LastName;
                    signup.Email = user.Email;
                    signup.Password = " ";
                    signup.Campus = user.Campus;
                    string signRes = await SignupUserAsync(signup, false);

                    //if email exists, return error
                    if (signRes.Equals("Email already exists")) 
                    {
                        user.InsertResult = "Email already in use for " + user.Email;
                        user.IsInserted = "N";
                    }
                    //if user inserted, return success
                    else if (signRes.Equals("User added successfully"))
                    {
                        user.InsertResult = user.Email + " added succesfully.";
                        user.IsInserted = "Y";
                    }
                    //otherwise, generic error
                    else
                    {
                        user.InsertResult = user.Email + " could not be added.";
                        user.IsInserted = "N";
                    }


                }
                //if they shouldn't be inserted, set result
                else user.InsertResult = user.Email + " could not be added.";

            }

             return users;

        }

        //were they bulk added (ie, do they have an empty password?
        public async Task<bool> AllowPassSet(string userID)
        {

            bool result = false;

            try
            {

                using var connection = GetOpenConnection();

                SqlCommand cmd = new SqlCommand("dbo.checkForPass", connection);

                cmd.Parameters.AddWithValue("@userID", userID);

                SqlParameter returnParameter = cmd.Parameters.Add("@ReturnVal", SqlDbType.Int);
                returnParameter.Direction = ParameterDirection.ReturnValue;

                cmd.CommandType = CommandType.StoredProcedure;

                // Execute the stored procedure
                cmd.ExecuteNonQuery();

                // Capture the return value from the stored procedure
                int dbResult = (int)returnParameter.Value;

                if (dbResult == 1) result = true;

                return result;

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                result = false;
                return result;
            }

        }

        //Is User active?
        public async Task<bool> IsUserActive(string id)
        {

            bool active = false;

            try
            {

                //SQL
                using var connection = GetOpenConnection();

                SqlCommand cmd = new SqlCommand("dbo.isUserActive", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@userID", id);
                var returnParameter = cmd.Parameters.Add("@returnVal", SqlDbType.Int);
                returnParameter.Direction = ParameterDirection.ReturnValue;

                //are they active?
                cmd.ExecuteNonQuery();

                await cmd.ExecuteNonQueryAsync();
                int result = (int)returnParameter.Value;

                active = (result == 1);

                return active;

            }
            catch (Exception ex)
            {
                Console.Write(ex.Message);
                return false;
            }

        }

        public async Task<string> CreateCode(string userID, string usage)
        {
            // Generate code for either a password reset or a confirmation email
            // Based on the usage given
            int minRange = 111111;

            Random random = new Random();

            string code = random.Next(minRange, int.MaxValue).ToString();

            // If the code is for a password reset, it should have an expiration
            // Defaulting to two days
            DateTime expiry = DateTime.Now.AddDays(2);

            // Insert a row in the appropriate table for whichever code we have generated
            try
            {
                using var connection = GetOpenConnection();

                // Designate which proc to use based on the "usage" parameter
                SqlCommand cmd;
                if (usage == "Confirmation")
                {
                    cmd = new SqlCommand("dbo.insertConfirmationCode", connection);
                }
                else if(usage == "Reset")
                {
                    cmd = new SqlCommand("dbo.insertResetCode", connection);
                    
                }
                else
                {
                    // This is inccorect use of the function, so we return null
                    return null;
                }

                cmd.CommandType= CommandType.StoredProcedure;

                // Add the stored procedure's parameters and excecute it
                cmd.Parameters.AddWithValue("@userID", userID);
                cmd.Parameters.AddWithValue("@code", code);

                // If it's for a password reset, we need to add the expiration to the stored procedure
                if(usage == "Reset")
                {
                    cmd.Parameters.AddWithValue("@expiration", expiry);
                }

                int affectedRows = await cmd.ExecuteNonQueryAsync();
                

                if(affectedRows == 0)
                {
                    // If nothing was affected something went wrong, return null
                    code = null;
                }

                connection.Close();
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }

            return code;
        }

        public async Task<bool> ConfirmAccountAsync(int code,  string userID)
        {
            bool confirmed = false;

            try
            {
                using var connection = GetOpenConnection();

                SqlCommand cmd = new SqlCommand("dbo.checkConfirmationCode", connection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@userID", userID);
                cmd.Parameters.AddWithValue("@confirmationCode", code);
                var returnParameter = cmd.Parameters.Add("@returnVal", SqlDbType.Int);
                returnParameter.Direction = ParameterDirection.ReturnValue;
                await cmd.ExecuteNonQueryAsync();
                int result = (int)returnParameter.Value;

                confirmed = (result == 1);

                connection.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                confirmed = false;
            }

            return confirmed;
        }

        public async Task<bool> ConfirmResetAsync(string code, string userID, string newPassword)
        {
            bool confirmed = false;

            try
            {
                using var connection = GetOpenConnection();

                SqlCommand cmd = new SqlCommand("dbo.checkResetCode", connection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@userID", userID);
                cmd.Parameters.AddWithValue("@resetCode", code);
                var returnParameter = cmd.Parameters.Add("@returnVal", SqlDbType.Int);
                returnParameter.Direction = ParameterDirection.ReturnValue;
                await cmd.ExecuteNonQueryAsync();
                int result = (int)returnParameter.Value;

                Console.WriteLine("We did the check");
                Console.WriteLine("result: " + result);

                if (result != 1)
                {
                    // If the reset code isnt valid, return failure
                    return confirmed;
                }

                SqlCommand setPassword = new SqlCommand("dbo.setUserPassword", connection);
                setPassword.CommandType = CommandType.StoredProcedure;

                setPassword.Parameters.AddWithValue("@userID", userID);
                setPassword.Parameters.AddWithValue("@password", newPassword);

                int rowsAffected = await setPassword.ExecuteNonQueryAsync();

                Console.WriteLine("Rows: " +  rowsAffected);
                Console.WriteLine("password: " + newPassword + " for user: " + userID);

                if (rowsAffected > 0)
                {
                    confirmed = true;
                }

                connection.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                confirmed = false;
            }

            return confirmed;
        }

        public void SendEmail(string recipientEmail, string urlCode, string userID, string usage)
        {
            Console.WriteLine("Sending email");
            try
            {
                string fromEmail = "nbccpharmsystem@gmail.com";
                string fromPassword = "halbwxtsqdduovzf";

                MailMessage message = new MailMessage();

                message.From = new MailAddress(fromEmail);
                message.To.Add(new MailAddress(recipientEmail));

                if (usage  != null && usage == "Confirmation")
                {
                    message.Subject = "Confirmation Email";
                    message.Body = "Please click the link to confirm your account: http://localhost:5173/confirmation/" + urlCode + "/" + userID;
                }
                else if (usage != null && usage == "Reset")
                {
                        message.Subject = "Password Reset Email";
                        message.Body = "Please click the link to reset your password: http://localhost:5173/passwordreset/" + urlCode + "/" + userID;
                }
                else
                {
                    // Incorrect usage of function, just return without sending an email
                    return;
                }

                var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential(fromEmail, fromPassword),
                    EnableSsl = true,
                };

                smtpClient.Send(message);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }

            Console.WriteLine("Email sent");

        }

        //Get all users info (except passwords)
        public async Task<List<usersDTO>> GetAllUsers() 
        { 
        
            List<usersDTO> users = new List<usersDTO>();

            try
            {

                using var connection = GetOpenConnection();

                SqlCommand cmd = new SqlCommand("dbo.getAllUsers", connection);

                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {

                    while (reader.Read())
                    {

                        usersDTO dbUser = new usersDTO();

                        //userID
                        dbUser.ID = reader["userID"].ToString();

                        //fName, lName
                        dbUser.FName = reader["fName"].ToString();
                        dbUser.LName = reader["lName"].ToString();

                        //email
                        dbUser.Email = reader["email"].ToString();

                        //admin
                        bool admin = reader.GetBoolean(reader.GetOrdinal("admin"));
                        if (admin) dbUser.Admin = "Y";
                        else dbUser.Admin = "N";

                        //active
                        bool active = reader.GetBoolean(reader.GetOrdinal("active"));
                        if (active) dbUser.Active = "Y";
                        else dbUser.Active = "N";

                        //campus
                        dbUser.Campus = reader["campus"].ToString();

                        //createdDate
                        dbUser.CreatedDate = reader["createdDate"].ToString();

                        //expirationDate
                        dbUser.ExpirationDate = reader["expirationDate"].ToString();

                        users.Add(dbUser);

                    }

                }

                return users;

            }
            catch (Exception ex)
            {
                users.Clear();
                Console.WriteLine(ex.Message);
                return users;
            }
        }

        public async Task<string> EditUser(editedUserDTO user)
        {

            string result = "Could not edit user.\nPlease see your system administrator.";

            try
            {

                using var connection = GetOpenConnection();

                SqlCommand cmd = new SqlCommand("dbo.updateUser", connection);

                cmd.CommandType = CommandType.StoredProcedure;

                //convert admin/active
                bool active = false;
                bool admin = false;
                if (user.Active == "1") active = true;
                if (user.Admin == "1") admin = true;

                cmd.Parameters.AddWithValue("@userID", user.UserID);
                cmd.Parameters.AddWithValue("@firstName", user.FName);
                cmd.Parameters.AddWithValue("@lastName", user.LName);
                cmd.Parameters.AddWithValue("@admin", admin).SqlDbType = SqlDbType.Bit;
                cmd.Parameters.AddWithValue("@active", active).SqlDbType = SqlDbType.Bit;

                int changed = await cmd.ExecuteNonQueryAsync();

                if (changed > 0) result = "User: " + user.UserID + " has been updated.";

                return result;

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                result = "Could not edit user.\nPlease see your system administrator.";
                return result;
            }

        }

        //delete user 
        public async Task<string> DeleteUser(string userID)
        {

            string result = "Could not delete user. Please contact your system administrator.";

            try
            {

                using var connection = GetOpenConnection();

                SqlCommand cmd = new SqlCommand("dbo.deleteUser", connection);

                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@userID", userID);

                int affected = await cmd.ExecuteNonQueryAsync();

                if (affected > 0) result = "User Successfully Deleted";

                return result;

            }
            catch (Exception ex)
            {
                Console.Write(ex.Message);
                result = "Could not delete user. Please contact your system administrator.";
                return result;
            }
            

        }

        //DRUG METHODS

        public async Task<List<drugsDTO>> GetAllDrugs()
        {
            List<drugsDTO> drugs = new List<drugsDTO>();

            try
            {

                using var connection = GetOpenConnection();

                SqlCommand cmd = new SqlCommand("dbo.getAllDrugs", connection);

                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {

                    while (reader.Read())
                    {

                        drugsDTO dbDrugs = new drugsDTO();

                        dbDrugs.DIN = reader["DIN"].ToString();
                        dbDrugs.Name = reader["drugName"].ToString();
                        dbDrugs.Dosage = reader["dosage"].ToString();
                        dbDrugs.Strength = reader["strength"].ToString();
                        dbDrugs.Manufacturer = reader["manufacturer"].ToString();
                        dbDrugs.Concentration = reader["concentration"].ToString();
                        dbDrugs.ReferenceBrand = reader["referenceBrand"].ToString();
                        dbDrugs.ContainerSize = reader["containerSize"].ToString();

                        drugs.Add(dbDrugs);

                    }

                }

                return drugs;

            }
            catch (Exception ex)
            {
                drugs.Clear();
                Console.WriteLine("oh no" + ex.Message);
                return drugs;
            }
        }

        public async Task<string> AddDrugAsync(drugsDTO drug)
        {
            string result = "Drug not added";

            try
            {

                using var connection = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.insertDrug", connection);

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@DIN", drug.DIN);
                cmd.Parameters.AddWithValue("@name", drug.Name);
                cmd.Parameters.AddWithValue("@dosage", drug.Dosage);
                cmd.Parameters.AddWithValue("@strength", drug.Strength);
                cmd.Parameters.AddWithValue("@manufacturer", drug.Manufacturer);
                cmd.Parameters.AddWithValue("@concentration", drug.Concentration);
                cmd.Parameters.AddWithValue("@referenceBrand", drug.ReferenceBrand);
                cmd.Parameters.AddWithValue("@containerSize", drug.ContainerSize);

                int changed = await cmd.ExecuteNonQueryAsync();

                if (changed > 0)
                {
                    result = "Drug added";
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                result = ex.Message;
            }

            return result;
        }

        public async Task<string> DeleteDrugAsync(string DIN)
        {
            string result = "Drug not deleted";

            try
            {
                // Delete the drug
                using var connection = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.deleteDrug", connection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@DIN", DIN);

                int changed = await cmd.ExecuteNonQueryAsync();

                if (changed > 0)
                {
                    result = "Drug Deleted";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                result = ex.Message;
            }

            return result;

        }

        public async Task<string> EditDrugAsync(drugsDTO drug)
        {
            string result = "Drug not edited";

            try
            {

                using var connection = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.updateDrug", connection);

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@DIN", drug.DIN);
                cmd.Parameters.AddWithValue("@name", drug.Name);
                cmd.Parameters.AddWithValue("@dosage", drug.Dosage);
                cmd.Parameters.AddWithValue("@strength", drug.Strength);
                cmd.Parameters.AddWithValue("@manufacturer", drug.Manufacturer);
                cmd.Parameters.AddWithValue("@concentration", drug.Concentration);
                cmd.Parameters.AddWithValue("@referenceBrand", drug.ReferenceBrand);
                cmd.Parameters.AddWithValue("@containerSize", drug.ContainerSize);


                int changed = await cmd.ExecuteNonQueryAsync();

                if (changed > 0)
                {
                    result = "Drug updated";
                }
            }
            catch (Exception ex)
            {
                return result + ": " + ex.Message;
            }

            return result;
        }


        //PATIENT METHODS
        public async Task<List<patientsDTO>> GetAllPatients()
        {
            List<patientsDTO> patients = new List<patientsDTO>();

            try
            {

                using var connection = GetOpenConnection();

                SqlCommand cmd = new SqlCommand("dbo.getAllPatients", connection);

                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {

                    while (reader.Read())
                    {

                        patientsDTO dbPatients = new patientsDTO();

                        dbPatients.PPR = reader["PPR"].ToString();

                        dbPatients.FName = reader["fName"].ToString();
                        dbPatients.LName = reader["lName"].ToString();
                        dbPatients.DOB = reader["DOB"].ToString();
                        dbPatients.Sex = reader["sex"].ToString();
                        dbPatients.Address = reader["address"].ToString();
                        dbPatients.City = reader["city"].ToString();
                        dbPatients.HospitalName = reader["hospitalName"].ToString();
                        dbPatients.RoomNumber = reader["roomNumber"].ToString();
                        dbPatients.UnitNumber = reader["unitNumber"].ToString();
                        dbPatients.Allergies = reader["allergies"].ToString();
                        dbPatients.Conditions = reader["conditions"].ToString();

                        patients.Add(dbPatients);

                    }

                }

                return patients;

            }
            catch (Exception ex)
            {
                patients.Clear();
                Console.WriteLine("oh no" + ex.Message);
                return patients;
            }
        }

        public async Task<string> AddPatientAsync(patientsDTO patient)
        {
            string result = "Patient not added";

            try
            {

                using var connection = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.insertPatient", connection);

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@firstname", patient.FName);
                cmd.Parameters.AddWithValue("@lastname", patient.LName);
                cmd.Parameters.AddWithValue("@dob", patient.DOB);
                cmd.Parameters.AddWithValue("@sex", patient.Sex);
                cmd.Parameters.AddWithValue("@address", patient.Address);
                cmd.Parameters.AddWithValue("@city", patient.City);
                cmd.Parameters.AddWithValue("@hospitalName", patient.HospitalName);
                cmd.Parameters.AddWithValue("@roomNumber", patient.RoomNumber);
                cmd.Parameters.AddWithValue("@unitNumber", patient.UnitNumber);
                cmd.Parameters.AddWithValue("@allergies", patient.Allergies);
                cmd.Parameters.AddWithValue("@conditions", patient.Conditions);

                Console.WriteLine("Command created");

                int changed = await cmd.ExecuteNonQueryAsync();

                Console.WriteLine("Command run: " +  changed);

                if (changed > 0)
                {
                    result = "Patient added";
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                result = ex.Message;
            }

            return result;
        }

        public async Task<string> DeletePatientAsync(string ppr)
        {
            string result = "Patient not deleted";

            try
            {
                // Delete the patient
                using var connection = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.deletePatient", connection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@PPR", ppr);

                int changed = await cmd.ExecuteNonQueryAsync();

                if (changed > 0)
                {
                    result = "Patient Deleted";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                result = ex.Message;
            }

            return result;

        }

        public async Task<string> EditPatientAsync(patientsDTO patient)
        {
            string result = "Patient not edited";

            try
            {

                using var connection = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.updatePatient", connection);

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@PPR", patient.PPR);
                cmd.Parameters.AddWithValue("@firstName", patient.FName);
                cmd.Parameters.AddWithValue("@lastName", patient.LName);
                cmd.Parameters.AddWithValue("@dob", patient.DOB);
                cmd.Parameters.AddWithValue("@sex", patient.Sex);
                cmd.Parameters.AddWithValue("@address", patient.Address);
                cmd.Parameters.AddWithValue("@city", patient.City);
                cmd.Parameters.AddWithValue("@hospitalName", patient.HospitalName);
                cmd.Parameters.AddWithValue("@roomNumber", patient.RoomNumber);
                cmd.Parameters.AddWithValue("@unitNumber", patient.UnitNumber);
                cmd.Parameters.AddWithValue("@allergies", patient.Allergies);
                cmd.Parameters.AddWithValue("@conditions", patient.Conditions);

                int changed = await cmd.ExecuteNonQueryAsync();

                if (changed > 0)
                {
                    result = "Patient updated";
                }
            }
            catch(Exception ex)
            {
                return result + ": " + ex.Message;
            }

            return result;
        }

        //PHYSICIAN METHODS

        public async Task<List<physiciansDTO>> GetAllPhysicians()
        {
            List<physiciansDTO> physicians = new List<physiciansDTO>();

            try
            {

                using var connection = GetOpenConnection();

                SqlCommand cmd = new SqlCommand("dbo.getAllPhysicians", connection);

                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {

                    while (reader.Read())
                    {

                        physiciansDTO dbPhysicians = new physiciansDTO();

                        dbPhysicians.PhysicianID = reader["physicianID"].ToString();
                        dbPhysicians.FName = reader["fName"].ToString();
                        dbPhysicians.LName = reader["lName"].ToString();
                        dbPhysicians.City = reader["city"].ToString();
                        dbPhysicians.Province = reader["province"].ToString();

                        physicians.Add(dbPhysicians);

                    }

                }

                return physicians;

            }
            catch (Exception ex)
            {
                physicians.Clear();
                Console.WriteLine("oh no" + ex.Message);
                return physicians;
            }
        }

        public async Task<string> AddPhysicianAsync(physiciansDTO physician)
        {
            string result = "Physician not added";

            try
            {

                using var connection = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.insertPhysician", connection);

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@firstname", physician.FName);
                cmd.Parameters.AddWithValue("@lastname", physician.LName);
                cmd.Parameters.AddWithValue("@city", physician.City);
                cmd.Parameters.AddWithValue("@province", physician.Province);

                Console.WriteLine("Command created");

                int changed = await cmd.ExecuteNonQueryAsync();

                Console.WriteLine("Command run: " + changed);

                if (changed > 0)
                {
                    result = "Physician added";
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                result = ex.Message;
            }

            return result;
        }

        public async Task<string> DeletePhysicianAsync(string physicianID)
        {
            string result = "Physician not deleted";

            try
            {
                // Delete the physician
                using var connection = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.deletePhysician", connection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@physicianID", physicianID);

                int changed = await cmd.ExecuteNonQueryAsync();

                if (changed > 0)
                {
                    result = "Physician Deleted";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                result = ex.Message;
            }

            return result;

        }

        public async Task<string> EditPhysicianAsync(physiciansDTO physician)
        {
            string result = "Physician not edited";

            try
            {

                using var connection = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.updatePhysician", connection);

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@physicianID", physician.PhysicianID);
                cmd.Parameters.AddWithValue("@firstName", physician.FName);
                cmd.Parameters.AddWithValue("@lastName", physician.LName);
                cmd.Parameters.AddWithValue("@city", physician.City);
                cmd.Parameters.AddWithValue("@province", physician.Province);


                int changed = await cmd.ExecuteNonQueryAsync();

                if (changed > 0)
                {
                    result = "Physician updated";
                }
            }
            catch (Exception ex)
            {
                return result + ": " + ex.Message;
            }

            return result;
        }

        //ORDER METHODS

        public async Task<List<ordersDTO>> GetAllOrders()
        {
            List<ordersDTO> orders = new List<ordersDTO>();

            try
            {

                using var connection = GetOpenConnection();

                SqlCommand cmd = new SqlCommand("dbo.getAllOrders", connection);

                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {

                    while (reader.Read())
                    {

                        ordersDTO dbOrders = new ordersDTO();

                        dbOrders.RxNum = reader["rxNum"].ToString();
                        dbOrders.PPR = reader["PPR"].ToString();
                        dbOrders.DIN = reader["DIN"].ToString();
                        dbOrders.PhysicianID = reader["physicianID"].ToString();
                        dbOrders.Status = reader["status"].ToString();
                        dbOrders.Initiator = reader["initiator"].ToString();
                        dbOrders.Verifier = reader["verifier"].ToString();
                        dbOrders.DateSubmitted = reader["dateSubmitted"].ToString();
                        dbOrders.DateLastChanged = reader["dateLastChanged"].ToString();
                        dbOrders.DateVerified = reader["dateVerified"].ToString();
                        dbOrders.SIG = reader["SIG"].ToString();
                        dbOrders.SIGDescription = reader["SIGDescription"].ToString();
                        dbOrders.Form = reader["form"].ToString();
                        dbOrders.Route = reader["route"].ToString();
                        dbOrders.PrescribedDose = reader["prescribedDose"].ToString();
                        dbOrders.Frequency = reader["frequency"].ToString();
                        dbOrders.Duration = reader["duration"].ToString();
                        dbOrders.Quantity = reader["quantity"].ToString();
                        dbOrders.StartDate = reader["startDate"].ToString();
                        dbOrders.StartTime = reader["startTime"].ToString();
                        dbOrders.Comments = reader["comments"].ToString();

                        orders.Add(dbOrders);

                    }

                }

                return orders;

            }
            catch (Exception ex)
            {
                orders.Clear();
                Console.WriteLine("oh no" + ex.Message);
                return orders;
            }
        }

        public async Task<bool> ChangeOrderStatus(orderStatusChangeDTO order)
        {
            bool success = false;

            try
            {
                using var connection = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.setOrderStatus", connection);

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@rxNum", int.Parse(order.RxNum));
                cmd.Parameters.AddWithValue("@status", order.Status);
                cmd.Parameters.AddWithValue("@userID", order.UserID);

                int changed = await cmd.ExecuteNonQueryAsync();

                if (changed > 0)
                {
                    success = true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return false;
            }

            return success;
        }

        //add order
        public async Task<bool> AddOrder (addOrderDTO order)
        {
            bool success = false;

            try
            {
                using var connection = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.insertOrder", connection);

                //add parameters
                cmd.Parameters.AddWithValue("@PPR", int.Parse(order.PPR)); //int    
                cmd.Parameters.AddWithValue("@DIN", order.DIN);
                cmd.Parameters.AddWithValue("@physicianID", order.PhysicianID);
                cmd.Parameters.AddWithValue("@initiator", order.Initiator);
                cmd.Parameters.AddWithValue("@SIG", order.SIG);
                cmd.Parameters.AddWithValue("@SIGDescription", order.SIGDescription);
                cmd.Parameters.AddWithValue("@form", order.Form);
                cmd.Parameters.AddWithValue("@route", order.Route);
                cmd.Parameters.AddWithValue("@prescribedDose", order.Dose);
                cmd.Parameters.AddWithValue("@frequency", order.Frequency);
                cmd.Parameters.AddWithValue("@duration", order.Duration);
                cmd.Parameters.AddWithValue("@quantity", order.Quantity);
                cmd.Parameters.AddWithValue("@startDate", DateTime.Parse(order.StartDate)); //date
                cmd.Parameters.AddWithValue("@startTime", order.StartTime);
                cmd.Parameters.AddWithValue("@comments", order.Comments);
                cmd.Parameters.AddWithValue("@imagePath", "Test");


                cmd.CommandType = CommandType.StoredProcedure;

                //insert
                int added = await cmd.ExecuteNonQueryAsync();

                if (added > 0) success = true;

                return success;

            }
            catch (SqlException sqlEx)
            {
                // SQL Server related exception, handle accordingly
                foreach (SqlError error in sqlEx.Errors)
                {
                    Console.WriteLine($"Error Number: {error.Number}, Message: {error.Message}");
                }

                success = false;
                return success;
            }
            catch (Exception ex)
            {
                // Handle other exceptions
                Console.WriteLine(ex.Message);
                success = false;
                return success;
            }

        }

        //LOG METHODS


        public async Task<List<logsDTO>> GetSpecifiedLogs(string startdate, string? enddate)
        {
            List<logsDTO> logs = new List<logsDTO>();

            try
            {

                using var connection = GetOpenConnection();

                SqlCommand cmd = new SqlCommand("dbo.getLogs", connection);

                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@startDate", startdate);

                // If there is an end date specified, add that
                if (enddate != null)
                {
                    cmd.Parameters.AddWithValue("@endDate", enddate);
                }

                using (var reader = await cmd.ExecuteReaderAsync())
                {

                    while (reader.Read())
                    {

                        logsDTO dbLogs = new logsDTO();

                        dbLogs.LogID = reader["logID"].ToString();
                        dbLogs.ActorID = reader["actorID"].ToString();
                        dbLogs.AffectedOrder = reader["affectedOrder"].ToString();
                        dbLogs.ActionLogged = reader["actionLogged"].ToString();
                        dbLogs.TimeLogged = reader["timeLogged"].ToString();

                        logs.Add(dbLogs);

                    }

                }

                return logs;

            }
            catch (Exception ex)
            {
                logs.Clear();
                Console.WriteLine("oh no" + ex.Message);
                return logs;
            }
        }


    }
}
