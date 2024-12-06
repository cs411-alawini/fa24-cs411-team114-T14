# controllers/demographic_controller.py

from flask import Blueprint, jsonify
from sqlalchemy import func
from extensions import db
from data_models.Country import Country
from data_models.Climate import Climate
from data_models.Economy import Economy
from data_models.UserInput import UserInput  # Import the UserInput model

country_details_blueprint = Blueprint("country_details", __name__)


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
            "food_rating": round(float(average_ratings.avg_food_rating), 2) if average_ratings.avg_food_rating else None,
            "hospital_rating": round(float(average_ratings.avg_hospital_rating), 2) if average_ratings.avg_hospital_rating else None,
            "climate_rating": round(float(average_ratings.avg_climate_rating), 2) if average_ratings.avg_climate_rating else None,
            "tourism_rating": round(float(average_ratings.avg_tourism_rating), 2) if average_ratings.avg_tourism_rating else None,
            "safety_rating": round(float(average_ratings.avg_safety_rating), 2) if average_ratings.avg_safety_rating else None,
            "cost_of_living_rating": round(float(average_ratings.avg_cost_of_living_rating), 2) if average_ratings.avg_cost_of_living_rating else None,
            "culture_entertainment_rating": round(float(average_ratings.avg_culture_entertainment_rating), 2) if average_ratings.avg_culture_entertainment_rating else None,
            "infrastructure_rating": round(float(average_ratings.avg_infrastructure_rating), 2) if average_ratings.avg_infrastructure_rating else None,
            "healthcare_rating": round(float(average_ratings.avg_healthcare_rating), 2) if average_ratings.avg_healthcare_rating else None,
        }
    }

    return jsonify(response_data), 200