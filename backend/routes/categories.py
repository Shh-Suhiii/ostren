from flask import Blueprint, jsonify

from models import Category

categories_bp = Blueprint(
    "categories",
    __name__,
    url_prefix="/api/categories",
)


@categories_bp.get("")
def get_categories():
    categories = Category.query.order_by(
        Category.name.asc()
    ).all()

    return jsonify({
        "success": True,
        "categories": [
            category.to_dict()
            for category in categories
        ]
    }), 200
