# controllers/demographic_controller.py
from flask import Blueprint, jsonify
from sqlalchemy import func
from extensions import db
from data_models.Country import Country
from data_models.Climate import Climate
from data_models.Economy import Economy
from data_models.UserInput import UserInput  # Import the UserInput model

country_details_blueprint = Blueprint("country_details", __name__)

def process_rating(rating):
    return round(float(rating), 2) if rating is not None else None

@country_details_blueprint.route("/country/<string:name>", methods=["GET"])
def get_country_details(name):
    # Fetch the country by name (case-insensitive)
    country = db.session.query(Country).filter(Country.Name.ilike(name)).first()

    if not country:
        return jsonify({"message": "Country not found"}), 404

    # Fetch related climate data
    climate = db.session.query(Climate).filter_by(CountryID=country.CountryID).first()

    # Fetch related economy data
    economy = db.session.query(Economy).filter_by(CountryID=country.CountryID).first()

    # Calculate average ratings from user inputs
    average_ratings = db.session.query(
        func.avg(UserInput.FoodRating).label('avg_food_rating'),
        func.avg(UserInput.HospitalRating).label('avg_hospital_rating'),
        func.avg(UserInput.ClimateRating).label('avg_climate_rating'),
        func.avg(UserInput.TourismRating).label('avg_tourism_rating'),
        func.avg(UserInput.SafetyRating).label('avg_safety_rating'),
        func.avg(UserInput.CostOfLivingRating).label('avg_cost_of_living_rating'),
        func.avg(UserInput.CultureEntertainmentRating).label('avg_culture_entertainment_rating'),
        func.avg(UserInput.InfrastructureRating).label('avg_infrastructure_rating'),
        func.avg(UserInput.HealthcareRating).label('avg_healthcare_rating'),
    ).filter(UserInput.CountryID == country.CountryID).first()

    # Construct the response
    response_data = {
        "country": country.as_dict() if country else {},
        "climate": climate.as_dict() if climate else {},
        "economy": economy.as_dict() if economy else {},
        "average_ratings": {
            "food_rating": process_rating(average_ratings.avg_food_rating),
            "hospital_rating": process_rating(average_ratings.avg_hospital_rating),
            "climate_rating": process_rating(average_ratings.avg_climate_rating),
            "tourism_rating": process_rating(average_ratings.avg_tourism_rating),
            "safety_rating": process_rating(average_ratings.avg_safety_rating),
            "cost_of_living_rating": process_rating(average_ratings.avg_cost_of_living_rating),
            "culture_entertainment_rating": process_rating(average_ratings.avg_culture_entertainment_rating),
            "infrastructure_rating": process_rating(average_ratings.avg_infrastructure_rating),
            "healthcare_rating": process_rating(average_ratings.avg_healthcare_rating),
        }
    }

    return jsonify(response_data), 200