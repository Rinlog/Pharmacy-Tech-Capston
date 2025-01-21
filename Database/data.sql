-- This is a file conaining all the data thats in the database for testing purposes
-- This file should NOT be run now, it has been run once to populate the database

-- I repeat, DO NOT RUN THIS FILE
-- That means you, me
-- I know you're thinking about it, but don't do it






--                              This space intentionally left blank












-- Default 000000 User: Basic Information
    -- INSERT INTO UserTable (userID, fname, lname, email, password, campus, admin, active, createdDate, expirationDate)
    -- VALUES ('000000', 'Deleted', 'User', 'email@mynbcc.ca', 'password', 'Fredericton', 0, 0, GETDATE(), NULL)
    -- This user will never be logged in, but will be used to replace a user when they are deleted (To maintain data integrity)
        -- This user's ID is not a valid ID, so it will never be generated for a real user (Normal IDs are LLII00, L = Location, I = Initial, 00 = Incrementing Number)
        -- When a user is deleted, all references to the user will be changed to this user (000000)
        -- This user will never be able to log in, since the user is inactive and the email is not valid so no account verification can be done
        -- This user has a specific check in the delete procedure to ensure it is not deleted

        -- In the orders table, the initiator and verifier will be set to this user if those users are ever deleted
        -- In the label table, since it is populated at creation, it will not be affected by this user's deletion and will still have the original information
        -- In the log table, the actorID will be set to this user if the user who performed the action is deleted but the name will be kept for reference


use pharmtechDB;




-- first we need to drop all the data except four users; me, dee, the 'deleted' user, and the test user
DELETE FROM UserTable WHERE userID NOT IN ('FRBD00', 'FRDS00', '000000', 'FRLT01');
DELETE FROM OrderTable;
DELETE FROM PhysicianTable;
DELETE FROM SigTable;
DELETE FROM drugTable;
DELETE FROM PatientTable;

--Insert some patients
--note that you will need to comment these pluse the DELETE FROM PatientTable out in order to get orders in the ordertabel
INSERT INTO PatientTable (fName, lName, DOB, sex, address, city, hospitalName, roomNumber, unitNumber, allergies, conditions)
VALUES ('John', 'Doe', '1990-01-01', 'M', '123 Main St.', 'Fredericton', 'NBCC Lab', '123', '456', 'Peanuts', 'Asthma');

INSERT INTO PatientTable (fName, lName, DOB, sex, address, city, hospitalName, roomNumber, unitNumber, allergies, conditions)
VALUES ('Jane', 'Doe', '1990-01-01', 'F', '123 Main St.', 'Fredericton', 'NBCC Lab', '123', '457', 'Shellfish', 'Broken Leg');

INSERT INTO PatientTable (fName, lName, DOB, sex, address, city, hospitalName, roomNumber, unitNumber, allergies, conditions)
VALUES ('Bob', 'Smith', '1990-01-01', 'M', '123 Main St.', 'Fredericton', 'NBCC Lab', '123', '458', 'None', 'No Bones');

INSERT INTO PatientTable (fName, lName, DOB, sex, address, city, hospitalName, roomNumber, unitNumber, allergies, conditions)
VALUES ('Sally', 'Smith', '1990-01-01', 'F', '123 Main St.', 'Fredericton', 'NBCC Lab', '123', '459', 'None', 'Depression');


-- These DINs are not real, they are just placeholders
-- Well, the DINs might be real, but the information is not
INSERT INTO drugTable (DIN, drugName, dosage, strength, manufacturer, concentration, referenceBrand, containerSize)
VALUES ('123456', 'Tylenol', '1', '500mg', 'Johnson & Johnson', '50mg/mL', 'Tylenol', '100mL');

INSERT INTO drugTable (DIN, drugName, dosage, strength, manufacturer, concentration, referenceBrand, containerSize)
VALUES ('123457', 'Advil', '1', '500mg', 'Johnson & Johnson', '50mg/mL', 'Advil', '100mL');

INSERT INTO drugTable (DIN, drugName, dosage, strength, manufacturer, concentration, referenceBrand, containerSize)
VALUES ('123458', 'Aspirin', '1', '500mg', 'Johnson & Johnson', '50mg/mL', 'Aspirin', '100mL');

