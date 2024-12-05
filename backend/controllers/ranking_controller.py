from typing import NamedTuple
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import Row, Sequence, text
from extensions import db

ranking_blueprint = Blueprint("ranking", __name__)


class EnergyDeficit(NamedTuple):
    country: str
    energy_deficit: float


class FavoriteClimateCountryCount(NamedTuple):
    country: str
    favorite_count: int


@ranking_blueprint.route("/ranking", methods=["GET"])
@jwt_required()
def get_ranking():
    energy_deficits: Sequence[Row[EnergyDeficit]] = db.session.execute(
        text(
            """ SELECT Name AS country,
                    SUM(EnergyConsumption) - SUM(EnergyProduction) AS energy_deficit
                FROM Energy
                    JOIN Country ON Energy.CountryID = Country.CountryID
                GROUP BY Name
                ORDER BY energy_deficit DESC"""
        )
    ).fetchall()  # type: ignore
    energy_deficit_list = [
        {"country": row.country, "energyDeficit": row.energy_deficit}
        for row in energy_deficits
    ]
    favorite_climate_country_counts: Sequence[
        Row[FavoriteClimateCountryCount]
    ] = db.session.execute(
        text(
            """ SELECT Name AS country,
                    COUNT(*) AS favorite_count
                FROM (
                        SELECT UserID,
                            MAX(ClimateRating) AS maxclimaterating
                        FROM UserInput
                        GROUP BY UserID
                    ) usermaxclimaterating
                    JOIN UserInput ON usermaxclimaterating.UserID = UserInput.UserID
                    AND usermaxclimaterating.maxclimaterating = UserInput.ClimateRating
                    JOIN UserInfo ON UserInput.UserID = UserInfo.UserID
                    JOIN Country ON UserInput.CountryID = Country.CountryID
                GROUP BY Country.Name
                ORDER BY favorite_count DESC"""
        )
    ).fetchall()  # type: ignore
    favorite_climate_list = [
        {"country": row.country, "favoriteCount": row.favorite_count}
        for row in favorite_climate_country_counts
    ]
    countries_with_poor_co2_emissions_and_forested_area: Sequence[
        Row[str]
    ] = db.session.execute(
        text(
            """ SELECT Country.Name AS country
                FROM Country
                    JOIN Climate ON Country.CountryID = Climate.CountryID
                WHERE Climate.CO2Emissions > (
                        SELECT AVG(CO2Emissions)
                        FROM Climate c
                    )
                    AND Climate.ForestedAreaPercent < (
                        SELECT AVG(ForestedAreaPercent)
                        FROM Climate c
                    )
                ORDER BY Climate.CO2Emissions DESC"""
        )
    ).fetchall()  # type: ignore
    response_data = {
        "energyDeficitPerCountry": energy_deficit_list,
        "favoriteClimateCountryCounts": favorite_climate_list,
        "countriesWithPoorCO2EmissionsAndForestedArea": [
            row[0] for row in countries_with_poor_co2_emissions_and_forested_area
        ],
    }
    return jsonify(response_data), 200
