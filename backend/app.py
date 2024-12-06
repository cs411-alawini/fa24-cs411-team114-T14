import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from extensions import db
from google.cloud.sql.connector import Connector
#from example.example_controller import example_blueprint
from controllers.auth_controller import auth_blueprint
from controllers.country_controller import country_blueprint
from controllers.user_input_controller import user_input_blueprint
from controllers.ranking_controller import ranking_blueprint
from controllers.demographic_contoller import country_details_blueprint

USER = "secondary"
PASSWORD = os.environ.get("DB_PASSWORD")
DATABASE_NAME = "MainDB"
PROJECT_ID = "fa24-team14"
INSTANCE_NAME = "cs411-fa24-team14:us-central1:fa24-team14"


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://"
    connector = Connector()

    def get_connection():
        conn = connector.connect(
            INSTANCE_NAME,
            "pymysql",
            user=USER,
            password=PASSWORD,
            db=DATABASE_NAME,
            ip_type="public",
        )
        return conn

    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "creator": get_connection,
    }
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    app.config["FLASK_DEBUG"] = os.environ.get("FLASK_DEBUG")
    JWTManager(app)
    #app.register_blueprint(example_blueprint)
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(country_blueprint)
    app.register_blueprint(user_input_blueprint)
    app.register_blueprint(ranking_blueprint)
    app.register_blueprint(country_details_blueprint)
    db.init_app(app)
    return app
