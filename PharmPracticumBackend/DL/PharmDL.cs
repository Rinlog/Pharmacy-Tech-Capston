﻿using System.Data;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System.Net.Mail;
using System.Net;
using PharmPracticumBackend.DTO;
using System.Numerics;
using Microsoft.Extensions.Configuration.UserSecrets;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;
using System.ComponentModel;
using System.Globalization;


namespace PharmPracticumBackend.DL
{
    public class PharmDL
    {

        //private readonly IConfiguration _configuration;

        private readonly string _connectionString;
        private readonly IConfiguration _configuration;

        public PharmDL(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnectionRemoteServer");
            _configuration = configuration;
        }

        //Opens connection
        private SqlConnection GetOpenConnection()
        {

            var connection = new SqlConnection(_connectionString);
            if (connection.State != ConnectionState.Open)
            {
                connection.Open();
            }
            return connection;
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


                //if this returns a valid userID, check if expired, active, etc
                if (userID != "")
                {

                    //check if account is expired
                    usersDTO userInfo = this.getUserbyID(userID);
                    if (userInfo.ExpirationDate != "")
                    {
                        DateTime expirationDate = DateTime.ParseExact(userInfo.ExpirationDate, "G", CultureInfo.CreateSpecificCulture("en-CA"));
                        DateTime CurrentDate = DateTime.Now;
                        if (CurrentDate > expirationDate) //checks if account is expired
                        {
                            user.UserId = "expired";
                            return user;
                        }
                    }
                    //check if account deleted
                    if (userInfo.Removed == true)
                    {
                        user.UserId = "account removed";
                        return user;
                    }
                    //check if user is active
                    //if not, return
                    bool active = await IsUserActive(userID);
                    if (!active)
                    {
                        user.UserId = "account inactive";
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
                                user.UserId = "password error";
                                return user;
                            }
                            
                            //if we do, run the check
                                PasswordHasher<object> hasher = new PasswordHasher<object>();

                                PasswordVerificationResult verified = hasher.VerifyHashedPassword(null, dbHash, pass);

                                Console.WriteLine("Is my password ok: " + verified);


                                switch (verified)
                                {

                                    case PasswordVerificationResult.Success:
                                        //pull info
                                        user = await GetLoginInfoAsync(userID);

                                        //return user info we need (email, id, admin)
                                        return user;
                                    case PasswordVerificationResult.Failed:
                                        user.UserId = "";
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
                // This list will need to be updated AS WELL AS the list in the insertUser stored procedure in the DB, and also front end to let user know (bulk add users page)
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
        public usersDTO getUserbyID(String id)
        {
            usersDTO usersDTO = new usersDTO();
            try
            {
                using var conn = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.GetUserInfo",conn);
                cmd.Parameters.AddWithValue("@userID", id);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read()) {
                    usersDTO.Admin = reader["admin"].ToString();
                    usersDTO.FName = reader["fName"].ToString();
                    usersDTO.LName = reader["lName"].ToString();
                    usersDTO.Email = reader["email"].ToString();
                    usersDTO.Removed = (bool)reader["removed"];
                    usersDTO.Active = reader["active"].ToString();
                    usersDTO.Campus = reader["campus"].ToString();
                    usersDTO.CreatedDate = reader["createdDate"].ToString();
                    usersDTO.ExpirationDate = reader["expirationDate"].ToString();
                }
            }
            catch (Exception ex) {
                Console.WriteLine(ex.Message);
            }
            return usersDTO;
        }
        //auth a user

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
                    else if (signRes.Contains("Invalid Campus"))
                    {
                        user.InsertResult = "Invalid Campus for " + user.Email;
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
                    if (_configuration.GetSection("Environment")["Status"] == "Development")
                    {
                        message.Body = "Please click the link to confirm your account: http://localhost:5173/confirmation/" + urlCode + "/" + userID;
                    }
                    else if (_configuration.GetSection("Environment")["Status"] == "Deployed")
                    {
                        String FrontendIP = _configuration.GetSection("DeployedSettings")["FrontendIP"];
                        String FrontendPort = _configuration.GetSection("DeployedSettings")["FrontendPort"];
                        message.Body = "Please click the link to confirm your account: https://" + FrontendIP + ":" + FrontendPort + "/confirmation/" + urlCode + "/" + userID;
                    }
                }
                else if (usage != null && usage == "Reset")
                {
                        message.Subject = "Password Reset Email";
                    if (_configuration.GetSection("Environment")["Status"] == "Development")
                    {
                        message.Body = "Please click the link to confirm your account: http://localhost:5173/passwordreset/" + urlCode + "/" + userID;
                    }
                    else if (_configuration.GetSection("Environment")["Status"] == "Deployed")
                    {
                        String FrontendIP = _configuration.GetSection("DeployedSettings")["FrontendIP"];
                        String FrontendPort = _configuration.GetSection("DeployedSettings")["FrontendPort"];
                        message.Body = "Please click the link to confirm your account: https://"+FrontendIP+":"+FrontendPort+"/passwordreset/" + urlCode + "/" + userID;
                    }
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

                        dbUser.Removed = (bool)reader["removed"];

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
        public drugsDTO GetDrugByID(String DIN)
        {
            drugsDTO drugsDTO = new drugsDTO();
            try
            {
                using var conn = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.getDrugInfo",conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@DIN",DIN);

                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    drugsDTO.DIN = reader["DIN"].ToString();
                    drugsDTO.Name = reader["drugName"].ToString();
                    drugsDTO.Dosage = reader["dosage"].ToString();
                    drugsDTO.Strength = reader["strength"].ToString();
                    drugsDTO.Manufacturer = reader["manufacturer"].ToString();
                    drugsDTO.Concentration = reader["concentration"].ToString();
                    drugsDTO.ReferenceBrand = reader["referenceBrand"].ToString();
                    drugsDTO.ContainerSize = reader["containerSize"].ToString();
                }
            }
            catch (Exception ex)
            {
                drugsDTO.DIN = null;
                Console.WriteLine(ex.Message);
            }
            return drugsDTO;
        }
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

        public async Task<string> DeleteDrugAsync(List<string> DINs)
        {

            if (DINs == null || DINs.Count == 0)
            {
                return "No drugs were sent for deleting";
            }

            try
            {
                using var connection = GetOpenConnection();

                foreach (var DIN in DINs)
                {
                   
                    SqlCommand cmd = new SqlCommand("dbo.deleteDrug", connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@DIN", DIN);

                    await cmd.ExecuteNonQueryAsync();

                    cmd.Parameters.Clear();
                }
                
                return "Drugs Deleted successfully";
                
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString()); //debugging
                return ex.Message;
            }
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
        public patientsDTO GetPatientbyID(String PPR)
        {
            patientsDTO patient = new patientsDTO();
            try
            {
                using var conn = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.getPatientInfo", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@PPR", PPR);

                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    patient.PPR = reader["PPR"].ToString();
                    patient.FName = reader["fName"].ToString();
                    patient.LName = reader["lName"].ToString();
                    patient.DOB = reader["DOB"].ToString();
                    patient.Sex = reader["sex"].ToString();
                    patient.Address = reader["address"].ToString();
                    patient.City = reader["city"].ToString();
                    patient.HospitalName = reader["hospitalName"].ToString();
                    patient.RoomNumber = reader["roomNumber"].ToString();
                    patient.UnitNumber = reader["unitNumber"].ToString();
                    patient.Allergies = reader["allergies"].ToString();
                    patient.Conditions = reader["conditions"].ToString();
                }

            }
            catch (Exception ex)
            {
                patient.PPR = null;
                Console.WriteLine(ex.Message);
            }
            return patient;
        }
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

