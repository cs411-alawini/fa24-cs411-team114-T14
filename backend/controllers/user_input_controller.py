from sqlalchemy.exc import IntegrityError
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import text
from data_models.InsertUserInputWithOverlapValidationResult import InsertUserInputWithOverlapValidationResult
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
                    "dateVisitedFrom": f"{user_input.DateVisitedFrom:%Y-%m-%d}",
                    "dateVisitedTo": f"{user_input.DateVisitedTo:%Y-%m-%d}",
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
        country_id is None
        or date_visited_from is None
        or date_visited_to is None
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
        output = db.session.execute(
            text(
                """ CALL InsertUserInputWithOverlapValidation(
                        :user_id, :country_id, :date_visited_from, :date_visited_to, 
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
        result = InsertUserInputWithOverlapValidationResult(*output.first())
        if result.status_code != 0:
            return {"message": result.message}, 400
        return {"message": result.message}, 201
    except IntegrityError:
        return {"message": "Invalid input"}, 400


@user_input_blueprint.route("/user_input/<user_input_id>", methods=["PUT"])
@jwt_required()
def put_user_input(user_input_id: str):
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
        country_id is None
        or date_visited_from is None
        or date_visited_to is None
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
    user_input = db.session.execute(
        text(
            "SELECT * FROM UserInput WHERE UserInputID = :userInputID AND UserID = :userID"
        ),
        {"userInputID": user_input_id, "userID": user_id},
    ).fetchone()
    if not user_input:
        return {"message": "Could not find userinput"}, 404
    try:
        db.session.execute(
            text(
                """ UPDATE UserInput 
                    SET CountryID = :country_id, DateVisitedFrom = :date_visited_from, 
                        DateVisitedTo = :date_visited_to, FoodRating = :food_rating, 
                        HospitalRating = :hospital_rating, ClimateRating = :climate_rating, 
                        TourismRating = :tourism_rating, SafetyRating = :safety_rating, 
                        CostOfLivingRating = :cost_of_living_rating, 
                        CultureEntertainmentRating = :culture_entertainment_rating, 
                        InfrastructureRating = :infrastructure_rating, 
                        HealthcareRating = :healthcare_rating, Comments = :comments 
                    WHERE UserInputID = :userInputID"""
            ),
            {
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
                "userInputID": user_input_id,
            },
        )
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"message": "Invalid input"}, 400
    return {"message": "User input updated successfully"}, 200


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
