from flask import Blueprint, jsonify
from sqlalchemy import text
from extensions import db
from data_models.Country import Country
from data_models.Climate import Climate
from data_models.Economy import Economy

country_details_blueprint = Blueprint("country_details", __name__)

@country_details_blueprint.route("/country/<string:name>", methods=["GET"])
def get_country_details(name):
    # Fetch the country by name
    country = db.session.query(Country).filter_by(Name=name).first()

    if not country:
        return jsonify({"message": "Country not found"}), 404

    # Fetch related climate data
    climate = db.session.query(Climate).filter_by(CountryID=country.CountryID).first()

    # Fetch related economy data
    economy = db.session.query(Economy).filter_by(CountryID=country.CountryID).first()

    # Construct the response
    response_data = {
        "country": country.as_dict() if country else {},
        "climate": climate.as_dict() if climate else {},
        "economy": economy.as_dict() if economy else {},
    }

    return jsonify(response_data), 200
