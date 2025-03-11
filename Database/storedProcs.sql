-- Pharmacy Tech Database Stored Procedures
    -- This file contains all the stored procedures for the Pharmacy Tech Database
    -- And is designed to be able to be run all at once to create all the procedures if needed

use pharmtechDB;
-- Drop the procedures if they exist

    -- Inserts
    DROP PROCEDURE IF EXISTS insertUser; 
    DROP PROCEDURE IF EXISTS insertPatient; 
    DROP PROCEDURE IF EXISTS insertPhysician; 
    DROP PROCEDURE IF EXISTS insertDrug; 
    DROP PROCEDURE IF EXISTS insertOrder; 
    DROP PROCEDURE IF EXISTS insertLabel; 
    DROP PROCEDURE IF EXISTS insertConfirmationCode; 
    DROP PROCEDURE IF EXISTS insertResetCode; 
    DROP PROCEDURE IF EXISTS AddNotification;

    -- Setters (Single Column Updates)
    DROP PROCEDURE IF EXISTS setUserActiveStatus; 
    DROP PROCEDURE IF EXISTS setUserPassword; 
    DROP PROCEDURE IF EXISTS setOrderStatus; 
    DROP PROCEDURE IF EXISTS setOrderImage; 
    DROP PROCEDURE IF EXISTS updateOrderPrintStatus;
    DROP PROCEDURE IF EXISTS UpdateSeenStatus;
    DROP PROCEDURE IF EXISTS UpdateOrderImagePath;
    -- Updates (Whole Row Updates)
    DROP PROCEDURE IF EXISTS updateUser; 
    DROP PROCEDURE IF EXISTS updatePatient; 
    DROP PROCEDURE IF EXISTS updatePhysician; 
    DROP PROCEDURE IF EXISTS updateDrug; 

    -- Checks (Boolean / Simple)
    DROP PROCEDURE IF EXISTS isEmailInUse; 
    DROP PROCEDURE IF EXISTS isUserAdmin; 
    DROP PROCEDURE IF EXISTS isUserActive; 

    -- Checks (Complex)
    DROP PROCEDURE IF EXISTS checkForPass;
    DROP PROCEDURE IF EXISTS checkPassword; 
    DROP PROCEDURE IF EXISTS checkConfirmationCode; 
    DROP PROCEDURE IF EXISTS checkResetCode; 

    -- Deletes
    DROP PROCEDURE IF EXISTS deleteUser; 
    DROP PROCEDURE IF EXISTS deletePatients; 
    DROP PROCEDURE IF EXISTS deletePhysician; 
    DROP PROCEDURE IF EXISTS deleteDrug; 
    DROP PROCEDURE IF EXISTS deleteOrder; 

    -- Retrievals (Single Column)
    DROP PROCEDURE IF EXISTS getIDByEmail; 
    DROP PROCEDURE IF EXISTS getEmailByID; 
    DROP PROCEDURE IF EXISTS getImagePathByOrderID; 
    DROP PROCEDURE IF EXISTS GetOrderImageByID;
    -- Retrievals (Whole Row)
    DROP PROCEDURE IF EXISTS getUserInfo; 
    DROP PROCEDURE IF EXISTS getPatientInfo; 
    DROP PROCEDURE IF EXISTS getPhysicianInfo; 
    DROP PROCEDURE IF EXISTS getDrugInfo; 
    DROP PROCEDURE IF EXISTS getOrderInfo; 
    DROP PROCEDURE IF EXISTS getLabelInfo; 
    DROP PROCEDURE IF EXISTS GetAllOrderImages

    -- Retrievals (Whole Table)
    DROP PROCEDURE IF EXISTS getAllUsers; 
    DROP PROCEDURE IF EXISTS getAllPatients; 
    DROP PROCEDURE IF EXISTS getAllPhysicians; 
    DROP PROCEDURE IF EXISTS getAllDrugs; 
    DROP PROCEDURE IF EXISTS getAllOrders; 
    DROP PROCEDURE IF EXISTS getAllLogs; 
    DROP PROCEDURE IF EXISTS getAllSIGS
    DROP PROCEDURE IF EXISTS getOrdersVerifiedByUser;
    DROP PROCEDURE IF EXISTS GetNotifications;
    -- Specific Procedures
    DROP PROCEDURE IF EXISTS getLogs; 
    DROP PROCEDURE IF EXISTS amendOrder; 
    DROP PROCEDURE IF EXISTS getNames;
    -- DROP PROCEDURE IF EXISTS generateLog;
    DROP PROCEDURE IF EXISTS getMyOrders;
GO

-- Create the procedures

