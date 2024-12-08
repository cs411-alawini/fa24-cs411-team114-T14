from typing import NamedTuple
from flask import Blueprint, jsonify, request
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


class AverageClimateRatingOfCountry(NamedTuple):
    country: str
    average_climate_rating: float


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


@ranking_blueprint.route("/average_climate_rating_of_country", methods=["GET"])
@jwt_required()
def get_average_climate_rating_of_country():
    date_visited_from = request.args.get("date_visited_from")
    date_visited_to = request.args.get("date_visited_to")
    average_climate_rating_of_country: list[AverageClimateRatingOfCountry] = (
        db.session.execute(
            text(
                """ SELECT Country.Name AS country,
                        SUM(
                            CASE
                            WHEN UserInfo.isFrequent = TRUE THEN ClimateRating * 2
                            ELSE ClimateRating
                            END
                        ) / SUM(
                            CASE
                            WHEN UserInfo.isFrequent = TRUE THEN 2
                            ELSE 1
                            END
                        ) AS average_climate_rating
                    FROM UserInput
                        JOIN Country ON UserInput.CountryID = Country.CountryID
                        JOIN UserInfo ON UserInput.UserID = UserInfo.UserID
                    WHERE DateVisitedFrom > '1900-01-01'
                        AND DateVisitedTo < '2100-01-01'
                    GROUP BY country
                    ORDER BY average_climate_rating DESC"""
            ),
            {
                "date_visited_from": date_visited_from,
                "date_visited_to": date_visited_to,
            },
        ).fetchall()
    )  # type: ignore
    response_data = [
        {"country": row.country, "averageClimateRating": row.average_climate_rating}
        for row in average_climate_rating_of_country
    ]
    return jsonify(response_data), 200
