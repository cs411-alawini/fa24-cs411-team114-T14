from extensions import db
from data_models.Country import Country


class UserInfo(db.Model):
    __tablename__ = "UserInfo"
    UserID = db.Column(db.Integer, primary_key=True)
    Username = db.Column(db.String(50))
    Password = db.Column(db.String(50))
    Email = db.Column(db.String(100))
    PrimaryCitizenshipID = db.Column(db.Integer, db.ForeignKey(Country.CountryID))

    def __repr__(self) -> str:
        return f"UserInfo('{self.Username}', '{self.Email}')"

    def as_dict(self):
        return {
            "Username": self.Username,
            "Email": self.Email,
            "PrimaryCitizenshipID": self.PrimaryCitizenshipID,
        }
