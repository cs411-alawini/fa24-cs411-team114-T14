from sqlalchemy.exc import IntegrityError
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import text
from extensions import db

user_input_blueprint = Blueprint("user_input", __name__)


@user_input_blueprint.route("/user_input", methods=["GET"])
@jwt_required()
def get_user_input():
    user_id = get_jwt_identity()
    user_inputs = db.session.execute(
        text(
            """ SELECT * 
                FROM UserInput 
                JOIN Country 
                    ON UserInput.CountryID = Country.CountryID 
                WHERE UserID = :user_id"""
        ),
        {"user_id": user_id},
    )
    return (
        jsonify(
            [
                {
                    "userInputID": user_input.UserInputID,
                    "userID": user_input.UserID,
                    "country": user_input.Name,
                    "dateVisitedFrom": f"{user_input.DateVisitedFrom:%B %d, %Y}",
                    "dateVisitedTo": f"{user_input.DateVisitedTo:%B %d, %Y}",
                    "foodRating": user_input.FoodRating,
                    "hospitalRating": user_input.HospitalRating,
                    "climateRating": user_input.ClimateRating,
                    "tourismRating": user_input.TourismRating,
                    "safetyRating": user_input.SafetyRating,
                    "costOfLivingRating": user_input.CostOfLivingRating,
                    "cultureEntertainmentRating": user_input.CultureEntertainmentRating,
                    "infrastructureRating": user_input.InfrastructureRating,
                    "healthcareRating": user_input.HealthcareRating,
                    "comments": user_input.Comments,
                }
                for user_input in user_inputs
            ]
        ),
        200,
    )


@user_input_blueprint.route("/user_input", methods=["POST"])
@jwt_required()
def post_user_input():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data:
        return {"message": "Invalid input"}, 400
    country_id = data.get("country")
    date_visited_from = data.get("dateVisitedFrom")
    date_visited_to = data.get("dateVisitedTo")
    food_rating = data.get("foodRating")
    hospital_rating = data.get("hospitalRating")
    climate_rating = data.get("climateRating")
    tourism_rating = data.get("tourismRating")
    safety_rating = data.get("safetyRating")
    cost_of_living_rating = data.get("costOfLivingRating")
    culture_entertainment_rating = data.get("cultureEntertainmentRating")
    infrastructure_rating = data.get("infrastructureRating")
    healthcare_rating = data.get("healthcareRating")
    comments = data.get("comments")
    if (
        not country_id
        or not date_visited_from
        or not date_visited_to
        or food_rating is None
        or hospital_rating is None
        or climate_rating is None
        or tourism_rating is None
        or safety_rating is None
        or cost_of_living_rating is None
        or culture_entertainment_rating is None
        or infrastructure_rating is None
        or healthcare_rating is None
        or not 1 <= food_rating <= 10
        or not 1 <= hospital_rating <= 10
        or not 1 <= climate_rating <= 10
        or not 1 <= tourism_rating <= 10
        or not 1 <= safety_rating <= 10
        or not 1 <= cost_of_living_rating <= 10
        or not 1 <= culture_entertainment_rating <= 10
        or not 1 <= infrastructure_rating <= 10
        or not 1 <= healthcare_rating <= 10
    ):
        return {"message": "Invalid input"}, 400
    try:
        db.session.execute(
            text(
                """ INSERT INTO UserInput 
                        (UserID, CountryID, DateVisitedFrom, DateVisitedTo, 
                        FoodRating, HospitalRating, ClimateRating, 
                        TourismRating, SafetyRating, CostOfLivingRating, 
                        CultureEntertainmentRating, InfrastructureRating, HealthcareRating, 
                        Comments) 
                    VALUES 
                        (:user_id, :country_id, :date_visited_from, :date_visited_to, 
                        :food_rating, :hospital_rating, :climate_rating, 
                        :tourism_rating, :safety_rating, :cost_of_living_rating, 
                        :culture_entertainment_rating, :infrastructure_rating, :healthcare_rating, 
                        :comments)"""
            ),
            {
                "user_id": user_id,
                "country_id": country_id,
                "date_visited_from": date_visited_from,
                "date_visited_to": date_visited_to,
                "food_rating": food_rating,
                "hospital_rating": hospital_rating,
                "climate_rating": climate_rating,
                "tourism_rating": tourism_rating,
                "safety_rating": safety_rating,
                "cost_of_living_rating": cost_of_living_rating,
                "culture_entertainment_rating": culture_entertainment_rating,
                "infrastructure_rating": infrastructure_rating,
                "healthcare_rating": healthcare_rating,
                "comments": comments,
            },
        )
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"message": "Invalid input"}, 400
    return {"message": "User input created successfully"}, 201


@user_input_blueprint.route("/user_input/<user_input_id>", methods=["DELETE"])
@jwt_required()
def delete_user_input(user_input_id: str):
    user_id = int(get_jwt_identity())
    user_id_from_user_input = db.session.execute(
        text("SELECT UserID FROM UserInput WHERE UserInputID = :userInputID"),
        {"userInputID": user_input_id},
    ).fetchone()
    if not user_id_from_user_input:
        return {"message": "Could not find userinput"}, 404
    if not user_id == user_id_from_user_input[0]:
        return {"message": "Unauthorized to delete this userinput"}, 401
    try:
        db.session.execute(
            text(
                "DELETE FROM UserInput WHERE UserInputID = :userInputID AND UserID = :userID"
            ),
            {"userInputID": user_input_id, "userID": user_id},
        )
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"message": "Could not delete user input"}, 400
    return {"message": "User input deleted successfully"}, 200
