from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from sqlalchemy.exc import IntegrityError
from data_models.UserInfo import UserInfo
from data_models.Country import Country
from extensions import bcrypt, db

auth_blueprint = Blueprint("auth", __name__)


@auth_blueprint.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return {"message": "Invalid input"}, 400
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")
    primary_citizenship_id = data.get("primaryCitizenship")
    if not username or not password or not email or primary_citizenship_id is None:
        return {"message": "Invalid input"}, 400
    password_hash = bcrypt.generate_password_hash(password.encode("utf-8")).decode(
        "utf-8"
    )
    try:
        user = UserInfo()
        user.Username = username
        user.Password = password_hash
        user.Email = email
        user.PrimaryCitizenshipID = primary_citizenship_id
        db.session.add(user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {
            "message": "User already exists or invalid country of citizenship",
        }, 400
    return {"message": "User created successfully"}, 201


@auth_blueprint.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return {"message": "Invalid input"}, 400
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return {"message": "Invalid input"}, 400
    user = db.session.query(UserInfo).filter_by(Username=username).first()
    if not user or not bcrypt.check_password_hash(user.Password, password):
        return {"message": "Invalid username or password"}, 401
    access_token = create_access_token(identity=user.UserID)
    country = (
        db.session.query(Country).filter_by(CountryID=user.PrimaryCitizenshipID).first()
    )
    if not country:
        return {"message": "Invalid country of citizenship"}, 400
    return (
        jsonify(
            {
                "userID": user.UserID,
                "username": user.Username,
                "email": user.Email,
                "primaryCitizenshipID": country.CountryID,
                "access_token": access_token,
            }
        ),
        200,
    )
