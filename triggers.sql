DELIMITER //

CREATE TRIGGER UpdateIsFrequentInUserInfo
AFTER INSERT ON UserInput 
FOR EACH ROW 
BEGIN
    DECLARE visitCount INT;

    SELECT COUNT(*) INTO visitCount
    FROM UserInput
    WHERE UserID = NEW.UserID;

    IF visitCount >= 5 THEN
        UPDATE UserInfo
        SET isFrequent = TRUE
        WHERE UserID = NEW.UserID;
    END IF;
END;
//

DELIMITER ;

-- @block
DELIMITER //

CREATE TRIGGER PreventDurationOverlapInsert
BEFORE INSERT ON UserInput
FOR EACH ROW
BEGIN
    DECLARE overlapCount INT;
    SELECT COUNT(*) INTO overlapCount
    FROM UserInput
    WHERE DateVisitedFrom <= NEW.DateVisitedTo
        AND DateVisitedTo >= NEW.DateVisitedFrom
        AND UserID = NEW.UserID;
    IF overlapCount > 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Invalid DateVisitedFrom or DateVisitedTo for this UserID as overlap is not allowed';
    END IF;
END;
//

CREATE TRIGGER PreventDurationOverlapUpdate
BEFORE UPDATE ON UserInput
FOR EACH ROW
BEGIN
    DECLARE overlapCount INT;
    SELECT COUNT(*) INTO overlapCount
    FROM UserInput
    WHERE DateVisitedFrom <= NEW.DateVisitedTo
        AND DateVisitedTo >= NEW.DateVisitedFrom
        AND UserID = NEW.UserID;
    IF overlapCount > 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Invalid DateVisitedFrom or DateVisitedTo for this UserID as overlap is not allowed';
    END IF;
END;
//

DELIMITER ;
