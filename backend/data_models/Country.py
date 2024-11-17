from extensions import db


class Country(db.Model):
    __tablename__ = "Country"
    CountryID = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String(100), unique=True)
    Abbreviation = db.Column(db.String(10))
    LandAreaKm2 = db.Column(db.Numeric(10, 0))
    DensityPerKm2 = db.Column(db.Numeric(10, 0))
    Population = db.Column(db.Integer)
    CapitalCity = db.Column(db.String(100))
    LargestCity = db.Column(db.String(100))
    OfficialLanguage = db.Column(db.String(100))
    LaborForceParticipationPercent = db.Column(db.Numeric(10, 0))
    BirthRate = db.Column(db.Numeric(10, 0))
    FertilityRate = db.Column(db.Numeric(10, 0))
    InfantMortality = db.Column(db.Numeric(10, 0))
    LifeExpectancy = db.Column(db.Numeric(10, 0))
    MaternalMortalityRatio = db.Column(db.Numeric(10, 0))
    UrbanPopulationPercent = db.Column(db.Numeric(10, 0))
    PhysicianPerThousand = db.Column(db.Numeric(10, 0))
    ArmedForcesSize = db.Column(db.Integer)
    Latitude = db.Column(db.Numeric(10, 0))
    Longitude = db.Column(db.Numeric(10, 0))
    CallingCode = db.Column(db.String(10))

    def __repr__(self):
        return f"Country('{self.Name}', '{self.Abbreviation}')"

    def as_dict(self):
        return {
            "Name": self.Name,
            "Population": self.Population,
            "CapitalCity": self.CapitalCity,
            "LargestCity": self.LargestCity,
            "OfficialLanguage": self.OfficialLanguage,
        }
