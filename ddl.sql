CREATE TABLE IF NOT EXISTS Country(
    CountryID INT PRIMARY KEY,
    Name VARCHAR(100) UNIQUE,
    Abbreviation VARCHAR(10),
    LandAreaKm2 DECIMAL,
    DensityPerKm2 DECIMAL,
    Population INT,
    CapitalCity VARCHAR(100),
    LargestCity VARCHAR(100),
    OfficialLanguage VARCHAR(100),
    LaborForceParticipationPercent DECIMAL,
    BirthRate DECIMAL,
    FertilityRate DECIMAL,
    InfantMortality DECIMAL,
    LifeExpectancy DECIMAL,
    MaternalMortalityRatio DECIMAL,
    UrbanPopulationPercent DECIMAL,
    PhysicianPerThousand DECIMAL,
    ArmedForcesSize INT,
    Latitude DECIMAL,
    Longitude DECIMAL,
    CallingCode VARCHAR(10)
);
-- @block
CREATE TABLE IF NOT EXISTS Climate(
    CountryID INT PRIMARY KEY,
    AgriculturalLandPercent DECIMAL,
    ForestedAreaPercent DECIMAL,
    CO2Emissions DECIMAL,
    FOREIGN KEY(CountryID) REFERENCES Country(CountryID) ON UPDATE CASCADE ON DELETE CASCADE
);
-- @block
CREATE TABLE IF NOT EXISTS Energy(
    CountryID INT,
    EnergyType VARCHAR(50),
    EnergyConsumption DECIMAL(20, 10),
    EnergyProduction DECIMAL(20, 10),
    PRIMARY KEY(CountryID, EnergyType),
    FOREIGN KEY(CountryID) REFERENCES Country(CountryID) ON UPDATE CASCADE ON DELETE CASCADE
);
-- @block
CREATE TABLE IF NOT EXISTS Economy(
    CountryID INT PRIMARY KEY,
    GDP DECIMAL(20, 0),
    CPI DECIMAL,
    CPIChangePercent DECIMAL,
    CurrencyCode VARCHAR(10),
    MinimumWage DECIMAL,
    UnemploymentRate DECIMAL,
    TaxRevenuePercent DECIMAL,
    TotalTaxRate DECIMAL,
    GasolinePrice DECIMAL,
    OutOfPocketHealthExpenditurePercent DECIMAL,
    GrossPrimaryEducationEnrollmentPercent DECIMAL,
    GrossTertiaryEducationEnrollmentPercent DECIMAL,
    FOREIGN KEY(CountryID) REFERENCES Country(CountryID) ON UPDATE CASCADE ON DELETE CASCADE
);
-- @block
CREATE TABLE IF NOT EXISTS UserInfo(
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) UNIQUE,
    `Password` VARCHAR(200),
    Email VARCHAR(100),
    isFrequent BOOLEAN DEFAULT FALSE,
    PrimaryCitizenshipID INT,
    FOREIGN KEY(PrimaryCitizenshipID) REFERENCES Country(CountryID) ON UPDATE CASCADE ON DELETE CASCADE
);
-- @block
CREATE TABLE IF NOT EXISTS UserInput(
    UserInputID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    CountryID INT,
    DateVisitedFrom DATE,
    DateVisitedTo DATE,
    FoodRating INT CHECK(
        FoodRating BETWEEN 1 AND 10
    ),
    HospitalRating INT CHECK(
        HospitalRating BETWEEN 1 AND 10
    ),
    ClimateRating INT CHECK(
        ClimateRating BETWEEN 1 AND 10
    ),
    TourismRating INT CHECK(
        TourismRating BETWEEN 1 AND 10
    ),
    SafetyRating INT CHECK(
        SafetyRating BETWEEN 1 AND 10
    ),
    CostOfLivingRating INT CHECK(
        CostOfLivingRating BETWEEN 1 AND 10
    ),
    CultureEntertainmentRating INT CHECK(
        CultureEntertainmentRating BETWEEN 1 AND 10
    ),
    InfrastructureRating INT CHECK(
        InfrastructureRating BETWEEN 1 AND 10
    ),
    HealthcareRating INT CHECK(
        HealthcareRating BETWEEN 1 AND 10
    ),
    Comments TEXT,
    CHECK(DateVisitedFrom < DateVisitedTo),
    FOREIGN KEY(UserID) REFERENCES UserInfo(UserID) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(CountryID) REFERENCES Country(CountryID) ON UPDATE CASCADE ON DELETE CASCADE
);