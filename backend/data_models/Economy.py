from extensions import db
from data_models.Country import Country


class Economy(db.Model):
    __tablename__ = "Economy"
    CountryID = db.Column(db.Integer, db.ForeignKey(Country.CountryID), primary_key=True)
    GDP = db.Column(db.Numeric(10, 0))
    CPI = db.Column(db.Numeric(10, 0))
    CPIChangePercent = db.Column(db.Numeric(10, 0))
    CurrencyCode = db.Column(db.String(10))
    MinimumWage = db.Column(db.Numeric(10, 0))
    UnemploymentRate = db.Column(db.Numeric(10, 0))
    TaxRevenuePercent = db.Column(db.Numeric(10, 0))
    TotalTaxRate = db.Column(db.Numeric(10, 0))
    GasolinePrice = db.Column(db.Numeric(10, 0))
    OutOfPocketHealthExpenditurePercent = db.Column(db.Numeric(10, 0))
    GrossPrimaryEducationEnrollmentPercent = db.Column(db.Numeric(10, 0))
    GrossTertiaryEducationEnrollmentPercent = db.Column(db.Numeric(10, 0))

    def __repr__(self) -> str:
        return f"Economy('{self.CountryID}, '{self.GDP}', '{self.CurrencyCode}')"

    def as_dict(self):
        return {
            "CountryID": self.CountryID,
            "GDP": self.GDP,
            "CPI": self.CPI,
            "CurrencyCode": self.CurrencyCode,
            "MinimumWage": self.MinimumWage,
            "UnemploymentRate": self.UnemploymentRate,
            "TaxRevenuePercent": self.TaxRevenuePercent,
            "TotalTaxRate": self.TotalTaxRate,
            "GasolinePrice": self.GasolinePrice,
            "OutOfPocketHealthExpenditurePercent": self.OutOfPocketHealthExpenditurePercent,
            "GrossPrimaryEducationEnrollmentPercent": self.GrossPrimaryEducationEnrollmentPercent,
            "GrossTertiaryEducationEnrollmentPercent": self.GrossTertiaryEducationEnrollmentPercent,
        }
