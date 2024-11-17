from extensions import db
from data_models.Country import Country


class Energy(db.Model):
    __tablename__ = "Energy"
    CountryID = db.Column(db.Integer, db.ForeignKey(Country.CountryID), primary_key=True)
    EnergyType = db.Column(db.String(50), primary_key=True)
    EnergyConsumption = db.Column(db.Numeric(10, 0))
    EnergyProduction = db.Column(db.Numeric(10, 0))

    def __repr__(self) -> str:
        return f"Energy('{self.CountryID}', '{self.EnergyType}', '{self.EnergyConsumption}', '{self.EnergyProduction}')"

    def as_dict(self):
        return {
            "CountryID": self.CountryID,
            "EnergyType": self.EnergyType,
            "EnergyConsumption": self.EnergyConsumption,
            "EnergyProduction": self.EnergyProduction,
        }