INSERT INTO drugTable (DIN, drugName, dosage, strength, manufacturer, concentration, referenceBrand, containerSize)
VALUES ('123459', 'Morphine', '1', '500mg', 'Johnson & Johnson', '50mg/mL', 'Morphine', '100mL');


-- Insert the SIG codes
INSERT INTO SigTable (abbreviation, description)
VALUES ('QD', 'Each Day');

INSERT INTO SigTable (abbreviation, description)
VALUES ('BID', 'Twice a Day');

INSERT INTO SigTable (abbreviation, description)
VALUES ('TID', 'Three Times a Day');

INSERT INTO SigTable (abbreviation, description)
VALUES ('QID', 'Four Times a Day');

INSERT INTO SigTable (abbreviation, description)
VALUES ('Q4H', 'Every 4 Hours');

INSERT INTO SigTable (abbreviation, description)
VALUES ('Q6H', 'Every 6 Hours');

INSERT INTO SigTable (abbreviation, description)
VALUES ('Q8H', 'Every 8 Hours');

INSERT INTO SigTable (abbreviation, description)
VALUES ('Q12H', 'Every 12 Hours');


-- Insert some physicians
INSERT INTO PhysicianTable (physicianID, fName, lName, city, province)
VALUES ('JS0000', 'John', 'Smith', 'Fredericton', 'NB');

INSERT INTO PhysicianTable (physicianID, fName, lName, city, province)
VALUES ('JD0000', 'John', 'Doe', 'Fredericton', 'NB');

INSERT INTO PhysicianTable (physicianID, fName, lName, city, province)
VALUES ('DH0000', 'Dave', 'Hill', 'Fredericton', 'NB');

INSERT INTO PhysicianTable (physicianID, fName, lName, city, province)
VALUES ('DH0001', 'Delilah', 'Hope', 'Fredericton', 'NB');

INSERT INTO PhysicianTable (physicianID, fName, lName, city, province)
VALUES ('JS0001', 'Jane', 'Smith', 'Fredericton', 'NB');


-- Insert some dummy users
-- The passwords are all unhashed 'password' so they can't be used to log in since the system expects a hashed password
INSERT INTO UserTable (userID, fname, lname, email, password, campus, admin, active, createdDate, expirationDate)
VALUES ('FRBB00', 'Bill', 'Billson', 'bill@mynbcc.ca', 'password', 'Fredericton', 1, 1, GETDATE(), NULL)

INSERT INTO UserTable (userID, fname, lname, email, password, campus, admin, active, createdDate, expirationDate)
VALUES ('FRBB01', 'Bob', 'Bobson', 'bob@mynbcc.ca', 'password', 'Fredericton', 0, 0, GETDATE(), NULL)

INSERT INTO UserTable (userID, fname, lname, email, password, campus, admin, active, createdDate, expirationDate)
VALUES ('FRSS00', 'Sally', 'Sallyson', 'sally@nbcc.ca', 'password', 'Fredericton', 0, 1, GETDATE(), NULL)

INSERT INTO UserTable (userID, fname, lname, email, password, campus, admin, active, createdDate, expirationDate)
VALUES ('FRJJ00', 'Jane', 'Janeson', 'jane@nbcc.ca', 'password', 'Fredericton', 0, 0, GETDATE(), NULL)


-- Insert some nothing orders
INSERT INTO OrderTable (PPR, DIN, physicianID, status, initiator, verifier, dateSubmitted, dateLastChanged, dateVerified, SIG, SIGDescription, form, route, prescribedDose, frequency, duration, quantity, startDate, startTime, comments)
VALUES ('2001', '123456', 'JS0000', 'Submitted', 'FRBB00', 'FRBB01', GETDATE(), GETDATE(), GETDATE(), 'QD', 'Each Day', 'Tablet', 'Oral', '1', 'QD', '1', '100ml', GETDATE(), '12:00', 'No Comments');

INSERT INTO OrderTable (PPR, DIN, physicianID, status, initiator, verifier, dateSubmitted, dateLastChanged, dateVerified, SIG, SIGDescription, form, route, prescribedDose, frequency, duration, quantity, startDate, startTime,  comments)
VALUES ('2002', '123457', 'JS0001', 'Submitted', 'FRBB01', 'FRBB00', GETDATE(), GETDATE(), GETDATE(), 'QD', 'Each Day', 'Tablet', 'Oral', '1', 'QD', '1', '30 Tablets' , GETDATE(), '12:00', 'No Comments');