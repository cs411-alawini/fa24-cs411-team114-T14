DELIMITER //

CREATE PROCEDURE CalculateCountriesWithWorstClimateImpact(IN startDate DATE, IN endDate DATE)
BEGIN
    DECLARE tCountryName VARCHAR(100);
    DECLARE tTotalRank DECIMAL(20, 10);
    DECLARE tLabel VARCHAR(25);
    DECLARE exit_loop BOOLEAN DEFAULT FALSE;

    DECLARE countryRankingsCursor CURSOR FOR (
        SELECT *
        FROM (
            SELECT CountryName,
                AVG(ClimateRank) AS TotalRank
            FROM (
                    SELECT CountryName,
                        RANK() OVER (
                            ORDER BY AvgClimateRating
                        ) AS ClimateRank
                    FROM (
                            SELECT Country.Name AS CountryName,
                                SUM(
                                    CASE
                                    WHEN UserInfo.isFrequent = TRUE THEN ClimateRating * 2
                                    ELSE ClimateRating
                                    END
                                ) / SUM(
                                    CASE
                                    WHEN UserInfo.isFrequent = TRUE THEN 2
                                    ELSE 1
                                    END
                                ) AS AvgClimateRating
                            FROM Country
                                LEFT JOIN UserInput ON UserInput.CountryID = Country.CountryID
                                LEFT JOIN UserInfo ON UserInput.UserID = UserInfo.UserID
                            WHERE DateVisitedFrom > startDate
                            AND DateVisitedTo < endDate
                            GROUP BY CountryName
                        ) AvgClimateRatings
                    UNION
                    SELECT CountryName,
                        RANK() OVER (
                            ORDER BY EnergyDeficit DESC
                        ) AS ClimateRank
                    FROM (
                            SELECT Country.Name AS CountryName,
                                SUM(EnergyConsumption) - SUM(EnergyProduction) AS EnergyDeficit
                            FROM Energy
                                JOIN Country ON Energy.CountryID = Country.CountryID
                            GROUP BY Country.Name
                        ) EnergyDeficitRankings
                    UNION
                    SELECT CountryName,
                        RANK() OVER (
                            ORDER BY CO2Emissions DESC
                        ) AS ClimateRank
                    FROM (
                            SELECT Country.Name AS CountryName,
                                Climate.CO2Emissions
                            FROM Country
                                JOIN Climate ON Country.CountryID = Climate.CountryID
                            WHERE Climate.CO2Emissions > (
                                    SELECT AVG(CO2Emissions)
                                    FROM Climate c
                                )
                                AND Climate.ForestedAreaPercent > (
                                    SELECT AVG(ForestedAreaPercent)
                                    FROM Climate c
                                )
                        ) HighClimateImpactCountries
                ) aggregatedRanks
            GROUP BY CountryName
        ) countryRankings
    );
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET exit_loop = TRUE;

    DROP TABLE IF EXISTS LabelledRankings;
    CREATE TABLE LabelledRankings(
        CountryName VARCHAR(100),
        Label VARCHAR(25)
    );

    OPEN countryRankingsCursor;
    countryRankingsLoop: LOOP
        FETCH countryRankingsCursor INTO tCountryName, tTotalRank;
        IF exit_loop THEN
            LEAVE countryRankingsLoop;
        END IF;

        IF tTotalRank <= 50 THEN
            SET tLabel = 'High climate impact';
        ELSEIF tTotalRank <= 100 THEN
            SET tLabel = 'Medium climate impact';
        ELSE
            SET tLabel = 'Low climate impact';
        END IF;

        INSERT INTO LabelledRankings(CountryName, Label)
        VALUES(tCountryName, tLabel);
    END LOOP countryRankingsLoop;
    CLOSE countryRankingsCursor;

    SELECT *
    FROM LabelledRankings;
END;
//

DELIMITER ;

CALL CalculateCountriesWithWorstClimateImpact('2014-01-01', '2018-01-01');
DROP PROCEDURE CalculateCountriesWithWorstClimateImpact;
