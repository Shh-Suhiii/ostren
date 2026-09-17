import hashlib
import secrets

from datetime import datetime, timedelta

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
)

from extensions import db
from models import User


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth",
)


def hash_reset_token(token):
    return hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()


@auth_bp.post("/register")
def register():
    data = request.get_json() or {}

    full_name = (
        data.get("full_name") or ""
    ).strip()

    email = (
        data.get("email") or ""
    ).strip().lower()

    phone = (
        data.get("phone") or ""
    ).strip()

    password = (
        data.get("password") or ""
    )

    if (
        not full_name
        or not email
        or not password
    ):
        return jsonify({
            "success": False,
            "message":
                "Full name, email and password are required",
        }), 400

    if len(password) < 6:
        return jsonify({
            "success": False,
            "message":
                "Password must be at least 6 characters",
        }), 400

    existing_user = (
        User.query
        .filter_by(email=email)
        .first()
    )

    if existing_user:
        return jsonify({
            "success": False,
            "message":
                "An account with this email already exists",
        }), 409

    user = User(
        full_name=full_name,
        email=email,
        phone=phone or None,
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(
        identity=str(user.id)
    )

    return jsonify({
        "success": True,
        "message":
            "Account created successfully",
        "access_token":
            access_token,
        "user":
            user.to_dict(),
    }), 201


@auth_bp.post("/login")
def login():
    data = request.get_json() or {}

    email = (
        data.get("email") or ""
    ).strip().lower()

    password = (
        data.get("password") or ""
    )

    if not email or not password:
        return jsonify({
            "success": False,
            "message":
                "Email and password are required",
        }), 400

    user = (
        User.query
        .filter_by(email=email)
        .first()
    )

    if (
        not user
        or not user.is_active
        or not user.check_password(
            password
        )
    ):
        return jsonify({
            "success": False,
            "message":
                "Invalid email or password",
        }), 401

    access_token = create_access_token(
        identity=str(user.id)
    )

    return jsonify({
        "success": True,
        "message":
            "Login successful",
        "access_token":
            access_token,
        "user":
            user.to_dict(),
    }), 200


# ---------------------------------------
# FORGOT PASSWORD
# ---------------------------------------

@auth_bp.post("/forgot-password")
def forgot_password():
    data = request.get_json() or {}

    email = (
        data.get("email") or ""
    ).strip().lower()

    if not email:
        return jsonify({
            "success": False,
            "message":
                "Email is required",
        }), 400

    user = (
        User.query
        .filter_by(email=email)
        .first()
    )

    generic_message = (
        "If an account exists with this email, "
        "password reset instructions have been created."
    )

    # Don't reveal whether account exists
    if not user:
        return jsonify({
            "success": True,
            "message":
                generic_message,
        }), 200

    # Generate secure random token
    reset_token = secrets.token_urlsafe(
        32
    )

    # Store HASH, not raw token
    user.reset_token_hash = (
        hash_reset_token(
            reset_token
        )
    )

    user.reset_token_expires_at = (
        datetime.utcnow()
        + timedelta(minutes=30)
    )

    db.session.commit()

    reset_url = (
        "http://localhost:3000/"
        "account/reset-password"
        f"?token={reset_token}"
    )

    return jsonify({
        "success": True,
        "message":
            generic_message,

        # LOCAL DEVELOPMENT ONLY
        "reset_url":
            reset_url,
    }), 200


# ---------------------------------------
# VERIFY RESET TOKEN
# ---------------------------------------

@auth_bp.post("/verify-reset-token")
def verify_reset_token():
    data = request.get_json() or {}

    token = (
        data.get("token") or ""
    ).strip()

    if not token:
        return jsonify({
            "success": False,
            "message":
                "Reset token is required",
        }), 400

    token_hash = hash_reset_token(
        token
    )

    user = (
        User.query
        .filter_by(
            reset_token_hash=
                token_hash
        )
        .first()
    )

    if (
        not user
        or not user.reset_token_expires_at
    ):
        return jsonify({
            "success": False,
            "message":
                "Invalid or expired reset link",
        }), 400

    if (
        user.reset_token_expires_at
        < datetime.utcnow()
    ):
        user.clear_password_reset()

        db.session.commit()

        return jsonify({
            "success": False,
            "message":
                "This reset link has expired",
        }), 400

    return jsonify({
        "success": True,
        "message":
            "Reset token is valid",
    }), 200


# ---------------------------------------
# RESET PASSWORD
# ---------------------------------------

@auth_bp.post("/reset-password")
def reset_password():
    data = request.get_json() or {}

    token = (
        data.get("token") or ""
    ).strip()

    password = (
        data.get("password") or ""
    )

    confirm_password = (
        data.get("confirm_password") or ""
    )

    if (
        not token
        or not password
        or not confirm_password
    ):
        return jsonify({
            "success": False,
            "message":
                "All fields are required",
        }), 400

    if len(password) < 6:
        return jsonify({
            "success": False,
            "message":
                "Password must be at least 6 characters",
        }), 400

    if password != confirm_password:
        return jsonify({
            "success": False,
            "message":
                "Passwords do not match",
        }), 400

    token_hash = hash_reset_token(
        token
    )

    user = (
        User.query
        .filter_by(
            reset_token_hash=
                token_hash
        )
        .first()
    )

    if (
        not user
        or not user.reset_token_expires_at
    ):
        return jsonify({
            "success": False,
            "message":
                "Invalid or expired reset link",
        }), 400

    if (
        user.reset_token_expires_at
        < datetime.utcnow()
    ):
        user.clear_password_reset()

        db.session.commit()

        return jsonify({
            "success": False,
            "message":
                "This reset link has expired",
        }), 400

    user.set_password(
        password
    )

    # Token cannot be reused
    user.clear_password_reset()

    db.session.commit()

    return jsonify({
        "success": True,
        "message":
            "Password reset successfully",
    }), 200


@auth_bp.get("/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()

    user = db.session.get(
        User,
        int(user_id)
    )

    if not user:
        return jsonify({
            "success": False,
            "message":
                "User not found",
        }), 404

    return jsonify({
        "success": True,
        "user":
            user.to_dict(),
    }), 200