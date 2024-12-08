-- As inserts can happen between the two selects,
-- we need to prevent phantom reads by using SERIALIZABLE isolation level
DELIMITER // 
CREATE PROCEDURE InsertUserInputWithOverlapValidation(
    IN tUserID INT,
    IN tCountryID INT,
    IN tDateVisitedFrom DATE,
    IN tDateVisitedTo DATE,
    IN tFoodRating INT,
    IN tHospitalRating INT,
    IN tClimateRating INT,
    IN tTourismRating INT,
    IN tSafetyRating INT,
    IN tCostOfLivingRating INT,
    IN tCultureEntertainmentRating INT,
    IN tInfrastructureRating INT,
    IN tHealthcareRating INT,
    IN tComments TEXT
) 
InsertUserInputWithOverlapValidationLabel: BEGIN
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; 
    START TRANSACTION;
    SELECT Country.Name INTO @overlappingCountryNames
    FROM UserInput
        JOIN Country ON UserInput.CountryID = Country.CountryID
    WHERE tDateVisitedFrom <= DateVisitedTo 
        AND tDateVisitedTo >= DateVisitedFrom 
        AND tUserID = UserID
    GROUP BY Country.Name,
        Country.CountryID
    HAVING Country.CountryID != tCountryID;

    IF FOUND_ROWS() > 0 THEN
        SELECT 2, 'Overlap detected with other countries and cannot be inserted';
        SELECT @overlappingCountryNames;
        ROLLBACK;
        LEAVE InsertUserInputWithOverlapValidationLabel;
    END IF;

    SELECT Country.Name,
        Country.CountryID,
        COUNT(*) AS COUNT,
        MIN(DateVisitedFrom) AS MinDateVisitedFrom,
        MAX(DateVisitedTo) AS MaxDateVisitedTo 
    INTO @overlappingCountryName, @overlappingCountryID, @overlappingCount, @overlappingMinDateVisitedFrom, @overlappingMaxDateVisitedTo
    FROM UserInput
        JOIN Country ON UserInput.CountryID = Country.CountryID
    WHERE tDateVisitedFrom <= DateVisitedTo 
        AND tDateVisitedTo >= DateVisitedFrom 
        AND tUserID = UserID
    GROUP BY Country.Name,
        Country.CountryID
    HAVING Country.CountryID = tCountryID;

    IF FOUND_ROWS() = 0 THEN
        SELECT 0, 'No overlap detected and can be inserted';
        INSERT INTO UserInput(
            UserID,
            CountryID,
            DateVisitedFrom,
            DateVisitedTo,
            FoodRating,
            HospitalRating,
            ClimateRating,
            TourismRating,
            SafetyRating,
            CostOfLivingRating,
            CultureEntertainmentRating,
            InfrastructureRating,
            HealthcareRating,
            Comments
        ) VALUES (
            tUserID,
            tCountryID,
            tDateVisitedFrom,
            tDateVisitedTo,
            tFoodRating,
            tHospitalRating,
            tClimateRating,
            tTourismRating,
            tSafetyRating,
            tCostOfLivingRating,
            tCultureEntertainmentRating,
            tInfrastructureRating,
            tHealthcareRating,
            tComments
        );
        COMMIT;
        LEAVE InsertUserInputWithOverlapValidationLabel;
    END IF;

    IF DATEDIFF(@overlappingMinDateVisitedFrom, tDateVisitedFrom) >= 2 THEN
        SET tDateVisitedTo = DATE_SUB(@overlappingMinDateVisitedFrom, INTERVAL 1 DAY);
    ELSEIF DATEDIFF(tDateVisitedTo, @overlappingMaxDateVisitedTo) >= 2 THEN
        SET tDateVisitedFrom = DATE_ADD(@overlappingMaxDateVisitedTo, INTERVAL 1 DAY);
    ELSE
        SELECT 3, 'Overlap detected with the same country and cannot be inserted';
        SELECT @overlappingCountryName;
        ROLLBACK;
        LEAVE InsertUserInputWithOverlapValidationLabel;
    END IF;

    INSERT INTO UserInput(
        UserID,
        CountryID,
        DateVisitedFrom,
        DateVisitedTo,
        FoodRating,
        HospitalRating,
        ClimateRating,
        TourismRating,
        SafetyRating,
        CostOfLivingRating,
        CultureEntertainmentRating,
        InfrastructureRating,
        HealthcareRating,
        Comments
    ) VALUES (
        tUserID,
        tCountryID,
        tDateVisitedFrom,
        tDateVisitedTo,
        tFoodRating,
        tHospitalRating,
        tClimateRating,
        tTourismRating,
        tSafetyRating,
        tCostOfLivingRating,
        tCultureEntertainmentRating,
        tInfrastructureRating,
        tHealthcareRating,
        tComments
    );
    COMMIT;
    SELECT 0, 'Overlap detected with the same country but time interval was adjusted';
END;
// 

DELIMITER ;

-- @block
DELETE FROM UserInput WHERE UserID = 1001;
CALL InsertUserInputWithOverlapValidation(1001, 2, '2014-01-01', '2014-01-02', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'test');
CALL InsertUserInputWithOverlapValidation(1001, 2, '2014-01-02', '2014-01-03', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'test');
CALL InsertUserInputWithOverlapValidation(1001, 3, '2014-01-02', '2014-01-03', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'test');
CALL InsertUserInputWithOverlapValidation(1001, 3, '2014-01-03', '2014-01-04', 1, 1, 1, 1, 1, 1, 1, 1, 1, 'test');
-- @block
DROP PROCEDURE InsertUserInputWithOverlapValidation;
