-- @block
SELECT *
FROM Country;
SELECT *
FROM Climate;
SELECT *
FROM Economy;
SELECT *
FROM Energy;
SELECT *
FROM UserInfo;
SELECT *
FROM userinput;
-- @block
SELECT Country.Name,
    AVG(ClimateRating) AS AvgClimateRating
FROM UserInput
    JOIN Country ON UserInput.CountryID = Country.CountryID
WHERE DateVisitedFrom > '2014-01-01'
    AND DateVisitedTo < '2018-01-01'
GROUP BY Country.Name
ORDER BY AvgClimateRating DESC
LIMIT 15;
-- @block
CREATE INDEX IF NOT EXISTS DateVisitedFromIndex ON UserInput(DateVisitedFrom);
CREATE INDEX IF NOT EXISTS DateVisitedToIndex ON UserInput(DateVisitedTo);
CREATE INDEX IF NOT EXISTS CountryNameIndex ON Country(Name);
-- @block
SELECT Country.Name,
    SUM(EnergyConsumption) - SUM(EnergyProduction) AS EnergyDeficit
FROM Energy
    JOIN Country ON Energy.CountryID = Country.CountryID
GROUP BY Country.Name
ORDER BY EnergyDeficit DESC
LIMIT 15;
-- @block
CREATE INDEX IF NOT EXISTS CountryNameIndex ON Country(Name);
CREATE INDEX IF NOT EXISTS EnergyNameIndex ON Energy(CountryID);
CREATE INDEX IF NOT EXISTS EnergyConsumptionIndex ON Energy(EnergyConsumption);
CREATE INDEX IF NOT EXISTS EnergyProductionIndex ON Energy(EnergyProduction);
-- @block
SELECT UserInfo.Username,
    Country.Name
FROM (
        SELECT UserID,
            MAX(ClimateRating) AS maxclimaterating
        FROM UserInput
        GROUP BY UserID
    ) usermaxclimaterating
    JOIN UserInput ON usermaxclimaterating.UserID = UserInput.UserID
    AND usermaxclimaterating.maxclimaterating = UserInput.ClimateRating
    JOIN UserInfo ON UserInput.UserID = UserInfo.UserID
    JOIN Country ON UserInput.CountryID = Country.CountryID
ORDER BY UserInfo.Username
LIMIT 15;
-- @block
CREATE INDEX IF NOT EXISTS ClimateRatingIndex ON UserInput(ClimateRating);
CREATE INDEX IF NOT EXISTS UserIDIndex ON UserInput(UserID);
-- @block
SELECT c.CountryID,
    c.Name,
    c.Population,
    c.LandAreaKm2,
    c.DensityPerKm2,
    cl.CO2Emissions
FROM Country c
    JOIN Climate cl ON c.CountryID = cl.CountryID
WHERE cl.CO2Emissions > (
        SELECT AVG(CO2Emissions)
        FROM Climate
    )
    AND cl.ForestedAreaPercent > (
        SELECT AVG(ForestedAreaPercent)
        FROM Climate
    )
ORDER BY cl.CO2Emissions DESC
LIMIT 15;
-- @block
CREATE INDEX IF NOT EXISTS CO2EmissionsIndex ON Climate(CO2Emissions);
CREATE INDEX IF NOT EXISTS ForestedAreaPercentIndex ON Climate(ForestedAreaPercent);
