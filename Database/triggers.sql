use pharmtechDB;

-- Database Trigger Scripts
    -- This file contains the triggers for the database
    -- Mostly relating to logging order changes

-- Logs must include:
    -- timeLogged: Date and time of the change
    -- actorID: User who made the change
    -- affectedOrder: Order ID
    -- actionLogged: The action taken (Created, Updated, Deleted)

-- Trigger: log_order_create
    -- When a new order is created, a log entry is created for that order
go

CREATE OR ALTER TRIGGER log_order_create
ON OrderTable
AFTER INSERT
AS
    BEGIN
        DECLARE @actorID char(6);
        DECLARE @affectedOrder int;

        select @actorID = initiator from inserted;
        select @affectedOrder = rxNum from inserted;

        INSERT INTO LogTable (timeLogged, actorID, affectedOrder, actionLogged)
        VALUES (GETDATE(),@actorID , @affectedOrder , 'Created');
        --initiator is the userId for the Technition sending in the original order, rxNum is the orderID for the order.
        select * from LogTable;
    END;
go

--Trigger: log_order_print
--When a regular order gets printed we will log when it was printed

Create OR Alter TRIGGER log_order_print
On OrderTable
After UPDATE
AS
    BEGIN
        if (UPDATE(PrintStatusID))
            Begin
                DECLARE @STATUSID int;
                DECLARE @actorID char(6);
                DECLARE @affectedOrder int;
                DECLARE @PrintMessage varchar(50);
                DECLARE @PrintType varchar(50);

                select @actorID = verifier from inserted;
                select @affectedOrder = rxNum from inserted;
                select @STATUSID = PrintStatusID from inserted;

                select @PrintMessage = PrintMessage from PrintStatusTable where PrintStatusID = @STATUSID;
                select @PrintType = PrintType from PrintStatusTable where PrintStatusID = @STATUSID;

                INSERT INTO LogTable (timeLogged, actorID, affectedOrder, actionLogged)
                VALUES (GETDATE(), @actorID, @affectedOrder,@PrintType + ' - ' + @PrintMessage);
            end;
        
    end;
go