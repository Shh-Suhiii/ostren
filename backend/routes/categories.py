# backend/routes/categories.py

from flask import Blueprint, jsonify, request

from extensions import db
from models import Category

from utils.admin_required import admin_required


categories_bp = Blueprint(
    "categories",
    __name__,
    url_prefix="/api/categories",
)


# =========================================================
# PUBLIC: GET ALL CATEGORIES
# =========================================================

@categories_bp.get("")
def get_categories():
    categories = Category.query.order_by(
        Category.name.asc()
    ).all()

    return jsonify({
        "success": True,
        "count": len(categories),
        "categories": [
            category.to_dict()
            for category in categories
        ],
    }), 200


# =========================================================
# ADMIN: CREATE CATEGORY
# =========================================================

@categories_bp.post("")
@admin_required
def create_category():
    data = request.get_json() or {}

    name = (
        data.get("name", "")
        .strip()
    )

    slug = (
        data.get("slug", "")
        .strip()
        .lower()
    )

    description = data.get(
        "description"
    )

    if not name or not slug:
        return jsonify({
            "success": False,
            "message": (
                "Category name and slug "
                "are required"
            ),
        }), 400

    existing_name = Category.query.filter(
        db.func.lower(Category.name)
        == name.lower()
    ).first()

    if existing_name:
        return jsonify({
            "success": False,
            "message": (
                "Category name already exists"
            ),
        }), 409

    existing_slug = Category.query.filter_by(
        slug=slug
    ).first()

    if existing_slug:
        return jsonify({
            "success": False,
            "message": (
                "Category slug already exists"
            ),
        }), 409

    category = Category(
        name=name,
        slug=slug,
        description=description,
    )

    try:
        db.session.add(
            category
        )

        db.session.commit()

        return jsonify({
            "success": True,
            "message": (
                "Category created successfully"
            ),
            "category": category.to_dict(),
        }), 201

    except Exception as error:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": (
                "Unable to create category"
            ),
            "error": str(error),
        }), 500


# =========================================================
# ADMIN: UPDATE CATEGORY
# =========================================================

@categories_bp.put("/<int:category_id>")
@admin_required
def update_category(category_id):
    category = db.session.get(
        Category,
        category_id
    )

    if not category:
        return jsonify({
            "success": False,
            "message": (
                "Category not found"
            ),
        }), 404

    data = request.get_json() or {}

    if "name" in data:
        name = str(
            data["name"]
        ).strip()

        if not name:
            return jsonify({
                "success": False,
                "message": (
                    "Category name cannot be empty"
                ),
            }), 400

        existing_name = Category.query.filter(
            db.func.lower(Category.name)
            == name.lower(),
            Category.id != category.id,
        ).first()

        if existing_name:
            return jsonify({
                "success": False,
                "message": (
                    "Category name already exists"
                ),
            }), 409

        category.name = name

    if "slug" in data:
        slug = str(
            data["slug"]
        ).strip().lower()

        if not slug:
            return jsonify({
                "success": False,
                "message": (
                    "Category slug cannot be empty"
                ),
            }), 400

        existing_slug = Category.query.filter(
            Category.slug == slug,
            Category.id != category.id,
        ).first()

        if existing_slug:
            return jsonify({
                "success": False,
                "message": (
                    "Category slug already exists"
                ),
            }), 409

        category.slug = slug

    if "description" in data:
        category.description = (
            data["description"]
        )

    try:
        db.session.commit()

        return jsonify({
            "success": True,
            "message": (
                "Category updated successfully"
            ),
            "category": category.to_dict(),
        }), 200

    except Exception as error:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": (
                "Unable to update category"
            ),
            "error": str(error),
        }), 500


# =========================================================
# ADMIN: DELETE CATEGORY
# =========================================================

@categories_bp.delete("/<int:category_id>")
@admin_required
def delete_category(category_id):
    category = db.session.get(
        Category,
        category_id
    )

    if not category:
        return jsonify({
            "success": False,
            "message": (
                "Category not found"
            ),
        }), 404

    if category.products:
        return jsonify({
            "success": False,
            "message": (
                "This category contains products. "
                "Move or remove those products first."
            ),
        }), 409

    try:
        db.session.delete(
            category
        )

        db.session.commit()

        return jsonify({
            "success": True,
            "message": (
                "Category deleted successfully"
            ),
        }), 200

    except Exception as error:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": (
                "Unable to delete category"
            ),
            "error": str(error),
        }), 500