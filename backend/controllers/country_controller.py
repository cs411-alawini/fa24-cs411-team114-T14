from flask import Blueprint, jsonify
from data_models.Country import Country
from extensions import db

country_blueprint = Blueprint("country", __name__)


@country_blueprint.route("/citizenships", methods=["GET"])
def get_citizenships():
    citizenships = db.session.query(Country.CountryID, Country.Name).all()
    return jsonify(
        {country_name: country_id for country_id, country_name in citizenships}
    )
