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
CREATE TRIGGER log_order_create
AFTER INSERT ON OrderTable
FOR EACH ROW
BEGIN
    INSERT INTO OrderLog (timeLogged, actorID, affectedOrder, actionLogged)
    VALUES (NOW(), NEW.userID, NEW.orderID, 'Created');
END;

-- Trigger: log_order_amend
    -- When an order is amended, a log entry is created for that order
    -- This does not include status changes, those are logged separately
CREATE TRIGGER log_order_amend
AFTER UPDATE ON OrderTable
FOR EACH ROW
BEGIN
    INSERT INTO OrderLog (timeLogged, actorID, affectedOrder, actionLogged)
    VALUES (NOW(), NEW.userID, NEW.orderID, 'Updated');
END;
