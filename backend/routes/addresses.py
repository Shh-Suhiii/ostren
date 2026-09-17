from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import Address, User


addresses_bp = Blueprint(
    "addresses",
    __name__,
    url_prefix="/api/addresses"
)


def get_current_user():
    identity = get_jwt_identity()

    try:
        user_id = int(identity)
    except (TypeError, ValueError):
        return None

    return db.session.get(
        User,
        user_id
    )


def validate_address_data(data):
    required_fields = [
        "full_name",
        "phone",
        "address",
        "city",
        "state",
        "pincode",
    ]

    for field in required_fields:
        value = str(
            data.get(field, "")
        ).strip()

        if not value:
            return (
                f"{field.replace('_', ' ').title()} is required"
            )

    return None


# =========================================================
# GET ALL ADDRESSES
# =========================================================

@addresses_bp.get("")
@jwt_required()
def get_addresses():
    user = get_current_user()

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

    addresses = (
        Address.query
        .filter_by(
            user_id=user.id
        )
        .order_by(
            Address.is_default.desc(),
            Address.created_at.desc()
        )
        .all()
    )

    return jsonify({
        "success": True,
        "count": len(addresses),
        "addresses": [
            address.to_dict()
            for address in addresses
        ],
    }), 200


# =========================================================
# CREATE ADDRESS
# =========================================================

@addresses_bp.post("")
@jwt_required()
def create_address():
    user = get_current_user()

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

    data = request.get_json(
        silent=True
    ) or {}

    validation_error = (
        validate_address_data(
            data
        )
    )

    if validation_error:
        return jsonify({
            "success": False,
            "message": validation_error,
        }), 400

    existing_count = (
        Address.query
        .filter_by(
            user_id=user.id
        )
        .count()
    )

    # First address automatically becomes default.
    is_default = (
        existing_count == 0
        or bool(
            data.get(
                "is_default",
                False
            )
        )
    )

    try:
        if is_default:
            (
                Address.query
                .filter_by(
                    user_id=user.id
                )
                .update({
                    "is_default": False
                })
            )

        address = Address(
            user_id=user.id,
            full_name=str(
                data["full_name"]
            ).strip(),
            phone=str(
                data["phone"]
            ).strip(),
            address=str(
                data["address"]
            ).strip(),
            city=str(
                data["city"]
            ).strip(),
            state=str(
                data["state"]
            ).strip(),
            pincode=str(
                data["pincode"]
            ).strip(),
            is_default=is_default,
        )

        db.session.add(
            address
        )

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Address saved successfully",
            "address": address.to_dict(),
        }), 201

    except Exception:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Unable to save address",
        }), 500


# =========================================================
# UPDATE ADDRESS
# =========================================================

@addresses_bp.put("/<int:address_id>")
@jwt_required()
def update_address(
    address_id
):
    user = get_current_user()

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found",
        }), 401

    address = (
        Address.query
        .filter_by(
            id=address_id,
            user_id=user.id
        )
        .first()
    )

    if not address:
        return jsonify({
            "success": False,
            "message": "Address not found",
        }), 404

    data = request.get_json(
        silent=True
    ) or {}

    validation_error = (
        validate_address_data(
            data
        )
    )

    if validation_error:
        return jsonify({
            "success": False,
            "message": validation_error,
        }), 400

    try:
        address.full_name = str(
            data["full_name"]
        ).strip()

        address.phone = str(
            data["phone"]
        ).strip()

        address.address = str(
            data["address"]
        ).strip()

        address.city = str(
            data["city"]
        ).strip()

        address.state = str(
            data["state"]
        ).strip()

        address.pincode = str(
            data["pincode"]
        ).strip()

        if data.get(
            "is_default"
        ) is True:
            (
                Address.query
                .filter(
                    Address.user_id
                    == user.id,
                    Address.id
                    != address.id
                )
                .update(
                    {
                        "is_default": False
                    },
                    synchronize_session=False
                )
            )

            address.is_default = True

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Address updated successfully",
            "address": address.to_dict(),
        }), 200

    except Exception:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Unable to update address",
        }), 500


# =========================================================
# SET DEFAULT
# =========================================================

@addresses_bp.patch(
    "/<int:address_id>/default"
)
@jwt_required()
def set_default_address(
    address_id
):
    user = get_current_user()

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found",
        }), 401

    address = (
        Address.query
        .filter_by(
            id=address_id,
            user_id=user.id
        )
        .first()
    )

    if not address:
        return jsonify({
            "success": False,
            "message": "Address not found",
        }), 404

    try:
        (
            Address.query
            .filter_by(
                user_id=user.id
            )
            .update({
                "is_default": False
            })
        )

        address.is_default = True

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Default address updated",
            "address": address.to_dict(),
        }), 200

    except Exception:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Unable to update default address",
        }), 500


# =========================================================
# DELETE ADDRESS
# =========================================================

@addresses_bp.delete(
    "/<int:address_id>"
)
@jwt_required()
def delete_address(
    address_id
):
    user = get_current_user()

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found",
        }), 401

    address = (
        Address.query
        .filter_by(
            id=address_id,
            user_id=user.id
        )
        .first()
    )

    if not address:
        return jsonify({
            "success": False,
            "message": "Address not found",
        }), 404

    was_default = (
        address.is_default
    )

    try:
        db.session.delete(
            address
        )

        db.session.flush()

        # If default was deleted,
        # make another address default.
        if was_default:
            next_address = (
                Address.query
                .filter_by(
                    user_id=user.id
                )
                .order_by(
                    Address.created_at.desc()
                )
                .first()
            )

            if next_address:
                next_address.is_default = True

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Address deleted successfully",
        }), 200

    except Exception:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Unable to delete address",
        }), 500