--this contains the code for the scheduled jobs on the mssql server, copy paste them individually

--soft delete
DROP PROCEDURE IF EXISTS softDeleteTask
GO

CREATE PROCEDURE softDeleteTask

AS
    DECLARE @ExpiredUser char(6);
    --while there are users that are expired
    while exists(select * from UserTable where GETDATE() > expirationDate AND removed = 0)
    BEGIN
        SELECT TOP 1 @ExpiredUser = UserID from UserTable where GETDATE() > expirationDate AND removed = 0;
        exec deleteUser @ExpiredUser; --this will soft delete the expired user
    END;
GO
--executes task
EXECUTE softDeleteTask 
GO


--hard delete
DROP PROCEDURE IF EXISTS hardDeleteTask
GO

CREATE PROCEDURE hardDeleteTask

AS
    DECLARE @OldUser char(6);
    
    --while there are users that are Old

    while exists(select * from UserTable where GETDATE() > DATEADD(YYYY,2,[expirationDate]) AND removed = 1)
    BEGIN
        SELECT TOP 1 @OldUser = UserID from UserTable where GETDATE() > DATEADD(YYYY,2,[expirationDate]) AND removed = 1;
        delete from UserTable where UserId = @OldUser;
    END;
GO
--executes task
EXECUTE hardDeleteTask 
GO