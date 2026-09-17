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
    Order,
    OrderItem,
    Address,
)

from routes import (
    categories_bp,
    products_bp,
    auth_bp,
    admin_bp,
    uploads_bp,
    orders_bp,
    addresses_bp,
)


jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # =====================================================
    # CORS
    # =====================================================

    CORS(
        app,
        origins=[
            app.config["FRONTEND_URL"]
        ],
        supports_credentials=True,
    )

    # =====================================================
    # EXTENSIONS
    # =====================================================

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # =====================================================
    # BLUEPRINTS
    # =====================================================

    app.register_blueprint(
        categories_bp
    )

    app.register_blueprint(
        products_bp
    )

    app.register_blueprint(
        auth_bp
    )

    app.register_blueprint(
        admin_bp
    )

    app.register_blueprint(
        uploads_bp
    )

    app.register_blueprint(
        orders_bp
    )

    app.register_blueprint(
        addresses_bp
    )

    # =====================================================
    # CREATE ADMIN COMMAND
    # =====================================================

    @app.cli.command("create-admin")
    def create_admin():
        full_name = input(
            "Admin name: "
        ).strip()

        email = input(
            "Admin email: "
        ).strip().lower()

        password = input(
            "Admin password: "
        ).strip()

        if not full_name:
            print(
                "Admin name is required."
            )
            return

        if not email:
            print(
                "Admin email is required."
            )
            return

        if len(password) < 6:
            print(
                "Password must be at least 6 characters."
            )
            return

        existing_user = (
            User.query
            .filter(
                db.func.lower(
                    User.email
                ) == email
            )
            .first()
        )

        if existing_user:
            existing_user.full_name = (
                full_name
            )

            existing_user.role = (
                "admin"
            )

            existing_user.is_active = (
                True
            )

            existing_user.set_password(
                password
            )

            db.session.commit()

            print(
                "Existing user updated "
                "to admin successfully."
            )

            return

        admin = User(
            full_name=full_name,
            email=email,
            role="admin",
            is_active=True,
        )

        admin.set_password(
            password
        )

        db.session.add(
            admin
        )

        db.session.commit()

        print(
            "Admin created successfully."
        )

    # =====================================================
    # HEALTH CHECK
    # =====================================================

    @app.get("/api/health")
    def health():
        return jsonify({
            "success": True,
            "message":
                "Ostren API is running",
            "service":
                "ostren-backend",
        }), 200

    # =====================================================
    # DATABASE HEALTH CHECK
    # =====================================================

    @app.get("/api/db-health")
    def db_health():
        try:
            db.session.execute(
                db.text(
                    "SELECT 1"
                )
            )

            return jsonify({
                "success": True,
                "message":
                    "PostgreSQL connected",
            }), 200

        except Exception as error:
            return jsonify({
                "success": False,
                "message":
                    "Database connection failed",
                "error":
                    str(error),
            }), 500

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True,
    )