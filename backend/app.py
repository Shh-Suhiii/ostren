from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from extensions import db, migrate

from models import (
    Category,
    Product,
    ProductImage,
    ProductVariant,
    User,
)

from routes import (
    categories_bp,
    products_bp,
    auth_bp,
)


jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        origins=[
            app.config["FRONTEND_URL"]
        ],
        supports_credentials=True,
    )

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    app.register_blueprint(
        categories_bp
    )

    app.register_blueprint(
        products_bp
    )

    app.register_blueprint(
        auth_bp
    )

    @app.get("/api/health")
    def health():
        return jsonify({
            "success": True,
            "message": "Ostrin API is running",
            "service": "ostrin-backend",
        }), 200

    @app.get("/api/db-health")
    def db_health():
        try:
            db.session.execute(
                db.text("SELECT 1")
            )

            return jsonify({
                "success": True,
                "message": "PostgreSQL connected",
            }), 200

        except Exception as error:
            return jsonify({
                "success": False,
                "message": "Database connection failed",
                "error": str(error),
            }), 500

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True,
    )