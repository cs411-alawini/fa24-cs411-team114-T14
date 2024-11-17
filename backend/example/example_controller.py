from flask import Blueprint, jsonify, request
from sqlalchemy import desc, func
from extensions import db
from data_models.Energy import Energy
from data_models.Climate import Climate
from data_models.Country import Country
from data_models.Economy import Economy
from data_models.UserInput import UserInput
from data_models.UserInfo import UserInfo

example_blueprint = Blueprint("country_example", __name__)


@example_blueprint.route("/country", methods=["GET"])
def get_country():
    countries = db.session.query(Country).all()
    return jsonify([country.as_dict() for country in countries])


@example_blueprint.route("/climate", methods=["GET"])
def get_climate():
    climates = db.session.query(Climate).all()
    return jsonify([climate.as_dict() for climate in climates])


@example_blueprint.route("/energy", methods=["GET"])
def get_energy():
    energies = db.session.query(Energy).all()
    return jsonify([energy.as_dict() for energy in energies])


@example_blueprint.route("/economy", methods=["GET"])
def get_economy():
    economies = db.session.query(Economy).all()
    return jsonify([economy.as_dict() for economy in economies])


@example_blueprint.route("/userinfo", methods=["GET"])
def get_userinfo():
    userinfo = db.session.query(UserInfo).all()
    return jsonify([user.as_dict() for user in userinfo])


@example_blueprint.route("/userinput", methods=["GET"])
def get_userinput():
    userinfo = db.session.query(UserInput).limit(10).all()
    return jsonify([user.as_dict() for user in userinfo])


@example_blueprint.route("/averageClimateRatingOfCountry", methods=["GET"])
def get_average_climate_rating_of_country():
    """
    Calculate country's average climate rating for users who have visited that country in a specific time range.
    URL format: /averageClimateRatingOfCountry?date_visited_from=2014-01-01&date_visited_to=2018-01-01
    Query:
    SELECT Country.Name,
        AVG(ClimateRating) AS AvgClimateRating
    FROM UserInput
        JOIN Country ON UserInput.CountryID = Country.CountryID
    WHERE DateVisitedFrom > '2014-01-01'
        AND DateVisitedTo < '2018-01-01'
    GROUP BY Country.Name
    ORDER BY AvgClimateRating DESC
    """
    date_visited_from = request.args.get("date_visited_from")
    date_visited_to = request.args.get("date_visited_to")
    average_climate_rating_of_country = (
        db.session.query(
            Country.Name, func.avg(UserInput.ClimateRating).label("AvgClimateRating")
        )
        .join(Country, UserInput.CountryID == Country.CountryID)
        .filter(UserInput.DateVisitedFrom > date_visited_from)
        .filter(UserInput.DateVisitedTo < date_visited_to)
        .group_by(Country.Name)
        .order_by(func.avg(UserInput.ClimateRating).desc())
        .all()
    )
    return jsonify(
        [
            {"Country": country, "AvgClimateRating": avg_climate_rating}
            for country, avg_climate_rating in average_climate_rating_of_country
        ]
    )


@example_blueprint.route("/energyDeficitPerCountry", methods=["GET"])
def get_energy_deficit_per_country():
    """
    Calculate the energy deficit per country.
    Query:
    SELECT Country.Name,
        SUM(EnergyConsumption) - SUM(EnergyProduction) AS EnergyDeficit
    FROM Energy
        JOIN Country ON Energy.CountryID = Country.CountryID
    GROUP BY Country.Name
    ORDER BY EnergyDeficit DESC
    """
    energy_deficit_per_country = (
        db.session.query(
            Country.Name,
            (
                func.sum(Energy.EnergyConsumption) - func.sum(Energy.EnergyProduction)
            ).label("EnergyDeficit"),
        )
        .join(Country, Energy.CountryID == Country.CountryID)
        .group_by(Country.Name)
        .order_by(desc("EnergyDeficit"))
        .all()
    )
    return jsonify(
        [
            {"Country": country, "EnergyDeficit": energy_deficit}
            for country, energy_deficit in energy_deficit_per_country
        ]
    )


@example_blueprint.route("/usersFavouriteCountryByClimateRating", methods=["GET"])
def get_users_favourite_country_by_climate_rating():
    """
    Users favourite country by climate rating.
    Query:
    SELECT UserInfo.Username,
        Country.Name
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
    ORDER BY UserInfo.Username
    """
    user_max_climate_rating = (
        db.session.query(
            UserInput.UserID,
            func.max(UserInput.ClimateRating).label("MaxClimateRating"),
        )
        .group_by(UserInput.UserID)
        .subquery()
    )
    users_favourite_country_by_climate_rating = (
        db.session.query(UserInfo.Username, Country.Name)
        .select_from(user_max_climate_rating)
        .join(
            UserInput,
            (user_max_climate_rating.c.UserID == UserInput.UserID)
            & (user_max_climate_rating.c.MaxClimateRating == UserInput.ClimateRating),
        )
        .join(UserInfo, UserInput.UserID == UserInfo.UserID)
        .join(Country, UserInput.CountryID == Country.CountryID)
        .order_by(UserInfo.Username)
        .all()
    )
    return jsonify(
        [
            {"Username": username, "Country": country}
            for username, country in users_favourite_country_by_climate_rating
        ]
    )


@example_blueprint.route("/countryWithGreaterAvgCO2AndForestedArea", methods=["GET"])
def get_country_with_greater_avg_co2_and_forested_area():
    """
    Get countries with greater than global average co2 emissions and forested area.
    Query:
    SELECT c.CountryID,
        c.Name,
        c.Population,
        c.LandAreaKm2,
        c.DensityPerKm2,
        cl.CO2Emissions
    FROM Country c
        JOIN Climate cl ON c.CountryID = cl.CountryID
    WHERE cl.CO2Emissions > (
            SELECT AVG(CO2Emissions)
            FROM Climate
        )
        AND cl.ForestedAreaPercent > (
            SELECT AVG(ForestedAreaPercent)
            FROM Climate
        )
    ORDER BY cl.CO2Emissions DESC
    """
    avg_co2_emissions = db.session.query(func.avg(Climate.CO2Emissions)).scalar()
    avg_forested_area = db.session.query(func.avg(Climate.ForestedAreaPercent)).scalar()
    country_with_greater_avg_co2_and_forested_area = (
        db.session.query(
            Country.CountryID,
            Country.Name,
            Country.Population,
            Country.LandAreaKm2,
            Country.DensityPerKm2,
            Climate.CO2Emissions,
        )
        .join(Climate, Country.CountryID == Climate.CountryID)
        .filter(
            Climate.CO2Emissions > avg_co2_emissions,
            Climate.ForestedAreaPercent > avg_forested_area,
        )
        .order_by(Climate.CO2Emissions.desc())
        .all()
    )
    return jsonify(
        [
            {
                "CountryID": country_id,
                "Country": country,
                "Population": population,
                "LandAreaKm2": land_area_km2,
                "DensityPerKm2": density_per_km2,
                "CO2Emissions": co2_emissions,
            }
            for country_id, country, population, land_area_km2, density_per_km2, co2_emissions in country_with_greater_avg_co2_and_forested_area
        ]
    )
