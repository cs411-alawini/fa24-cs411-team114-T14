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
