from extensions import db
from data_models.Country import Country
from data_models.UserInfo import UserInfo


class UserInput(db.Model):
    __tablename__ = "UserInput"
    UserInputID = db.Column(db.Integer, primary_key=True)
    UserID = db.Column(db.Integer, db.ForeignKey(UserInfo.UserID))
    CountryID = db.Column(db.Integer, db.ForeignKey(Country.CountryID))
    DateVisitedFrom = db.Column(db.DateTime)
    DateVisitedTo = db.Column(db.DateTime)
    FoodRating = db.Column(db.Integer)
    HospitalRating = db.Column(db.Integer)
    ClimateRating = db.Column(db.Integer)
    TourismRating = db.Column(db.Integer)
    SafetyRating = db.Column(db.Integer)
    CostOfLivingRating = db.Column(db.Integer)
    CultureEntertainmentRating = db.Column(db.Integer)
    InfrastructureRating = db.Column(db.Integer)
    HealthcareRating = db.Column(db.Integer)
    Comments = db.Column(db.Text)

    def __repr__(self) -> str:
        return f"UserInput('{self.UserID}', '{self.CountryID}', '{self.DateVisitedFrom}', '{self.DateVisitedTo}')"

    def as_dict(self):
        return {
            "UserID": self.UserID,
            "CountryID": self.CountryID,
            "DateVisitedFrom": self.DateVisitedFrom,
            "DateVisitedTo": self.DateVisitedTo,
            "FoodRating": self.FoodRating,
            "HospitalRating": self.HospitalRating,
            "ClimateRating": self.ClimateRating,
            "TourismRating": self.TourismRating,
            "SafetyRating": self.SafetyRating,
            "CostOfLivingRating": self.CostOfLivingRating,
            "CultureEntertainmentRating": self.CultureEntertainmentRating,
            "InfrastructureRating": self.InfrastructureRating,
            "HealthcareRating": self.HealthcareRating,
            "Comments": self.Comments,
        }
