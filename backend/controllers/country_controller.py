from flask import Blueprint, jsonify
from sqlalchemy import text
from extensions import db

country_blueprint = Blueprint("country", __name__)


@country_blueprint.route("/citizenships", methods=["GET"])
def get_citizenships():
    citizenships = db.session.execute(
        text("SELECT CountryID, Name FROM Country")
    ).fetchall()
    return jsonify(
        {country_name: country_id for country_id, country_name in citizenships}
    )