        public async Task<string> DeletePatientsAsync(string pprs)
        {
            string result = "Patients not deleted";

            try
            {
                // Delete the patient
                using var connection = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.deletePatients", connection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@PPR", pprs);

                int changed = await cmd.ExecuteNonQueryAsync();

                if (changed == 1)
                {
                    result = "Patient Deleted";
                }
                else if (changed > 1)
                {
                    result = "Patients Deleted";
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

        public async Task<string> DeletePhysicianAsync(List<string> physicianIDs)
        {
            if (physicianIDs == null || physicianIDs.Count == 0)
            {
                return "No physicians were sent for deleting";
            }
            
            try
            {
                using var connection = GetOpenConnection();

                foreach (var ID in physicianIDs)
                {
                    SqlCommand cmd = new SqlCommand("dbo.deletephysician", connection);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@physicianID", ID);

                    await cmd.ExecuteNonQueryAsync();

                    cmd.Parameters.Clear();
                }
                return "Physicians Deleted Successfully";
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString()); //debugging
                return ex.Message;
            }

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
        public bool UpdateOrderImagePathByID(String RxNum, String Path)
        {
            bool result = false;
            try
            {
                using var conn = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.UpdateOrderImagePath",conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@rxNum",RxNum);
                cmd.Parameters.AddWithValue("@path",Path);

                result = (cmd.ExecuteNonQuery() == 1);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return result;
        }
        public ImageDTO GetOrderImageByID(String RxNum)
        {
            ImageDTO imageDTO = new ImageDTO();
            try
            {
                using var conn = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.GetOrderImageByID", conn);
                cmd.CommandType= CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@rxNum",RxNum);

                SqlDataReader reader = cmd.ExecuteReader();
                //should only give back one row
                while (reader.Read())
                {
                    return new ImageDTO()
                    {
                        imageID = reader[0].ToString(),
                        rxNum = reader[1].ToString(),
                        imagePath = reader[2].ToString()
                    };

                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return imageDTO;
        }
        public List<ImageDTO> GetAllOrderImages()
        {
            List<ImageDTO> images = new List<ImageDTO>();
            try
            {
                using var conn = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.GetAllOrderImages", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    images.Add(new ImageDTO()
                    {
                        imageID = reader[0].ToString(),
                        rxNum = reader[1].ToString(),
                        imagePath = reader[2].ToString()
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return images;
        }
        public ordersDTO GetOrderByID(String RxNum)
        {
            ordersDTO dbOrders = new ordersDTO();
            try
            {
                using var conn = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.GetOrderInfo",conn);
                cmd.CommandType= CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@rxNum", RxNum);
                
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
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
                    dbOrders.PrintStatusID = reader["PrintStatusID"].ToString();
                    dbOrders.Comments = reader["comments"].ToString();
                }
            }
            catch (Exception ex)
            {
                dbOrders.RxNum = null;
                Console.WriteLine("This is an error message: "+ex);
            }
            return dbOrders;
        }
        public List<ordersDTO> getOrdersVerifiedByUser(String UserID)
        {
            List<ordersDTO> orders = new List<ordersDTO>();

            try
            {

                using var connection = GetOpenConnection();

                SqlCommand cmd = new SqlCommand("dbo.getOrdersVerifiedByUser", connection);
                cmd.Parameters.AddWithValue("@userID", UserID);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = cmd.ExecuteReader())
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
                        dbOrders.PrintStatusID = reader["PrintStatusID"].ToString();
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
                        dbOrders.PrintStatusID = reader["PrintStatusID"].ToString();
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
                cmd.Parameters.AddWithValue("@imagePath", order.OrderImage);


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

        //get user-specific orders
        public async Task<List<ordersDTO>> GetMyOrders(string user)
        {

            List<ordersDTO> orders = new List<ordersDTO>();

            try
            {

                using var connection = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.getMyOrders", connection);

                //add parameters
                cmd.Parameters.AddWithValue("@userId", user);

                cmd.CommandType = CommandType.StoredProcedure;

                //query
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
                        dbOrders.PrintStatusID = reader["PrintStatusID"].ToString();
                        dbOrders.Comments = reader["comments"].ToString();

                        orders.Add(dbOrders);

                    }

                }

                return orders;


            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                orders.Clear();
                return orders;
            }

        }

        //Amend order
        public async Task<bool> AmendOrder (ordersDTO order)
        {

            bool result = false;

            try
            {

                using var connection = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.amendOrder", connection);

                //add parameters
                cmd.Parameters.AddWithValue("@userID", order.Initiator);
                cmd.Parameters.AddWithValue("@rxNum", int.Parse(order.RxNum));
                cmd.Parameters.AddWithValue("@PPR", int.Parse(order.PPR));
                cmd.Parameters.AddWithValue("@DIN", order.DIN);
                cmd.Parameters.AddWithValue("@physicianID", order.PhysicianID);
                cmd.Parameters.AddWithValue("@SIG", order.SIG);
                cmd.Parameters.AddWithValue("@SIGDescription", order.SIGDescription);
                cmd.Parameters.AddWithValue("@form", order.Form);
                cmd.Parameters.AddWithValue("@route", order.Route);
                cmd.Parameters.AddWithValue("@prescribedDose", order.PrescribedDose);
                cmd.Parameters.AddWithValue("@frequency", order.Frequency);
                cmd.Parameters.AddWithValue("@duration", order.Duration);
                cmd.Parameters.AddWithValue("@quantity", order.Quantity);
                cmd.Parameters.AddWithValue("@startDate", DateTime.Parse(order.StartDate)); //date
                cmd.Parameters.AddWithValue("@startTime", order.StartTime);
                cmd.Parameters.AddWithValue("@comments", order.Comments);
                cmd.Parameters.AddWithValue("@imagePath", order.OrderImage);

                cmd.CommandType = CommandType.StoredProcedure;

                int rows = await cmd.ExecuteNonQueryAsync();

                if (rows > 0) result = true;

                return result;

            }
            catch (Exception ex)
            {
                result = false;
                return result;
            }


        }
        public bool updateOrderPrintStatus(String OrderID, String PrintStatus)
        {
            try
            {
                using var conn = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.updateOrderPrintStatus", conn);
                cmd.Parameters.AddWithValue("@orderID", OrderID);
                cmd.Parameters.AddWithValue("@statusID", PrintStatus);
                cmd.CommandType = CommandType.StoredProcedure;

                bool result = cmd.ExecuteNonQuery() == 1;
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return false;
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

        //SIG related procedures

        public List<SIGDTO> getAllSIGS()
        {
            List<SIGDTO> SIGDTOs = new List<SIGDTO>();

            try
            {
                using var conn = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.getAllSIGS", conn);

                cmd.CommandType = CommandType.StoredProcedure;
                
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    SIGDTO sigDTO = new SIGDTO();

                    sigDTO.abbreviation = reader["abbreviation"].ToString();
                    sigDTO.description = reader["description"].ToString();

                    SIGDTOs.Add(sigDTO);

                }
                return SIGDTOs;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            return SIGDTOs;
        }


        //Notification related procedures

        public List<NotificationDTO> getNotifications(String UserID,int StartingRow)
        {
            List <NotificationDTO> notifications = new List<NotificationDTO>();

            try
            {
                using var conn = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.GetNotifications", conn);
                cmd.CommandType= CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserID", UserID);
                cmd.Parameters.AddWithValue("@StartingRow", StartingRow);
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    notifications.Add(new NotificationDTO()
                    {
                        NotificationID = reader["NotificationID"].ToString(),
                        NMessage = reader["NMessage"].ToString(),
                        Recipient = reader["Recipient"].ToString(),
                        Seen = (bool)reader["Seen"],
                        DateAdded = reader["DateAdded"].ToString()
                    });
                }
                return notifications;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);
            }
            return notifications;

        }

        public bool addNotification(String Message, String UserID)
        {
            bool result = false;

            try
            {
                using var conn = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.AddNotification", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Message", Message);
                cmd.Parameters.AddWithValue("@Recipient", UserID);
                result = cmd.ExecuteNonQuery() == 1; 
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            return result;

        }

        public bool updateNotificationStatus(String NotificationID, bool status)
        {
            bool result = false;

            try
            {
                using var conn = GetOpenConnection();
                SqlCommand cmd = new SqlCommand("dbo.UpdateSeenStatus", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@NotificationID", NotificationID);
                cmd.Parameters.AddWithValue("@Status", status);
                result = cmd.ExecuteNonQuery() == 1;
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            return result;

        }
    }
}
