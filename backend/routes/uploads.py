import os
import uuid

from flask import (
    Blueprint,
    current_app,
    jsonify,
    request,
)

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
)

from werkzeug.utils import (
    secure_filename,
)

from extensions import db
from models import User

from utils.admin_required import (
    admin_required,
)


uploads_bp = Blueprint(
    "uploads",
    __name__,
    url_prefix="/api/uploads",
)


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


MAX_FILE_SIZE = (
    10 * 1024 * 1024
)


# =========================================================
# HELPERS
# =========================================================

def allowed_file(filename):
    return (
        "." in filename
        and filename
        .rsplit(".", 1)[1]
        .lower()
        in ALLOWED_EXTENSIONS
    )


def get_file_size(file):
    file.seek(
        0,
        os.SEEK_END
    )

    size = (
        file.tell()
    )

    file.seek(0)

    return size


def create_unique_filename(
    filename
):
    safe_filename = (
        secure_filename(
            filename
        )
    )

    extension = (
        safe_filename
        .rsplit(".", 1)[1]
        .lower()
    )

    return (
        f"{uuid.uuid4().hex}."
        f"{extension}"
    )


def get_project_directory():
    # backend/
    backend_directory = (
        current_app.root_path
    )

    # /ostren
    return os.path.dirname(
        backend_directory
    )


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


    if (
        not file
        or not file.filename
    ):
        return jsonify({
            "success": False,
            "message":
                "No image selected",
        }), 400


    if not allowed_file(
        file.filename
    ):
        return jsonify({
            "success": False,
            "message": (
                "Only PNG, JPG, JPEG "
                "and WEBP images are allowed"
            ),
        }), 400


    if (
        file.mimetype
        not in ALLOWED_MIME_TYPES
    ):
        return jsonify({
            "success": False,
            "message":
                "Invalid image format",
        }), 400


    file_size = (
        get_file_size(
            file
        )
    )


    if (
        file_size >
        MAX_FILE_SIZE
    ):
        return jsonify({
            "success": False,
            "message": (
                "Image must be smaller "
                "than 10MB"
            ),
        }), 413


    try:
        unique_filename = (
            create_unique_filename(
                file.filename
            )
        )


        project_directory = (
            get_project_directory()
        )


        upload_directory = (
            os.path.join(
                project_directory,
                "public",
                "uploads",
                "products",
            )
        )


        os.makedirs(
            upload_directory,
            exist_ok=True,
        )


        file_path = (
            os.path.join(
                upload_directory,
                unique_filename,
            )
        )


        file.save(
            file_path
        )


        public_url = (
            "/uploads/products/"
            f"{unique_filename}"
        )


        return jsonify({
            "success": True,

            "message": (
                "Image uploaded "
                "successfully"
            ),

            "image_url":
                public_url,

            "filename":
                unique_filename,
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

            "error":
                str(error),
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
        user_id
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


    # Customer uploads only.
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
    # FILE
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


    if (
        not file
        or not file.filename
    ):
        return jsonify({
            "success": False,
            "message":
                "No image selected",
        }), 400


    # -----------------------------------------------------
    # EXTENSION
    # -----------------------------------------------------

    if not allowed_file(
        file.filename
    ):
        return jsonify({
            "success": False,
            "message": (
                "Only PNG, JPG, JPEG "
                "and WEBP images are allowed"
            ),
        }), 400


    # -----------------------------------------------------
    # MIME TYPE
    # -----------------------------------------------------

    if (
        file.mimetype
        not in ALLOWED_MIME_TYPES
    ):
        return jsonify({
            "success": False,
            "message":
                "Invalid image format",
        }), 400


    # -----------------------------------------------------
    # SIZE
    # -----------------------------------------------------

    file_size = (
        get_file_size(
            file
        )
    )


    if (
        file_size <= 0
    ):
        return jsonify({
            "success": False,
            "message":
                "Image file is empty",
        }), 400


    if (
        file_size >
        MAX_FILE_SIZE
    ):
        return jsonify({
            "success": False,
            "message": (
                "Image must be smaller "
                "than 10MB"
            ),
        }), 413


    # -----------------------------------------------------
    # SAVE
    # -----------------------------------------------------

    try:
        unique_filename = (
            create_unique_filename(
                file.filename
            )
        )


        project_directory = (
            get_project_directory()
        )


        # Keep customization files separate
        # from admin product photography.

        upload_directory = (
            os.path.join(
                project_directory,
                "public",
                "uploads",
                "customizations",
                str(
                    user.id
                ),
            )
        )


        os.makedirs(
            upload_directory,
            exist_ok=True,
        )


        file_path = (
            os.path.join(
                upload_directory,
                unique_filename,
            )
        )


        file.save(
            file_path
        )


        public_url = (
            "/uploads/"
            "customizations/"
            f"{user.id}/"
            f"{unique_filename}"
        )


        return jsonify({
            "success": True,

            "message": (
                "Customization image "
                "uploaded successfully"
            ),

            "image_url":
                public_url,

            "filename":
                unique_filename,
        }), 201


    except Exception as error:
        print(
            "CUSTOMIZATION IMAGE "
            "UPLOAD ERROR:",
            str(error),
        )


        return jsonify({
            "success": False,

            "message": (
                "Unable to upload "
                "customization image"
            ),

            "error":
                str(error),
        }), 500