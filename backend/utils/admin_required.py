from functools import wraps

from flask import jsonify
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)

from extensions import db
from models import User


def admin_required(function):
    @wraps(function)
    @jwt_required()
    def wrapper(*args, **kwargs):
        identity = get_jwt_identity()

        try:
            user_id = int(identity)
        except (TypeError, ValueError):
            return jsonify({
                "success": False,
                "message": "Invalid authentication token",
            }), 401

        user = db.session.get(
            User,
            user_id
        )

        if not user:
            return jsonify({
                "success": False,
                "message": "User not found",
            }), 401

        if not user.is_active:
            return jsonify({
                "success": False,
                "message": "Account is inactive",
            }), 403

        if user.role != "admin":
            return jsonify({
                "success": False,
                "message": "Admin access required",
            }), 403

        return function(*args, **kwargs)

    return wrapper