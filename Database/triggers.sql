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


--THIS DOESN"T FULLY WORK YET JUST MADE IT INSERTABLE
-- Trigger: log_order_amend
    -- When an order is amended, a log entry is created for that order
    -- This does not include status changes, those are logged separately
CREATE OR ALTER TRIGGER log_order_amend
ON OrderTable
AFTER UPDATE
AS
    Begin
        DECLARE @actorID char(6);
        DECLARE @affectedOrder int;

        select @actorID = initiator from inserted;
        select @affectedOrder = rxNum from inserted;

        INSERT INTO LogTable (timeLogged, actorID, affectedOrder, actionLogged)
        VALUES (GETDATE(), @actorID, @affectedOrder, 'Amend');
        --initiator is the userId for the Technition sending in the original order, rxNum is the orderID for the order.
    end;
GO
