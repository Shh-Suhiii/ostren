import os
import uuid

import cloudinary
import cloudinary.uploader

from flask import (
    Blueprint,
    jsonify,
    request,
)

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)

from werkzeug.utils import secure_filename

from extensions import db
from models import User

from utils.admin_required import admin_required


uploads_bp = Blueprint(
    "uploads",
    __name__,
    url_prefix="/api/uploads",
)


# =========================================================
# CLOUDINARY
# =========================================================

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)


# =========================================================
# FILE SETTINGS
# =========================================================

ALLOWED_EXTENSIONS = {
    "png",
    "jpg",
    "jpeg",
    "webp",
}

ALLOWED_MIME_TYPES = {
    "image/png",
    "image/jpeg",
    "image/webp",
}

MAX_FILE_SIZE = 10 * 1024 * 1024


# =========================================================
# HELPERS
# =========================================================

def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )


def get_file_size(file):
    file.seek(0, os.SEEK_END)
    size = file.tell()
    file.seek(0)

    return size


def create_public_id(filename):
    safe_filename = secure_filename(filename)

    name = os.path.splitext(
        safe_filename
    )[0]

    if not name:
        name = "image"

    return (
        f"{name}-"
        f"{uuid.uuid4().hex}"
    )


def validate_image(file):
    if (
        not file
        or not file.filename
    ):
        return (
            "No image selected",
            400,
        )

    if not allowed_file(
        file.filename
    ):
        return (
            "Only PNG, JPG, JPEG and WEBP images are allowed",
            400,
        )

    if (
        file.mimetype
        not in ALLOWED_MIME_TYPES
    ):
        return (
            "Invalid image format",
            400,
        )

    file_size = get_file_size(
        file
    )

    if file_size <= 0:
        return (
            "Image file is empty",
            400,
        )

    if (
        file_size >
        MAX_FILE_SIZE
    ):
        return (
            "Image must be smaller than 10MB",
            413,
        )

    return None


def upload_to_cloudinary(
    file,
    folder,
):
    public_id = create_public_id(
        file.filename
    )

    file.seek(0)

    result = (
        cloudinary.uploader.upload(
            file,
            folder=folder,
            public_id=public_id,
            resource_type="image",
            overwrite=False,
        )
    )

    secure_url = result.get(
        "secure_url"
    )

    if not secure_url:
        raise RuntimeError(
            "Cloudinary did not return an image URL"
        )

    return {
        "image_url": secure_url,
        "public_id": result.get(
            "public_id"
        ),
        "width": result.get(
            "width"
        ),
        "height": result.get(
            "height"
        ),
        "format": result.get(
            "format"
        ),
    }


# =========================================================
# ADMIN: UPLOAD PRODUCT IMAGE
# =========================================================

@uploads_bp.post(
    "/product-image"
)
@admin_required
def upload_product_image():
    if (
        "image"
        not in request.files
    ):
        return jsonify({
            "success": False,
            "message":
                "No image file provided",
        }), 400

    file = request.files[
        "image"
    ]

    validation_error = (
        validate_image(file)
    )

    if validation_error:
        message, status_code = (
            validation_error
        )

        return jsonify({
            "success": False,
            "message": message,
        }), status_code

    try:
        uploaded = (
            upload_to_cloudinary(
                file,
                "ostren/products",
            )
        )

        return jsonify({
            "success": True,
            "message":
                "Image uploaded successfully",
            "image_url":
                uploaded["image_url"],
            "public_id":
                uploaded["public_id"],
            "width":
                uploaded["width"],
            "height":
                uploaded["height"],
            "format":
                uploaded["format"],
        }), 201

    except Exception as error:
        print(
            "PRODUCT IMAGE "
            "UPLOAD ERROR:",
            str(error),
        )

        return jsonify({
            "success": False,
            "message":
                "Unable to upload image",
        }), 500


# =========================================================
# CUSTOMER: UPLOAD CUSTOMIZATION IMAGE
# =========================================================

@uploads_bp.post(
    "/customization-image"
)
@jwt_required()
def upload_customization_image():

    # -----------------------------------------------------
    # CURRENT USER
    # -----------------------------------------------------

    identity = (
        get_jwt_identity()
    )

    try:
        user_id = int(
            identity
        )
    except (
        TypeError,
        ValueError,
    ):
        return jsonify({
            "success": False,
            "message":
                "Invalid authentication token",
        }), 401

    user = db.session.get(
        User,
        user_id,
    )

    if not user:
        return jsonify({
            "success": False,
            "message":
                "User not found",
        }), 401

    if not user.is_active:
        return jsonify({
            "success": False,
            "message":
                "Account is inactive",
        }), 403

    if (
        user.role !=
        "customer"
    ):
        return jsonify({
            "success": False,
            "message":
                "Customer account required",
        }), 403

    # -----------------------------------------------------
    # IMAGE
    # -----------------------------------------------------

    if (
        "image"
        not in request.files
    ):
        return jsonify({
            "success": False,
            "message":
                "No image file provided",
        }), 400

    file = request.files[
        "image"
    ]

    validation_error = (
        validate_image(file)
    )

    if validation_error:
        message, status_code = (
            validation_error
        )

        return jsonify({
            "success": False,
            "message": message,
        }), status_code

    # -----------------------------------------------------
    # CLOUDINARY
    # -----------------------------------------------------

    try:
        uploaded = (
            upload_to_cloudinary(
                file,
                (
                    "ostren/"
                    "customizations/"
                    f"user-{user.id}"
                ),
            )
        )

        return jsonify({
            "success": True,
            "message":
                "Customization image uploaded successfully",
            "image_url":
                uploaded["image_url"],
            "public_id":
                uploaded["public_id"],
            "width":
                uploaded["width"],
            "height":
                uploaded["height"],
            "format":
                uploaded["format"],
        }), 201

    except Exception as error:
        print(
            "CUSTOMIZATION IMAGE "
            "UPLOAD ERROR:",
            str(error),
        )

        return jsonify({
            "success": False,
            "message":
                "Unable to upload customization image",
        }), 500