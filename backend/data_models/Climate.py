from extensions import db
from data_models.Country import Country


class Climate(db.Model):
    __tablename__ = "Climate"
    CountryID = db.Column(db.Integer, db.ForeignKey(Country.CountryID), primary_key=True)
    AgriculturalLandPercent = db.Column(db.Numeric(10, 0))
    ForestedAreaPercent = db.Column(db.Numeric(10, 0))
    CO2Emissions = db.Column(db.Numeric(10, 0))

    def __repr__(self) -> str:
        return f"Climate('{self.CountryID}', '{self.AgriculturalLandPercent}, {self.ForestedAreaPercent}, {self.CO2Emissions}')"

    def as_dict(self):
        return {
            "CountryID": self.CountryID,
            "AgriculturalLandPercent": self.AgriculturalLandPercent,
            "ForestedAreaPercent": self.ForestedAreaPercent,
            "CO2Emissions": self.CO2Emissions,
        }