-- Inserts
    CREATE PROCEDURE insertUser
        -- Procedure: insertUser
        -- Purpose: Insert a new user into the database after finding the next available unique userID
        -- Parameters:
        --      @firstName - the first name of the user
        --      @lastName - the last name of the user
        --      @email - the email of the user
        --      @password - the password of the user
        --      @admin - whether the user is an admin or not (0 for false, 1 for true)
        --      @campus - the campus the user is associated with
        -- Returns: None
        -- Notes: None
        @firstname varchar(255),
        @lastname varchar(255),
        @email varchar(255),
        @password varchar(255) = NULL,
        @admin bit,
        @campus varchar(255)
        AS

        BEGIN
            -- Declare some variables
            DECLARE @potentialID char(6) = 'CCFL00';    -- This will be the ID we try to assign to the user 
                                                        --(CC = Campus, FL = First and Last initials, 00 = Number)
            DECLARE @userInitials char(2) = LEFT(@firstname, 1) + LEFT(@lastname, 1);
            DECLARE @locationCode char(2);
            DECLARE @IDExists bit = 1; -- Assume the ID exists until we find one that doesn't (1 = true, 0 = false)
            DECLARE @userNumber int = 0; -- This will be cast to a string as a 2 digit number
            DECLARE @expiryDate date; -- If the user is an admin, they will not have an expiration date and set to NULL

            -- Get the location code for the campus
            SET @locationCode = CASE @campus
                WHEN 'Fredericton' THEN 'FR'
                WHEN 'St. John' THEN 'SJ'
                WHEN 'Moncton' THEN 'MO'
                WHEN 'St. Andrews' THEN 'SA'
                WHEN 'Miramichi' THEN 'MI'
                WHEN 'Woodstock' THEN 'WO'
                ELSE 'XX' -- These campuses should be enough but just in case we have a fallback so nothing breaks
                -- This case statement will need to be updated if there are ever campuses other than these
                -- We would just add something like
                -- WHEN 'CampusName' THEN 'CN' for any additional campuses, ideally with unique 2 letter codes

                --                      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  IMPORTANT  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                -- This list will need to be updated AS WELL AS the list in the Signup function in the UserController.cs file in the API
                -- If there is a mismatch it will not work as intended, either not accepting valid campuses (according to the DB)
                -- Or the back-end accepting campuses whose codes will be set to XX in the user ID
            END;

            -- Build a potential ID
            SET @potentialID = STUFF(@potentialID, 1, 2, @locationCode);    -- CCXXXX
            SET @potentialID = STUFF(@potentialID, 3, 2, @userInitials);    -- CCFLXX
                -- The number portion is already set to 00                  -- CCFL00
            
            -- Find the next available number for the userID
            WHILE @IDExists = 1 AND @userNumber < 100
            BEGIN
                -- Build the potential ID with the new number and check if it exists already
                SET @potentialID = STUFF(@potentialID, 5, 2, RIGHT('0' + CAST(@userNumber AS varchar(2)), 2));
                SET @IDExists = (SELECT COUNT(*) FROM UserTable WHERE userID = @potentialID);
                SET @userNumber = @userNumber + 1;
            END;

            -- If the first free number is greater than 99, we have a problem :(
                -- But I suppose it would be good for NBCC to have that many students
            -- Either way, this would be *incredibly* unlikely but it is possible so we just won't insert the user since it won't fit
            -- The student will just need to simply legally change their name to something with different initials, obviously
            IF @userNumber > 99
            BEGIN
                RETURN;
            END;

            -- If the user is an admin, null the expiration date
            IF @admin = 1
            BEGIN
                SET @expiryDate = NULL;
            END
            ELSE
            BEGIN
                SET @expiryDate = DATEADD(YEAR, 2, GETDATE());
            END;

            -- Insert the user
            INSERT INTO UserTable (userID, fName, lName, email, password, admin, active, campus, createdDate, expirationDate)
            VALUES (@potentialID, @firstname, @lastname, @email, @password, @admin, 0, @campus, GETDATE(), @expiryDate);
        END;
        GO

    CREATE PROCEDURE insertPatient
        -- Procedure: insertPatient
        -- Purpose: Insert a new patient into the database
        -- Parameters:
        --      @firstName - the first name of the patient
        --      @lastName - the last name of the patient
        --      @dob - the date of birth of the patient
        --      @sex - sex of the patient
        --      @address - the address of the patient
        --      @city - the city of the patient
        --      @hospitalName - the name of the hospital the patient is associated with
        --      @roomNumber - the room number of the patient
        --      @unitNumber - the unit number of the patient
        --      @allergies - any allergies the patient has
        --      @conditions - any conditions the patient has
        -- Returns: None
        -- Notes: None
        @firstName varchar(255),
        @lastName varchar(255),
        @dob date,
        @sex varchar(40),
        @address varchar(255),
        @city varchar(255),
        @hospitalName varchar(255),
        @roomNumber varchar(255),
        @unitNumber varchar(255),
        @allergies varchar(255),
        @conditions varchar(255)
        AS
        BEGIN
            -- There's no way to check if a patient already exists since there's no unique identifier for them
            -- other than the auto generated internal ID
            -- So we just insert them and hope they weren't added multiple times in error
            INSERT INTO PatientTable (fName, lName, DOB, sex, address, city, hospitalName, roomNumber, unitNumber, allergies, conditions)
            VALUES (@firstName, @lastName, @dob, @sex, @address, @city, @hospitalName, @roomNumber, @unitNumber, @allergies, @conditions);
        END;
        GO

    CREATE PROCEDURE insertPhysician
        -- Procedure: insertPhysician
        -- Purpose: Insert a new physician into the database
        -- Parameters:
        --      @firstName - the first name of the physician
        --      @lastName - the last name of the physician
        --      @email - the email of the physician
        --      @phone - the phone number of the physician
        --      @hospitalName - the name of the hospital the physician is associated with
        -- Returns: None
        -- Notes: None
        @firstName varchar(255),
        @lastName varchar(255),
        @city varchar(255),
        @province varchar(255)
        AS
        BEGIN
            -- First we should generate a unique ID for the physician: formatted FL0000 (First and Last initials, 4 digit incrementing number)
            DECLARE @potentialID char(6) = 'FL0000';    -- This will be the ID we try to assign to the physician
            DECLARE @physicianInitials char(2) = LEFT(@firstName, 1) + LEFT(@lastName, 1);
            DECLARE @IDExists bit = 1; -- Assume the ID exists until we find one that doesn't (1 = true, 0 = false)
            DECLARE @physicianNumber int = 0; -- This will be cast to a string as a 4 digit number

            -- Put the initials in the ID
            SET @potentialID = STUFF(@potentialID, 1, 2, @physicianInitials);    -- FL0000

            -- Find the next available number for the physicianID
            WHILE @IDExists = 1 AND @physicianNumber < 10000
            BEGIN
                -- Build the potential ID with the new number and check if it exists already
                SET @potentialID = STUFF(@potentialID, 3, 4, RIGHT('0000' + CAST(@physicianNumber AS varchar(4)), 4));
                SET @IDExists = (SELECT COUNT(*) FROM PhysicianTable WHERE physicianID = @potentialID);
                SET @physicianNumber = @physicianNumber + 1;
            END;

            -- I doubt we'll have 10,000 physicians in the database with the same initials but just in case
            IF @physicianNumber > 9999
            BEGIN
                RETURN;
            END;

            -- Insert the physician
            INSERT INTO PhysicianTable (physicianID, fName, lName, city, province)
            VALUES (@potentialID, @firstName, @lastName, @city, @province);
        END;
        GO

    CREATE PROCEDURE insertDrug
        -- Procedure: insertDrug
        -- Purpose: Insert a new drug into the database
        -- Parameters:
        --      @DIN - the Drug Identification Number of the drug
        --      @name - the name of the drug
        --      @dosage - the dosage of the drug (eg 500mg)
        --      @strength - the strength of the drug
        --      @manufacturer - the manufacturer of the drug
        --      @concenration - the concentration of the drug
        --      @referanceBrand - the reference brand of the drug (if applicable) (eg Tylenol for Acetaminophen)
        --      @containerSize - the amount of the drug in the container (eg 100 tablets, 500mL, etc.)
        -- Returns: None
        -- Notes: It should be noted that a DIN uniquely identifies the following product characteristics: 
                -- manufacturer; product name; active ingredient(s); strength(s) of active ingredient(s);
                -- pharmaceutical form; route of administration
                -- So the DB could have many entries for the same drug if it has a different strength, manufacturer, etc.
        @DIN char(8),
        @name varchar(255),
        @dosage varchar(255),
        @strength varchar(255),
        @manufacturer varchar(255),
        @concentration varchar(255),
        @referenceBrand varchar(255),
        @containerSize varchar(255)
        AS
        BEGIN
            -- First we check if the drug already exists, if it does we don't need to insert it again
            IF EXISTS (SELECT * FROM DrugTable WHERE DIN = @DIN)
            BEGIN
                RETURN;
            END;

            -- Insert the drug
            INSERT INTO DrugTable (DIN, drugName, dosage, strength, manufacturer, concentration, referenceBrand, containerSize)
            VALUES (@DIN, @name, @dosage, @strength, @manufacturer, @concentration, @referenceBrand, @containerSize);
        END;
        GO

    CREATE PROCEDURE insertOrder
        -- Procedure: insertOrder
        -- Purpose: Insert a new order into the database
        -- Parameters:
        --      @PPR - the PPR of the patient the order is for
        --      @DIN - the Drug Identification Number of the drug on the order
        --      @physicianID - the ID of the physician who prescribed the drug
        --      @initiator - the ID of the user who initiated the order
        --      @SIG - the SIG code on the order
        --      @SIGDescription - the description of the SIG code
        --      @form - the form of the drug (eg tablet, liquid, etc.)
        --      @route - the route of administration of the drug
        --      @prescribedDose - the prescribed dose of the drug
        --      @frequency - the frequency of the drug
        --      @duration - the duration of the treatment
        --      @quantity - the quantity of the drug
        --      @startDate - the start date of the treatment
        --      @startTime - the time the treatment should start
        --      @comments - any comments on the order
        --      @imagePath - the path to the image of the order
        -- Returns: None
        -- Notes: rxNum and status will be an auto generated ID and 'Submitted' respectively
        --        dateSubmitted and dateLastChanged will be the current date and time
        --        verifier and dateVerified will be NULL since the order has not been verified yet
        @PPR int,
        @DIN varchar(8),
        @physicianID char(6),
        @initiator char(6),
        @SIG varchar(255),
        @SIGDescription varchar(255),
        @form varchar(255),
        @route varchar(255),
        @prescribedDose varchar(255),
        @frequency varchar(255),
        @duration varchar(255),
        @quantity varchar(255),
        @startDate date,
        @startTime varchar(255),
        @comments varchar(500),
        @imagePath varchar(255)
        AS
        BEGIN
            -- Create some variables for the various date fields
            DECLARE @dateSubmitted datetime = GETDATE();
            DECLARE @dateLastChanged datetime = @dateSubmitted;
            DECLARE @dateVerified datetime = NULL;

            -- Make sure the patient, drug, and physician exist
            IF NOT EXISTS (SELECT * FROM PatientTable WHERE PPR = @PPR)
                OR NOT EXISTS (SELECT * FROM DrugTable WHERE DIN = @DIN)
                OR NOT EXISTS (SELECT * FROM PhysicianTable WHERE physicianID = @physicianID)
            BEGIN
                -- If these don't exist, the order doesn't make sense
                RETURN;
            END;

            -- Make sure the user exists
            IF NOT EXISTS (SELECT * FROM UserTable WHERE userID = @initiator)
            BEGIN
                -- If the user doesn't exist, how did we get here?
                RETURN;
            END;

            -- Insert the order and get the rxNum so we can insert the image
            INSERT INTO OrderTable (PPR, DIN, physicianID, initiator, SIG, SIGDescription, form, route, prescribedDose, frequency, duration, quantity, startDate, startTime, comments, status, dateSubmitted, dateLastChanged, verifier, dateVerified)
            VALUES (@PPR, @DIN, @physicianID, @initiator, @SIG, @SIGDescription, @form, @route, @prescribedDose, @frequency, @duration, @quantity, @startDate, @startTime, @comments, 'Submitted', @dateSubmitted, @dateLastChanged, NULL, @dateVerified);

            -- Return the rxNum of the order
            SELECT SCOPE_IDENTITY() AS rxNum;

             -- Insert the image with the rxNum we just got
            INSERT INTO ImageTable (rxNum, imagePath)
            VALUES (SCOPE_IDENTITY(), @imagePath);

        END;
        GO

    CREATE PROCEDURE insertLabel
        -- Procedure: insertLabel
        -- Purpose: Insert a new label into the database
        -- Parameters:
        --      @rxNum - the ID of the order the label is for
        -- Returns: None
        -- Notes: This procedure is designed to be called when the order is verified in the setOrderStatus procedure
        --        This avoids any issues with the label being generated after the verifying user is deleted
        --        We only need the rxNum since the rest of the information can just be pulled from the various tables
        --        It should also be noted that the patient name is first,last but the users' names are last,first
        --        The barcode will be generated off the rxNum when the backend prints the label
        @rxNum int
        AS
        BEGIN
            -- Make sure the order exists and there isn't already a label for it
            IF NOT EXISTS (SELECT * FROM OrderTable WHERE rxNum = @rxNum) 
                AND NOT EXISTS (SELECT * FROM LabelTable WHERE rxNum = @rxNum)
            BEGIN
                -- If the order doesn't exist or there's already a label, we can't insert a new one
                RETURN;
            END;

            -- Make sure the order is verified before we make a label
            IF (SELECT status FROM OrderTable WHERE rxNum = @rxNum) != 'Approved'
            BEGIN
                -- If the order isn't verified, we can't make a label
                -- And that means someone is calling this procedure specifically
                -- Which is not what it's designed for
                RETURN;
            END;

            -- Declare some variables to hold the information we need
            DECLARE @patientName varchar(255);
            DECLARE @patientNumber char(6);
            DECLARE @hospitalName varchar(255);
            DECLARE @roomNumber varchar(255);
            DECLARE @unitNumber varchar(255);
            DECLARE @drugName varchar(255);
            DECLARE @drugDose varchar(255);
            DECLARE @drugDIN char(8);
            DECLARE @quantity varchar(255);
            DECLARE @SIGCode varchar(255);
            DECLARE @filledByName varchar(255);
            DECLARE @filledDate datetime;
            DECLARE @checkedByName varchar(255);
            DECLARE @checkedDate datetime;

            -- Get said information
            SELECT @patientName = p.fName + ' ' + p.lName,
                @patientNumber = p.PPR,
                @hospitalName = p.hospitalName,
                @roomNumber = p.roomNumber,
                @unitNumber = p.unitNumber,
                @drugName = d.drugName,
                @drugDose = d.dosage,
                @drugDIN = o.DIN,
                @quantity = o.quantity,
                @SIGCode = o.SIG,
                @filledByName = u.lName + ', ' + u.fName,
                @filledDate = o.dateLastChanged,
                @checkedByName = u.lName + ', ' + u.fName,
                @checkedDate = o.dateVerified
            FROM OrderTable o
            JOIN PatientTable p ON o.PPR = p.PPR
            JOIN DrugTable d ON o.DIN = d.DIN
            JOIN UserTable u ON o.initiator = u.userID
            WHERE o.rxNum = @rxNum;
            -- Wow this sucked

            -- There is a possibility one of the users is deleted in the time between the order being made and the label being generated
            -- Its not likely since when the creator is deleted, their orders are deleted too but it *might* be possible
            -- So we'll just check it anyways, it's not like it's a huge performance hit
            -- IF filled by name is "User, Deleted", or Checked by name is "User, Deleted", we just return
            IF @filledByName = 'User, Deleted'
            BEGIN
                -- If the user is deleted, the order should have been deleted too, so we return
                RETURN;
            END;

            -- The verifying user can't be deleted yet since they just verified the order in the setOrderStatus procedure
            -- But if they ARE deleted somehow, something went weird and we should just return
            IF @checkedByName = 'User, Deleted'
            BEGIN
                RETURN;
            END;

            -- If we got this far, we can insert the label
            INSERT INTO LabelTable (rxNum, patientName, patientNumber, hospitalName, roomNumber, unitNumber, drugName, drugDose, drugDIN, quantity, SIGCode, filledByName, filledDate, checkedByName, checkedDate)
            VALUES (@rxNum, @patientName, @patientNumber, @hospitalName, @roomNumber, @unitNumber, @drugName, @drugDose, @drugDIN, @quantity, @SIGCode, @filledByName, @filledDate, @checkedByName, @checkedDate);
        END;
        GO

    CREATE PROCEDURE insertConfirmationCode
        -- Procedure: insertConfirmationCode
        -- Purpose: Insert a confirmation code for a user
        -- Parameters:
        --      @userID - the ID of the user
        --      @code - the confirmation code to insert
        -- Returns: None
        -- Notes: None
        @userID char(6),
        @code int
        AS
        BEGIN
            -- Check if the user has already been confirmed
            -- If they have, don't insert a new code and just return
            IF (SELECT active FROM UserTable WHERE userID = @userID) = 1
            BEGIN
                RETURN;
            END;

            -- Check if the user already has a confirmation code (this should only generate once, when the user is created but just in case)
            -- If they do, don't insert a new one and just return
            IF EXISTS (SELECT * FROM ConfirmationCodeTable WHERE userID = @userID)
            BEGIN
                RETURN;
            END;

            -- Insert the confirmation code if nothing else has stopped us
            INSERT INTO ConfirmationCodeTable (userID, code)
            VALUES (@userID, @code);
        END;
        GO

    CREATE PROCEDURE insertResetCode
        -- Procedure: insertResetCode
        -- Purpose: Insert a password reset code for a user
        -- Parameters:
        --      @userID - the ID of the user
        --      @code - the reset code to insert
        --      @expiration - the expiration date of the reset code
        -- Returns: None
        -- Notes: None
        @userID char(6),
        @code int,
        @expiration date
        AS
        BEGIN
            -- Check if the user exists
            IF NOT EXISTS (SELECT * FROM UserTable WHERE userID = @userID)
            BEGIN
                RETURN;
            END;

            -- Make sure the user doesn't already have a reset code
            IF EXISTS (SELECT * FROM PasswordResetCodeTable WHERE userID = @userID)
            BEGIN
                RETURN;
            END;

            -- Insert the reset code
            INSERT INTO PasswordResetCodeTable (userID, code, expiration)
            VALUES (@userID, @code, @expiration);
        END;
        GO

-- Setters (Single Column Updates)
    CREATE PROCEDURE setUserActiveStatus
        -- Procedure: setUserActiveStatus
        -- Purpose: Set the active status of a user (0 for inactive, 1 for active)
        -- Parameters:
        --      @userID - the ID of the user
        --      @active - the active status to set
        -- Returns: None
        -- Notes: None
        @userID char(6),
        @active bit
        AS
        BEGIN
            -- Make sure the user exists
            IF NOT EXISTS (SELECT * FROM UserTable WHERE userID = @userID)
            BEGIN
                RETURN;
            END;

            -- Set the active status of the user
            UPDATE UserTable
            SET active = @active
            WHERE userID = @userID;
        END;
        GO

    CREATE PROCEDURE setUserPassword
        -- Procedure: setUserPassword
        -- Purpose: Set the password of a user after a reset
        -- Parameters:
        --      @userID - the ID of the user
        --      @password - the new password
        -- Returns: None
        -- Notes: None
        @userID char(6),
        @password varchar(255)
        AS
        BEGIN
            -- Make sure the user exists
            IF NOT EXISTS (SELECT * FROM UserTable WHERE userID = @userID)
            BEGIN
                RETURN;
            END;

            -- Set the password of the user
            UPDATE UserTable
            SET password = @password
            WHERE userID = @userID;
        END;
        GO

    CREATE PROCEDURE setOrderStatus
        -- Procedure: setOrderStatus
        -- Purpose: Set the status of an order
        -- Parameters:
        --      @userID - the ID of the user
        --      @rxNum - the ID of the order
        --      @status - the status to set
        -- Returns: None
        -- Notes: This procedure will be called IN the amendOrder so it doesn't need logic for that
        --        If the status is 'Verified' it will be set to 'Approved' instead
        --        I don't think we need to let the status be changed to 'Submitted' since that's the default, but I'll leave it in just in case
        @userID char(6),
        @rxNum int,
        @status varchar(20)
        AS
        BEGIN
            -- Make sure the order exists
            IF NOT EXISTS (SELECT * FROM OrderTable WHERE rxNum = @rxNum)
            BEGIN
                RETURN;
            END;

            -- If the status is "Verified" we need to change it to "Approved"
            IF @status = 'Verified'
            BEGIN
                SET @status = 'Approved';
            END;

            -- Make sure the status is valid (Submitted, Approved, Rejected, Amended)
            IF @status != 'Submitted' AND @status != 'Approved' AND @status != 'Rejected' AND @status != 'Amended'
            BEGIN
                RETURN;
            END;

            -- Make sure the user exists and isnt the initiator of the order if the status isn't 'Amended'
            IF NOT EXISTS (SELECT * FROM UserTable WHERE userID = @userID)
                OR (
                    (SELECT initiator FROM OrderTable WHERE rxNum = @rxNum) = @userID
                    AND @status != 'Amended'
                )
            BEGIN
                RETURN;
            END;

            -- Set the status of the order
            UPDATE OrderTable
            SET status = @status
            WHERE rxNum = @rxNum;

            -- Now if the status is approved we need to set the dateVerified and verifier
            -- And create a label for the order
            IF @status = 'Approved'
            BEGIN
                UPDATE OrderTable
                SET verifier = @userID,
                    dateVerified = GETDATE()
                WHERE rxNum = @rxNum;

                -- Insert the label
                EXEC insertLabel @rxNum;
            END;

            -- Set the log message based on the status
            DECLARE @logMessage varchar(255);
            SET @logMessage = 'Order status changed to ' + @status;

            -- Generate a log for the status change
            EXEC generateLog @userID, @rxNum, @logMessage;

        END;
        GO

        CREATE PROCEDURE setOrderImage
                -- Procedure: setOrderImage
                -- Purpose: Set the image path of an order
                -- Parameters:
                --      @orderID - the ID of the order
                --      @imagePath - the path to the image
                -- Returns: None
                -- Notes: None
                @orderID int,
                @imagePath varchar(255)
                AS
                BEGIN
                    -- Make sure the order exists
                    IF NOT EXISTS (SELECT * FROM OrderTable WHERE rxNum = @orderID)
                    BEGIN
                        RETURN;
                    END;

                    -- Set the image path of the order
                    UPDATE ImageTable
                    SET imagePath = @imagePath
                    WHERE rxNum = @orderID;
                END;
                GO
-- Updates (Whole Row Updates)
    CREATE PROCEDURE updateUser
        -- Procedure: updateUser
        -- Purpose: Update a user's information (except password and created date)
        -- Parameters:
        --      @userID - the ID of the user
        --      @firstName - the first name of the user
        --      @lastName - the last name of the user
        --      @email - the email of the user
        --      @campus - the campus the user is associated with
        --      @admin - whether the user is an admin or not (0 for false, 1 for true)
        --      @active - whether the user is active or not (0 for false, 1 for true)
        --      @expiration - the expiration date of the user
        -- Returns: None
        -- Notes: None
        @userID char(6),
        @firstName varchar(255),
        @lastName varchar(255),
        --@email varchar(255),
        --@campus varchar(255),
        @admin bit,
        @active bit
       -- @expiration date
        AS
        BEGIN
            -- Make sure the user exists
            IF NOT EXISTS (SELECT * FROM UserTable WHERE userID = @userID)
            BEGIN
                RETURN;
            END;

            -- Update the user's information
            UPDATE UserTable
            SET fName = @firstName,
                lName = @lastName,
                --email = @email,
                --campus = @campus,
                admin = @admin,
                active = @active
                --expirationDate = @expiration
            WHERE userID = @userID;
        END;
        GO

    CREATE PROCEDURE updatePatient
        -- Procedure: updatePatient
        -- Purpose: Update a patient's information
        -- Parameters:
        --      @PPR - the PPR of the patient
        --      @firstName - the first name of the patient
        --      @lastName - the last name of the patient
        --      @dob - the date of birth of the patient
        --      @sex - the sex of the patient
        --      @address - the address of the patient
        --      @city - the city of the patient
        --      @hospitalName - the name of the hospital the patient is associated with
        --      @roomNumber - the room number of the patient
        --      @unitNumber - the unit number of the patient
        --      @allergies - any allergies the patient has
        --      @conditions - any conditions the patient has
        -- Returns: None
        -- Notes: None
        @PPR char(6),
        @firstName varchar(255),
        @lastName varchar(255),
        @dob date,
        @sex varchar(40),
        @address varchar(255),
        @city varchar(255),
        @hospitalName varchar(255),
        @roomNumber varchar(255),
        @unitNumber varchar(255),
        @allergies varchar(255),
        @conditions varchar(255)
        AS
        BEGIN
            -- Make sure the patient exists
            IF NOT EXISTS (SELECT * FROM PatientTable WHERE PPR = @PPR)
            BEGIN
                RETURN;
            END;

            -- Update the patient's information
            UPDATE PatientTable
            SET fName = @firstName,
                lName = @lastName,
                DOB = @dob,
                sex = @sex,
                address = @address,
                city = @city,
                hospitalName = @hospitalName,
                roomNumber = @roomNumber,
                unitNumber = @unitNumber,
                allergies = @allergies,
                conditions = @conditions
            WHERE PPR = @PPR;
        END;
        GO

    CREATE PROCEDURE updatePhysician
        -- Procedure: updatePhysician
        -- Purpose: Update a physician's information
        -- Parameters:
        --      @physicianID - the ID of the physician
        --      @firstName - the first name of the physician
        --      @lastName - the last name of the physician
        --      @city - the city of the physician
        --      @province - the province of the physician
        -- Returns: None
        -- Notes: None
        @physicianID char(6),
        @firstName varchar(255),
        @lastName varchar(255),
        @city varchar(255),
        @province varchar(255)
        AS
        BEGIN
            -- Make sure the physician exists
            IF NOT EXISTS (SELECT * FROM PhysicianTable WHERE physicianID = @physicianID)
            BEGIN
                RETURN;
            END;

            -- Update the physician's information
            UPDATE PhysicianTable
            SET fName = @firstName,
                lName = @lastName,
                city = @city,
                province = @province
            WHERE physicianID = @physicianID;
        END;
        GO

    CREATE PROCEDURE updateDrug
        -- Procedure: updateDrug
        -- Purpose: Update a drug's information
        -- Parameters:
        --      @DIN - the Drug Identification Number of the drug
        --      @name - the name of the drug
        --      @dosage - the dosage of the drug 
        --      @strength - the strength of the drug
        --      @manufacturer - the manufacturer of the drug
        --      @concentration - the concentration of the drug
        --      @referenceBrand - the reference brand of the drug (if applicable)
        --      @containerSize - the amount of the drug in the container
        -- Returns: None
        -- Notes: None
        @DIN char(8),
        @name varchar(255),
        @dosage varchar(255),
        @strength varchar(255),
        @manufacturer varchar(255),
        @concentration varchar(255),
        @referenceBrand varchar(255),
        @containerSize varchar(255)
        AS
        BEGIN
            -- Make sure the drug exists
            IF NOT EXISTS (SELECT * FROM DrugTable WHERE DIN = @DIN)
            BEGIN
                RETURN;
            END;

            -- Update the drug's information
            UPDATE DrugTable
            SET drugName = @name,
                dosage = @dosage,
                strength = @strength,
                manufacturer = @manufacturer,
                concentration = @concentration,
                referenceBrand = @referenceBrand,
                containerSize = @containerSize
            WHERE DIN = @DIN;
        END;
        GO

-- Checks (Boolean / Simple)
    CREATE PROCEDURE isEmailInUse
        -- Procedure: isEmailInUse
        -- Purpose: Check if an email is already in use in the database
        -- Parameters:
        --      @email - the email to check
        -- Returns: 1 if the email is in use, 0 if it is not
        -- Notes: None
        @email varchar(255)
        AS
        BEGIN
            -- Since we check if the email is used on user creation, we don't need to count the number, just check if it exists
            IF EXISTS (SELECT * FROM UserTable WHERE email = @email)
            BEGIN
                RETURN 1;
            END
            ELSE
            BEGIN
                RETURN 0;
            END
        END;
        GO

    CREATE PROCEDURE isUserAdmin
        -- Procedure: isUserAdmin
        -- Purpose: Check if a user is an admin
        -- Parameters:
        --      @userID - the ID of the user
        -- Returns: Just returns the admin status of the user, which is 1 if they are an admin, 0 if they are not
        -- Notes: None
        @userID char(6)
        AS
        BEGIN
            -- Make sure the user exists
            IF NOT EXISTS (SELECT * FROM UserTable WHERE userID = @userID)
            BEGIN
                RETURN NULL;
            END;

            -- Check if the user is an admin
            SELECT admin FROM UserTable WHERE userID = @userID;
        END;
        GO

    CREATE PROCEDURE isUserActive
        -- Procedure: isUserActive
        -- Purpose: Check if a user is active
        -- Parameters:
        --      @userID - the ID of the user
        -- Returns: 1 if the user is active, 0 if they are not
        -- Notes: None
        @userID char(6)
        AS
        BEGIN
            -- Check if the user is active
            IF (SELECT active FROM UserTable WHERE userID = @userID) = 1
            BEGIN
                RETURN 1;
            END
            ELSE
            BEGIN
                RETURN 0;
            END
            -- In hindsight, this could have just been a select statement but I don't want to change how it's integrated into the backend lest I break something
            -- Dear future people: Sorry, but it probably wouldn't actually be that hard to change if you really care
        END;
        GO

-- Checks (Complex)
    CREATE PROCEDURE checkPassword
        -- Procedure: checkPassword
        -- Purpose: pull the db pass for backend validation
        -- Parameters:
        --      @userID - the ID of the user
        -- Returns: stored hash
        -- Notes: None
        @userID char(6)
        AS
        BEGIN
            --get the stored pass hash
            SELECT password FROM UserTable WHERE userID = @userID;
        END;
        GO

    CREATE PROCEDURE checkForPass
        -- Procedure: checkForPass
        -- Purpose: See if a user has a password in the db (bulk added)
        -- Parameters:
        --      @userID - the ID of the user
        -- Returns: 1 or 0
        @userID char(6)
        AS
        BEGIN
             -- Check if the user exists
            IF EXISTS (SELECT * FROM UserTable WHERE userID = @userID)
            BEGIN
                -- Check if the password is null or empty string
                IF EXISTS (SELECT * FROM UserTable WHERE userID = @userID AND (password IS NULL OR password = ''))
                BEGIN
                    RETURN 1; -- Return 1 if user exists but password is null or empty
                END
                ELSE
                BEGIN
                    RETURN 0; -- Return 0 if user exists and password is not null or empty
                END;
            END
            ELSE
            BEGIN
                RETURN 0; -- Return 0 if user does not exist
            END;

        END;
        GO

    CREATE PROCEDURE checkConfirmationCode
        -- Procedure: checkConfirmationCode
        -- Purpose: Check if the confirmation code is valid for the given ID
        -- Parameters:
        --      @userID - the ID of the user
        --      @confirmationCode - the confirmation code to check
        -- Returns: 1 if the confirmation code is valid, 0 if it is not
        -- Notes: None
        @userID char(6),
        @confirmationCode int
        AS
        BEGIN
            -- Check if the user is already active (this shouldn't happen but just in case)
            -- If they are, the code is invalid and we should remove any confirmation codes that may exist for them
            IF (SELECT active FROM UserTable WHERE userID = @userID) = 1
            BEGIN
                DELETE FROM ConfirmationCodeTable WHERE userID = @userID;
                RETURN 0;
            END;

            -- Check if the user has a confirmation code in the table, and if it matches the one given
            IF EXISTS (SELECT * FROM ConfirmationCodeTable WHERE userID = @userID AND code = @confirmationCode)
            BEGIN
                -- We found a matching code/user entry, so we can remove it, set the user to active, and return 1
                DELETE FROM ConfirmationCodeTable WHERE userID = @userID;
                UPDATE UserTable SET active = 1 WHERE userID = @userID;
                RETURN 1;
            END
            ELSE
            BEGIN
                -- We didn't find a matching code/user entry, so there is no need to change anything and we can return 0
                RETURN 0;
            END
        END;
        GO

    CREATE PROCEDURE checkResetCode
        -- Procedure: checkResetCode
        -- Purpose: Check if the reset code is valid for the given ID
        -- Parameters:
        --      @userID - the ID of the user
        --      @resetCode - the reset code to check
        -- Returns: 1 if the reset code is valid, 0 if it is not
        -- Notes: None
        @userID char(6),
        @resetCode int
        AS
        BEGIN
            -- Check if the reset code is valid
            IF EXISTS (SELECT * FROM PasswordResetCodeTable WHERE userID = @userID AND code = @resetCode AND expiration >= GETDATE())
            BEGIN
                -- The reset code is valid, so we can return 1 and remove the reset code
                DELETE FROM PasswordResetCodeTable WHERE userID = @userID;
                RETURN 1;
            END
            ELSE
            BEGIN
                RETURN 0;
            END
        END;
        GO

-- Deletes
    CREATE PROCEDURE deleteOrder
        -- Procedure: deleteOrder
        -- Purpose: Delete an order from the database
        -- Parameters:
        --      @orderID - the ID of the order
        -- Returns: None
        -- Notes: This procedure will also delete any associated images, labels, and logs
        --        It is worth noting this procedure is NOT called in deleteUser, deletion is handled separately in that procedure
        @orderID int
        AS
        BEGIN
            -- Check if the order exists
            IF NOT EXISTS (SELECT * FROM OrderTable WHERE rxNum = @orderID)
            BEGIN
                RETURN;
            END;

             -- Delete any images associated with the order
            DELETE FROM ImageTable WHERE rxNum = @orderID;

            -- Delete any labels associated with the order
            DELETE FROM LabelTable WHERE rxNum = @orderID;

            DELETE FROM LogTable WHERE affectedOrder = @orderID;
            -- Delete the order
            DELETE FROM OrderTable WHERE rxNum = @orderID;
        END;
        GO

    CREATE PROCEDURE deleteUser
        -- Procedure: deleteUser
        -- Purpose: Delete a user from the database
        -- Parameters:
        --      @userID - the ID of the user
        -- Returns: None
        -- Notes: This procedure will also delete any associated orders, images, labels, confirmation codes, and reset codes
        --        It also deletes logs associated with the orders
        @userID char(6)
        AS
        BEGIN
            -- Check if the user exists
            IF NOT EXISTS (SELECT * FROM UserTable WHERE userID = @userID)
            BEGIN
                RETURN;
            END;

            -- Now this is where it gets complicated
            -- We need to delete any orders with the user's ID as the initiator
            -- And set the verifier to 'Deleted' (ID '000000') if the user is the verifier
            -- Which means we need to delete any images or labels for those orders
            -- And we also need to delete any confirmation codes or reset codes associated with the user

            -- First, we need to get all the orders the user initiated
            DECLARE @ordersToDelete TABLE (orderID int);
            INSERT INTO @ordersToDelete
            SELECT rxNum FROM OrderTable WHERE initiator = @userID;

             -- Now we need to delete any images associated with those orders
            DELETE FROM ImageTable WHERE rxNum IN (SELECT orderID FROM @ordersToDelete);

            -- We also need to delete any labels associated with those orders (if they exist)
            DELETE FROM LabelTable WHERE rxNum IN (SELECT orderID FROM @ordersToDelete);

            -- And the logs associated with those orders
            DELETE FROM LogTable WHERE affectedOrder IN (SELECT orderID FROM @ordersToDelete);

            -- Then we can delete the orders
            DELETE FROM OrderTable WHERE rxNum IN (SELECT orderID FROM @ordersToDelete);

            -- And now we need to set the verifier to the 'Deleted' user for any orders where the user is the verifier
            UPDATE OrderTable SET verifier = '000000' WHERE verifier = @userID;

            -- Thankfully now we can move on to the less involved stuff
            -- Delete any confirmation codes
            DELETE FROM ConfirmationCodeTable WHERE userID = @userID;

            -- Delete any reset codes
            DELETE FROM PasswordResetCodeTable WHERE userID = @userID;

            --Delete any notifications
            DELETE FROM NotificationTable where recipient = @userID;

            -- Now, FINALLY, we can delete the user(disable account)
            UPDATE UserTable set removed = 1, active = 0 where userID = @userID;
        END;
        GO

    CREATE PROCEDURE deletePatients
        -- Procedure: deletePatients
        -- Purpose: Delete one or more patients from the database
        -- Parameters:
        --      @PPR - the PPR of the patient
        -- Returns: None
        -- Notes: Hopefully this is because the patient is cured :)
        @PPR nvarchar(4000)
        AS
        BEGIN
            --Delete the any orders associated with them first
            DECLARE @OrderID int;
            WHILE exists(select * from OrderTable Where PPR in(select * from string_split(@PPR,',')))
            BEGIN
                select top 1 @OrderID = rxNum from OrderTable where PPR in(select * from string_split(@PPR,','))
                exec deleteOrder @OrderID;
            END;
            -- Delete the patient
            DELETE FROM PatientTable WHERE PPR in(select * from string_split(@PPR,','))
        END;
        GO

    CREATE PROCEDURE deletePhysician
        -- Procedure: deletePhysician
        -- Purpose: Delete a physician from the database
        -- Parameters:
        --      @physicianID - the ID of the physician
        -- Returns: None
        -- Notes: None
        @physicianID char(6)
        AS
        BEGIN
            -- Check if the physician exists
            IF NOT EXISTS (SELECT * FROM PhysicianTable WHERE physicianID = @physicianID)
            BEGIN
                RETURN;
            END;

            --Delete the any orders associated with them first
            DECLARE @OrderID int;
            WHILE exists(select * from OrderTable Where physicianID = @physicianID)
            BEGIN
                select @OrderID = rxNum from OrderTable where physicianID = @physicianID
                exec deleteOrder @OrderID;
            END;
            -- Delete the physician
            DELETE FROM PhysicianTable WHERE physicianID = @physicianID;
        END;
        GO

    CREATE PROCEDURE deleteDrug
        -- Procedure: deleteDrug
        -- Purpose: Delete a drug from the database
        -- Parameters:
        --      @DIN - the Drug Identification Number of the drug
        -- Returns: None
        -- Notes: None
        @DIN char(8)
        AS
        BEGIN
            -- Check if the drug exists
            IF NOT EXISTS (SELECT * FROM DrugTable WHERE DIN = @DIN)
            BEGIN
                RETURN;
            END;
            --Delete the any orders associated with them first
            DECLARE @OrderID int;
            WHILE exists(select * from OrderTable Where DIN = @DIN)
            BEGIN
                select @OrderID = rxNum from OrderTable where DIN = @DIN
                exec deleteOrder @OrderID;
            END;
            -- Delete the drug
            DELETE FROM DrugTable WHERE DIN = @DIN;
        END;
        GO

-- Retrievals (Single Column)
    CREATE PROCEDURE getIDByEmail
        -- Procedure: getIDByEmail
        -- Purpose: Get the ID of a user by their email
        -- Parameters:
        --      @email - the email of the user
        -- Returns: the ID of the user if they exist, NULL if they do not
        -- Notes: None
        @email varchar(255)
        AS
        BEGIN
            -- Check if the email exists in the database
            IF NOT EXISTS (SELECT * FROM UserTable WHERE email = @email)
            BEGIN
                RETURN NULL;
            END;

            -- Get the ID of the user
            SELECT userID FROM UserTable WHERE email = @email;
        END;
        GO

    CREATE PROCEDURE getEmailByID
        -- Procedure: getEmailByID
        -- Purpose: Get the email of a user by their ID
        -- Parameters:
        --      @userID - the ID of the user
        -- Returns: the email of the user if they exist, NULL if they do not
        -- Notes: None
        @userID char(6)
        AS
        BEGIN
            -- Check if the user exists
            IF NOT EXISTS (SELECT * FROM UserTable WHERE userID = @userID)
            BEGIN
                RETURN NULL;
            END;

            -- Get the email of the user
            SELECT email FROM UserTable WHERE userID = @userID;
        END;
        GO

    CREATE PROCEDURE getImagePathByOrderID
        -- Procedure: getImagePathByOrderID
        -- Purpose: Get the image path of an order by its ID
        -- Parameters:
        --      @rxNum - the ID of the order
        -- Returns: the image path of the order if it exists, NULL if it does not
        -- Notes: None
        @rxNum int
        AS
        BEGIN
            -- Check if the order exists
            IF NOT EXISTS (SELECT * FROM ImageTable WHERE rxNum = @rxNum)
            BEGIN
                RETURN NULL;
            END;

            -- Get the image path of the order
            SELECT imagePath FROM ImageTable WHERE rxNum = @rxNum;
        END;
        GO

    CREATE PROCEDURE getUserInfo
        -- Procedure: getUserInfo
        -- Purpose: Gets all information about a single user (except password)
        -- Parameters:
        --      @userID - the ID of the user
        -- Returns: userID, fName, lName, email, admin, active, campus, createdDate, expirationDate
        -- Notes: None
        @userID char(6)
        AS
        BEGIN
            -- Check if the user exists
            IF NOT EXISTS (SELECT * FROM UserTable WHERE userID = @userID)
            BEGIN
                RETURN NULL;
            END;

            -- Return the user information
            SELECT userID, fName, lName, email, admin, removed, active, campus, createdDate, expirationDate
            FROM UserTable
            WHERE userID = @userID;
        END;
        GO
    CREATE PROCEDURE getPatientInfo
        -- Procedure: getPatientInfo
        -- Purpose: Gets all information about a single patient
        -- Parameters:
        --      @PPR - the PPR of the patient
        -- Returns: PPR, fName, lName, DOB, sex, address, city, hospitalName, roomNumber, unitNumber, allergies, conditions
        -- Notes: None
        @PPR char(6)
        AS
        BEGIN
            -- Check if the patient exists
            IF NOT EXISTS (SELECT * FROM PatientTable WHERE PPR = @PPR)
            BEGIN
                RETURN NULL;
            END;

            -- Return the patient information
            SELECT PPR, fName, lName, DOB, sex, address, city, hospitalName, roomNumber, unitNumber, allergies, conditions
            FROM PatientTable
            WHERE PPR = @PPR;
        END;
        GO

    CREATE PROCEDURE getPhysicianInfo
        -- Procedure: getPhysicianInfo
        -- Purpose: Gets all information about a single physician
        -- Parameters:
        --      @physicianID - the ID of the physician
        -- Returns: physicianID, fName, lName, city, province
        -- Notes: None
        @physicianID char(6)
        AS
        BEGIN
            -- Check if the physician exists
            IF NOT EXISTS (SELECT * FROM PhysicianTable WHERE physicianID = @physicianID)
            BEGIN
                RETURN NULL;
            END;

            -- Return the physician information
            SELECT physicianID, fName, lName, city, province
            FROM PhysicianTable
            WHERE physicianID = @physicianID;
        END;
        GO

    CREATE PROCEDURE getDrugInfo
        -- Procedure: getDrugInfo
        -- Purpose: Gets all information about a single drug
        -- Parameters:
        --      @DIN - the Drug Identification Number of the drug
        -- Returns: DIN, name, dosage, strength, manufacturer, concentration, referenceBrand, containerSize
        -- Notes: None
        @DIN char(8)
        AS
        BEGIN
            -- Check if the drug exists
            IF NOT EXISTS (SELECT * FROM DrugTable WHERE DIN = @DIN)
            BEGIN
                RETURN NULL;
            END;

            -- Return the drug information
            SELECT DIN, drugName, dosage, strength, manufacturer, concentration, referenceBrand, containerSize
            FROM DrugTable
            WHERE DIN = @DIN;
        END;
        GO
        
    CREATE PROCEDURE getOrderInfo
        -- Procedure: getOrderInfo
        -- Purpose: Gets all information about a single order
        -- Parameters:
        --      @rxNum - the ID of the order
        -- Returns: All Info
        -- Notes: None
        @rxNum int
        AS
        BEGIN
            -- Check if the order exists
            IF NOT EXISTS (SELECT * FROM OrderTable WHERE rxNum = @rxNum)
            BEGIN
                RETURN NULL;
            END;

            -- Return the order information
            SELECT *
            FROM OrderTable o
            LEFT JOIN ImageTable i
            ON o.rxNum = i.rxNum
            WHERE o.rxNum = @rxNum;
        END;
        GO

    CREATE PROCEDURE getLabelInfo
        -- Procedure: getLabelInfo
        -- Purpose: Gets all information on a single label
        -- Parameters:
        --      @rxNum - the ID of the order
        -- Returns: patientName, patientNumber, hospitalName, roomNumber, unitNumber, drugName, drugDose, drugDIN, quantity,
        --          rxNum, SIGCode, filledByName, filledDate, checkedByName, checkedDate
        -- Notes: None
        @rxNum int
        AS
        BEGIN
            -- Check if the label exists
            IF NOT EXISTS (SELECT * FROM LabelTable WHERE rxNum = @rxNum)
            BEGIN
                RETURN NULL;
            END;

            -- Return the label information
            SELECT patientName, patientNumber, hospitalName, roomNumber, unitNumber, drugName, drugDose, drugDIN, quantity,
                rxNum, SIGCode, filledByName, filledDate, checkedByName, checkedDate
            FROM LabelTable
            WHERE rxNum = @rxNum;
        END;
        GO

-- Retrievals (Whole Table)
    CREATE PROCEDURE getAllUsers
        -- Procedure: getAllUsers
        -- Purpose: Gets info about all users
        -- Parameters: none
        -- Returns: fName, lName, email, admin, active, campus, createdDate, expirationDate of each
        -- Notes: Returns all info (save password) of each user in DB, except the default "Deleted" user with ID '000000'
        AS
        BEGIN
            --Select
            SELECT userID, fName, lName, email, admin, removed, active, campus, createdDate, expirationDate
            FROM UserTable
            WHERE userID <> '000000'
        END;
        GO

    CREATE PROCEDURE getAllPatients
        -- Procedure: getAllPatients
        -- Purpose: Gets info about all patients
        -- Parameters: none
        -- Returns: PPR, fName, lName, DOB, sex, address, city, hospitalName, roomNumber, unitNumber, allergies, conditions of each
        -- Notes: Returns all info of each patient in DB
        AS
        BEGIN
            -- Select
            SELECT PPR, fName, lName, DOB, sex, address, city, hospitalName, roomNumber, unitNumber, allergies, conditions
            FROM PatientTable
        END;
        GO

    CREATE PROCEDURE getAllPhysicians
        -- Procedure: getAllPhysicians
        -- Purpose: Gets info about all physicians
        -- Parameters: none
        -- Returns: physicianID, fName, lName, city, province of each
        -- Notes: Returns all info of each physician in DB
        AS
        BEGIN
            -- Select
            SELECT physicianID, fName, lName, city, province
            FROM PhysicianTable
        END;
        GO

    CREATE PROCEDURE getAllDrugs
        -- Procedure: getAllDrugs
        -- Purpose: Gets info about all drugs
        -- Parameters: none
        -- Returns: DIN, name, dosage, strength, manufacturer, concentration, referenceBrand, containerSize of each
        -- Notes: Returns all info of each drug in DB
        AS
        BEGIN
            -- Select
            SELECT DIN, drugName, dosage, strength, manufacturer, concentration, referenceBrand, containerSize
            FROM DrugTable
        END;
        GO

    CREATE PROCEDURE getAllOrders
        -- Procedure: getAllOrders
        -- Purpose: Gets info about all orders
        -- Parameters: none
        -- Returns: rxNum, PPR, DIN, physicianID, SIG, SIGDescription, form, route, prescribedDose, frequency, duration, quantity, startDate, 
        --          startTime, comments, dateSubmitted, dateVerified, dateLastChanged, status, initiator, verifier of each as well as the imagePath of the order
        -- Notes: Returns all info of each order and it's associated image in DB
        AS
        BEGIN
            -- Select from a join of OrderTable and ImageTable so we can get the image path
            SELECT o.rxNum, o.PPR, o.DIN, o.physicianID, o.SIG, o.SIGDescription, o.form, o.route, o.prescribedDose, o.frequency, o.duration, o.quantity, o.startDate, 
                o.startTime, o.comments, o.dateSubmitted, o.dateVerified, o.dateLastChanged, o.status, o.initiator, o.verifier, i.imagePath, o.PrintStatusID
            FROM OrderTable o
            LEFT JOIN ImageTable i
            ON o.rxNum = i.rxNum order by o.rxNum asc
        END;
        GO

    CREATE PROCEDURE getOrdersVerifiedByUser

    @userID char(6)
    AS
        BEGIN
            Select * from OrderTable where verifier = @userID and status = 'Approved';
        end;
    GO

    CREATE PROCEDURE getAllLogs
        -- Procedure: getAllLogs
        -- Purpose: Gets info about all logs
        -- Parameters: none
        -- Returns: logID, actorID, affectedOrder, actionLogged, timeLogged of each
        -- Notes: Returns all info of each log in DB
        AS
        BEGIN
            -- Select
            SELECT logID, actorID, affectedOrder, actionLogged, timeLogged
            FROM LogTable
        END;
        GO

-- Specific Procedures
    CREATE PROCEDURE getLogs
        -- Procedure: getLogs
        -- Purpose: Get the logs between two dates
        -- Parameters:
        --      @startDate - the start date of the logs
        --      @endDate - the end date of the logs
        -- Returns: All logs between the two dates provided
        -- Notes: This proc is designed to default to the current date for the end date if one is not provided
        @startDate date,
        @endDate date = NULL -- Default to NULL in case the end date is not provided
        AS
        BEGIN
            -- If no end date is provided, default to the current date
            IF @endDate IS NULL
            BEGIN
                SET @endDate = GETDATE();
            END;

            -- Theres no validation here since the proc can't run without the dates being provided in the right format
            SELECT logID, actorID, affectedOrder, actionLogged, timeLogged
            FROM LogTable
            WHERE timeLogged BETWEEN @startDate AND @endDate
        END;
        GO

    CREATE PROCEDURE amendOrder
        -- Procedure: amendOrder
        -- Purpose: Amend an order in the database
        -- Parameters:
        --      @userID - the ID of the user making the amendment (should only be the initiator)
        --      @rxNum - the ID of the order
        --      @PPR - the PPR of the patient the order is for
        --      @DIN - the Drug Identification Number of the drug on the order
        --      @physicianID - the ID of the physician who prescribed the drug
        --      @SIG - the SIG code on the order
        --      @SIGDescription - the description of the SIG code
        --      @form - the form of the drug (eg tablet, liquid, etc.)
        --      @route - the route of administration of the drug
        --      @prescribedDose - the prescribed dose of the drug
        --      @frequency - the frequency of the drug
        --      @duration - the duration of the treatment
        --      @quantity - the quantity of the drug
        --      @startDate - the start date of the treatment
        --      @startTime - the time the treatment should start
        --      @comments - any comments on the order
        --      @imagePath - the path to the image of the order
        -- Returns: None
        -- Notes: This procedure calls the setOrderStatus, setOrderImage, and generateLog procedures
        @userID char(6),
        @rxNum int,
        @PPR char(6),
        @DIN char(8),
        @physicianID char(6),
        @SIG varchar(255),
        @SIGDescription varchar(255),
        @form varchar(255),
        @route varchar(255),
        @prescribedDose varchar(255),
        @frequency varchar(255),
        @duration varchar(255),
        @quantity varchar(255),
        @startDate date,
        @startTime time,
        @comments varchar(500),
        @imagePath varchar(255)
        AS
        BEGIN
            -- Make sure the order exists
            IF NOT EXISTS (SELECT * FROM OrderTable WHERE rxNum = @rxNum)
            BEGIN
                RETURN;
            END;

            -- Make sure the patient, drug, and physician exist
            IF NOT EXISTS (SELECT * FROM PatientTable WHERE PPR = @PPR)
                OR NOT EXISTS (SELECT * FROM DrugTable WHERE DIN = @DIN)
                OR NOT EXISTS (SELECT * FROM PhysicianTable WHERE physicianID = @physicianID)
            BEGIN
                RETURN;
            END;

            -- Make sure the user exists and is the initiator of the order
            IF NOT EXISTS (SELECT * FROM UserTable WHERE userID = @userID)
                OR (SELECT initiator FROM OrderTable WHERE rxNum = @rxNum) != @userID
            BEGIN
                RETURN;
            END;

            -- Update the order
            UPDATE OrderTable
            SET PPR = @PPR,
                DIN = @DIN,
                physicianID = @physicianID,
                SIG = @SIG,
                SIGDescription = @SIGDescription,
                form = @form,
                route = @route,
                prescribedDose = @prescribedDose,
                frequency = @frequency,
                duration = @duration,
                quantity = @quantity,
                startDate = @startDate,
                startTime = @startTime,
                comments = @comments
            WHERE rxNum = @rxNum;

            -- Update the status of the order this will also log it
            EXEC setOrderStatus @userID, @rxNum, 'Amended';

             -- Update the image path of the order
            EXEC setOrderImage @rxNum, @imagePath;

        END;
        GO

    CREATE PROCEDURE getNames
        -- Procedure: getNames
        -- Purpose: Get the first and last names of a user, patient, physician, and/or drug
        -- Parameters:
        --      @userID - the ID of the user
        --      @PPR - the PPR of the patient
        --      @physicianID - the ID of the physician
        --      @DIN - the Drug Identification Number of the drug
        -- Returns: userFName, userLName, patientFName, patientLName, physicianFName, physicianLName, drugName
        -- Notes: If you don't need all of them you can just leave them blank, they will default to NULL
        @userID char(6) = NULL,
        @PPR char(6) = NULL,
        @physicianID char(6) = NULL,
        @DIN char(8) = NULL
        AS
        BEGIN
            -- Check if the user exists
            IF @userID IS NOT NULL AND NOT EXISTS (SELECT * FROM UserTable WHERE userID = @userID)
            BEGIN
                SET @userID = NULL;
            END;

            -- Check if the patient exists
            IF @PPR IS NOT NULL AND NOT EXISTS (SELECT * FROM PatientTable WHERE PPR = @PPR)
            BEGIN
                SET @PPR = NULL;
            END;

            -- Check if the physician exists
            IF @physicianID IS NOT NULL AND NOT EXISTS (SELECT * FROM PhysicianTable WHERE physicianID = @physicianID)
            BEGIN
                SET @physicianID = NULL;
            END;

            -- Check if the drug exists
            IF @DIN IS NOT NULL AND NOT EXISTS (SELECT * FROM DrugTable WHERE DIN = @DIN)
            BEGIN
                SET @DIN = NULL;
            END;
            
            -- Return the names
            SELECT u.fName as userFName, u.lName as userLName, p.fName as patientFName, p.lName as patientLName,
            ph.fName as physicianFName, ph.lName as physicianLName, d.drugName as drugName
            FROM UserTable u
            LEFT JOIN PatientTable p
            ON p.PPR = @PPR
            LEFT JOIN PhysicianTable ph
            ON ph.physicianID = @physicianID
            LEFT JOIN DrugTable d
            ON d.DIN = @DIN
            WHERE u.userID = @userID;
        END;
        GO

    
    -- Drop the stored procedure if it already exists
    IF EXISTS (
    SELECT *
        FROM INFORMATION_SCHEMA.ROUTINES
    WHERE SPECIFIC_SCHEMA = 'dbo'
        AND SPECIFIC_NAME = 'generateLog'
    )
    DROP PROCEDURE dbo.generateLog
    GO
    -- Create the stored procedure in the specified schema
    CREATE PROCEDURE dbo.generateLog
        -- Procedure: generateLog
        -- Purpose: Generate a log for an action
        -- Parameters:
        --      @actorID - the ID of the user performing the action
        --      @affectedOrder - the ID of the order affected by the action
        --      @actionLogged - the action that was performed
        -- Returns: None
        -- Notes: This procedure is to be called in procedure that change an order's status
        --        This proc will NOT BE DROPPED if it already exists
        --        You will need to drop and run it again alone since the other procs depend on it
        @actorID char(6),
        @affectedOrder int,
        @actionLogged varchar(255)
    AS
        -- Just make sure everything checks out
        IF NOT EXISTS (SELECT * FROM UserTable WHERE userID = @actorID)
            OR NOT EXISTS (SELECT * FROM OrderTable WHERE rxNum = @affectedOrder)
        BEGIN
            RETURN;
        END;
                

        -- Looks like things are up to code, time to log
        INSERT INTO LogTable (actorID, affectedOrder, actionLogged, timeLogged)
        VALUES (@actorID, @affectedOrder, @actionLogged, GETDATE());
    GO

    CREATE PROCEDURE getMyOrders
        -- Procedure: getMyOrders
        -- Purpose: Gets all orders for the given user
        -- Parameters:
        --      @userId - the ID of the user
        -- Returns: rxNum, PPR, DIN, physicianID, SIG, SIGDescription, form, route, prescribedDose, frequency, duration, quantity, startDate, 
        --          startTime, comments, dateSubmitted, dateVerified, dateLastChanged, status, initiator, verifier
        -- Notes: None
		@userId char(6)
        AS
        BEGIN
            -- Select orders for specific user
            SELECT rxNum, PPR, DIN, physicianID, status, initiator, verifier, dateSubmitted, 
			dateLastChanged, dateVerified, SIG, SIGDescription, form, route, prescribedDose, frequency,
			duration, quantity, startDate, startTime, PrintStatusID, comments from OrderTable where initiator = @userId
        END;
        GO
    CREATE PROCEDURE updateOrderPrintStatus
        --updates print status for an order, tying the print status with some sort of print

        @orderID INT,
        @statusID int
        AS
            BEGIN
                --checks to make sure info entered is valid
                if not exists(select * from OrderTable where rxNum = @orderID)
                    or not exists (select * from PrintStatusTable where PrintStatusID = @statusID)
                begin
                    return;
                end;
                
                update OrderTable set PrintStatusID = @statusID where rxNum = @orderID;
            end;
    go

    CREATE PROCEDURE dbo.getAllSIGS
    -- will retrieve all sig codes from sig table
    AS
        select * from SIGTable;
    GO

    --Notification Procedures


    CREATE PROCEDURE AddNotification
        @Message nvarchar(250),
        @Recipient char(6)
    -- add more stored procedure parameters here
    AS
        -- body of the stored procedure
        insert into NotificationTable(NMessage, Recipient) values(@Message,@Recipient);
    GO


    CREATE PROCEDURE GetNotifications
        @UserID char(6),
        @StartingRow int
    AS

        select * from NotificationTable where Recipient = @UserID order by DateAdded desc OFFSET (@StartingRow) Rows FETCH NEXT 5 Rows only;
    GO

    CREATE PROCEDURE UpdateSeenStatus
        @NotificationID int,
        @Status bit
    AS

        update NotificationTable set Seen = @Status where NotificationID = @NotificationID;
    GO

    CREATE PROCEDURE GetOrderImageByID
        @rxNum int
    AS
        BEGIN
            select * from ImageTable where rxNum = @rxNum;
        end;
    GO
    CREATE PROCEDURE GetAllOrderImages
    AS
        BEGIN
            select * from ImageTable
        end;
    GO

    CREATE PROCEDURE UpdateOrderImagePath
        @rxNum int,
        @path nvarchar(200)
    AS
        BEGIN
            update ImageTable set imagePath = @path where rxNum = @rxNum;
        END;
    GO