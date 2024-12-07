from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import text
from extensions import db

country_details_blueprint = Blueprint("country_details", __name__)


def process_rating(rating):
    return round(float(rating), 2) if rating is not None else None


@country_details_blueprint.route("/country/<string:name>", methods=["GET"])
@jwt_required()
def get_country_details(name: str):
    country = db.session.execute(
        text(
            """ SELECT CountryID, Name, Population, CapitalCity, LargestCity, OfficialLanguage
                FROM Country
                WHERE Name LIKE :name"""
        ),
        {"name": name},
    ).first()

    if not country:
        return jsonify({"message": "Country not found"}), 404

    country_id = country[0]
    country_as_dict = {
        "Name": country[1],
        "Population": country[2],
        "CapitalCity": country[3],
        "LargestCity": country[4],
        "OfficialLanguage": country[5],
    }
    climate = db.session.execute(
        text(
            """ SELECT CountryID, AgriculturalLandPercent, ForestedAreaPercent, CO2Emissions
                FROM Climate
                WHERE CountryID = :country_id"""
        ),
        {"country_id": country_id},
    ).first()
    climate_as_dict = {
        "CountryID": climate[0],
        "AgriculturalLandPercent": climate[1],
        "ForestedAreaPercent": climate[2],
        "CO2Emissions": climate[3],
    }
    economy = db.session.execute(
        text(
            """ SELECT CountryID, GDP, CPI, CurrencyCode, MinimumWage, 
                    UnemploymentRate, TaxRevenuePercent, TotalTaxRate, GasolinePrice,
                    OutOfPocketHealthExpenditurePercent, GrossPrimaryEducationEnrollmentPercent,
                    GrossTertiaryEducationEnrollmentPercent
                FROM Economy
                WHERE CountryID = :country_id"""
        ),
        {"country_id": country_id},
    ).first()
    economy_as_dict = {
        "CountryID": economy[0],
        "GDP": economy[1],
        "CPI": economy[2],
        "CurrencyCode": economy[3],
        "MinimumWage": economy[4],
        "UnemploymentRate": economy[5],
        "TaxRevenuePercent": economy[6],
        "TotalTaxRate": economy[7],
        "GasolinePrice": economy[8],
        "OutOfPocketHealthExpenditurePercent": economy[9],
        "GrossPrimaryEducationEnrollmentPercent": economy[10],
        "GrossTertiaryEducationEnrollmentPercent": economy[11],
    }
    average_rating = db.session.execute(
        text(
            """ SELECT AVG(FoodRating) AS avg_food_rating, AVG(HospitalRating) AS avg_hospital_rating,
                    AVG(ClimateRating) AS avg_climate_rating, AVG(TourismRating) AS avg_tourism_rating,
                    AVG(SafetyRating) AS avg_safety_rating, AVG(CostOfLivingRating) AS avg_cost_of_living_rating,
                    AVG(CultureEntertainmentRating) AS avg_culture_entertainment_rating,
                    AVG(InfrastructureRating) AS avg_infrastructure_rating, AVG(HealthcareRating) AS avg_healthcare_rating
                FROM UserInput
                WHERE CountryID = :country_id"""
        ),
        {"country_id": country_id},
    ).first()
    average_ratings_as_dict = {
        "food_rating": process_rating(average_rating[0]),
        "hospital_rating": process_rating(average_rating[1]),
        "climate_rating": process_rating(average_rating[2]),
        "tourism_rating": process_rating(average_rating[3]),
        "safety_rating": process_rating(average_rating[4]),
        "cost_of_living_rating": process_rating(average_rating[5]),
        "culture_entertainment_rating": process_rating(average_rating[6]),
        "infrastructure_rating": process_rating(average_rating[7]),
        "healthcare_rating": process_rating(average_rating[8]),
    }

    response_data = {
        "country": country_as_dict,
        "climate": climate_as_dict,
        "economy": economy_as_dict,
        "average_ratings": average_ratings_as_dict,
    }

    return jsonify(response_data), 200
