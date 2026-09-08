from flask import Blueprint, jsonify, request

from extensions import db
from models import Product, Category

products_bp = Blueprint(
    "products",
    __name__,
    url_prefix="/api/products",
)


@products_bp.get("")
def get_products():
    category_slug = request.args.get("category")
    sort = request.args.get("sort")

    query = Product.query.filter_by(
        is_active=True
    )

    if category_slug:
        query = query.join(Category).filter(
            Category.slug == category_slug
        )

    if sort == "price-low":
        query = query.order_by(
            Product.price.asc()
        )

    elif sort == "price-high":
        query = query.order_by(
            Product.price.desc()
        )

    elif sort == "newest":
        query = query.order_by(
            Product.is_new.desc(),
            Product.created_at.desc(),
        )

    elif sort == "best-selling":
        query = query.order_by(
            Product.is_best_seller.desc(),
            Product.created_at.desc(),
        )

    else:
        query = query.order_by(
            Product.created_at.desc()
        )

    products = query.all()

    return jsonify({
        "success": True,
        "count": len(products),
        "products": [
            product.to_dict()
            for product in products
        ],
    }), 200


@products_bp.get("/<int:product_id>")
def get_product(product_id):
    product = db.session.get(
        Product,
        product_id
    )

    if not product or not product.is_active:
        return jsonify({
            "success": False,
            "message": "Product not found",
        }), 404

    return jsonify({
        "success": True,
        "product": product.to_dict(),
    }), 200


@products_bp.post("")
def create_product():
    data = request.get_json() or {}

    name = data.get("name")
    slug = data.get("slug")
    price = data.get("price")

    if not name or not slug or price is None:
        return jsonify({
            "success": False,
            "message": (
                "name, slug and price are required"
            ),
        }), 400

    if Product.query.filter_by(
        slug=slug
    ).first():
        return jsonify({
            "success": False,
            "message": "Product slug already exists",
        }), 409

    category = None

    category_id = data.get(
        "category_id"
    )

    if category_id:
        category = db.session.get(
            Category,
            category_id
        )

        if not category:
            return jsonify({
                "success": False,
                "message": "Category not found",
            }), 404

    product = Product(
        name=name,
        slug=slug,
        description=data.get(
            "description"
        ),
        price=price,
        compare_price=data.get(
            "compare_price"
        ),
        sku=data.get("sku"),
        stock=data.get("stock", 0),
        is_active=data.get(
            "is_active",
            True
        ),
        is_new=data.get(
            "is_new",
            False
        ),
        is_best_seller=data.get(
            "is_best_seller",
            False
        ),
        category=category,
    )

    db.session.add(product)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Product created",
        "product": product.to_dict(),
    }), 201


@products_bp.put("/<int:product_id>")
def update_product(product_id):
    product = db.session.get(
        Product,
        product_id
    )

    if not product:
        return jsonify({
            "success": False,
            "message": "Product not found",
        }), 404

    data = request.get_json() or {}

    if "name" in data:
        product.name = data["name"]

    if "slug" in data:
        existing = Product.query.filter(
            Product.slug == data["slug"],
            Product.id != product.id,
        ).first()

        if existing:
            return jsonify({
                "success": False,
                "message": (
                    "Product slug already exists"
                ),
            }), 409

        product.slug = data["slug"]

    if "description" in data:
        product.description = (
            data["description"]
        )

    if "price" in data:
        product.price = data["price"]

    if "compare_price" in data:
        product.compare_price = (
            data["compare_price"]
        )

    if "sku" in data:
        product.sku = data["sku"]

    if "stock" in data:
        product.stock = data["stock"]

    if "is_active" in data:
        product.is_active = (
            data["is_active"]
        )

    if "is_new" in data:
        product.is_new = (
            data["is_new"]
        )

    if "is_best_seller" in data:
        product.is_best_seller = (
            data["is_best_seller"]
        )

    if "category_id" in data:
        if data["category_id"] is None:
            product.category = None

        else:
            category = db.session.get(
                Category,
                data["category_id"]
            )

            if not category:
                return jsonify({
                    "success": False,
                    "message": (
                        "Category not found"
                    ),
                }), 404

            product.category = category

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Product updated",
        "product": product.to_dict(),
    }), 200


@products_bp.delete("/<int:product_id>")
def delete_product(product_id):
    product = db.session.get(
        Product,
        product_id
    )

    if not product:
        return jsonify({
            "success": False,
            "message": "Product not found",
        }), 404

    db.session.delete(product)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Product deleted",
    }), 200