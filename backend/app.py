import os
from flask import Flask
from flask_cors import CORS
from extensions import db
from google.cloud.sql.connector import Connector
from example.example_controller import example_blueprint

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
    app.register_blueprint(example_blueprint)
    db.init_app(app)
    return app
