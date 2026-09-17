# backend/routes/products.py

from flask import Blueprint, jsonify, request

from extensions import db
from models import Product, Category, ProductImage

from utils.admin_required import admin_required


products_bp = Blueprint(
    "products",
    __name__,
    url_prefix="/api/products",
)


# =========================================================
# HELPERS
# =========================================================

ALLOWED_CUSTOMIZATION_TYPES = {
    "tshirt",
    "hoodie",
    "mug",
    "bottle",
    "frame",
}


def normalize_customization_type(value):
    if value is None:
        return None

    value = str(value).strip().lower()

    if not value:
        return None

    return value


def validate_customization_type(value):
    if (
        value is not None
        and value not in ALLOWED_CUSTOMIZATION_TYPES
    ):
        return False

    return True


# =========================================================
# PUBLIC: GET ALL ACTIVE PRODUCTS
# =========================================================

@products_bp.get("")
def get_products():
    category_slug = request.args.get(
        "category"
    )

    sort = request.args.get(
        "sort"
    )

    customizable = request.args.get(
        "customizable"
    )

    customization_type = (
        normalize_customization_type(
            request.args.get(
                "customization_type"
            )
        )
    )

    query = Product.query.filter_by(
        is_active=True
    )

    if category_slug:
        query = query.join(
            Category
        ).filter(
            Category.slug == category_slug
        )

    # Optional customizable product filter.
    if customizable in {
        "true",
        "1",
        "yes",
    }:
        query = query.filter(
            Product.is_customizable.is_(
                True
            )
        )

    if customization_type:
        query = query.filter(
            Product.is_customizable.is_(
                True
            ),
            Product.customization_type
            == customization_type,
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


# =========================================================
# PUBLIC: GET SINGLE ACTIVE PRODUCT
# =========================================================

@products_bp.get("/<int:product_id>")
def get_product(product_id):
    product = db.session.get(
        Product,
        product_id
    )

    if (
        not product
        or not product.is_active
    ):
        return jsonify({
            "success": False,
            "message": "Product not found",
        }), 404

    return jsonify({
        "success": True,
        "product": product.to_dict(),
    }), 200


# =========================================================
# ADMIN: CREATE PRODUCT
# =========================================================

@products_bp.post("")
@admin_required
def create_product():
    data = request.get_json() or {}

    name = (
        str(
            data.get(
                "name",
                ""
            )
        )
        .strip()
    )

    slug = (
        str(
            data.get(
                "slug",
                ""
            )
        )
        .strip()
        .lower()
    )

    price = data.get(
        "price"
    )

    if (
        not name
        or not slug
        or price is None
    ):
        return jsonify({
            "success": False,
            "message": (
                "name, slug and price "
                "are required"
            ),
        }), 400

    existing_slug = (
        Product.query.filter_by(
            slug=slug
        ).first()
    )

    if existing_slug:
        return jsonify({
            "success": False,
            "message": (
                "Product slug already exists"
            ),
        }), 409

    sku = data.get(
        "sku"
    )

    if sku:
        sku = str(
            sku
        ).strip()

        existing_sku = (
            Product.query.filter_by(
                sku=sku
            ).first()
        )

        if existing_sku:
            return jsonify({
                "success": False,
                "message": (
                    "Product SKU already exists"
                ),
            }), 409

    # =====================================================
    # CATEGORY
    # =====================================================

    category = None

    category_id = data.get(
        "category_id"
    )

    if category_id is not None:
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

    # =====================================================
    # CUSTOMIZATION
    # =====================================================

    is_customizable = bool(
        data.get(
            "is_customizable",
            False
        )
    )

    customization_type = (
        normalize_customization_type(
            data.get(
                "customization_type"
            )
        )
    )

    allow_custom_image = bool(
        data.get(
            "allow_custom_image",
            False
        )
    )

    allow_custom_text = bool(
        data.get(
            "allow_custom_text",
            False
        )
    )

    customization_price = data.get(
        "customization_price",
        0
    )

    if not is_customizable:
        customization_type = None
        allow_custom_image = False
        allow_custom_text = False
        customization_price = 0

    else:
        if not customization_type:
            return jsonify({
                "success": False,
                "message": (
                    "Customization type is required "
                    "for customizable products"
                ),
            }), 400

        if not validate_customization_type(
            customization_type
        ):
            return jsonify({
                "success": False,
                "message": (
                    "Invalid customization type"
                ),
            }), 400

        try:
            if (
                float(
                    customization_price
                    or 0
                )
                < 0
            ):
                return jsonify({
                    "success": False,
                    "message": (
                        "Customization price "
                        "cannot be negative"
                    ),
                }), 400

        except (
            TypeError,
            ValueError,
        ):
            return jsonify({
                "success": False,
                "message": (
                    "Invalid customization price"
                ),
            }), 400

    # =====================================================
    # CREATE PRODUCT
    # =====================================================

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

        sku=sku,

        stock=data.get(
            "stock",
            0
        ),

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

        # Customization
        is_customizable=(
            is_customizable
        ),

        customization_type=(
            customization_type
        ),

        allow_custom_image=(
            allow_custom_image
        ),

        allow_custom_text=(
            allow_custom_text
        ),

        customization_price=(
            customization_price
            or 0
        ),

        category=category,
    )

    try:
        db.session.add(
            product
        )

        # Generate product ID.
        db.session.flush()

        images = data.get(
            "images",
            []
        )

        for (
            index,
            image_data,
        ) in enumerate(
            images
        ):
            image_url = (
                image_data.get(
                    "image_url"
                )
            )

            if not image_url:
                continue

            product_image = (
                ProductImage(
                    product_id=(
                        product.id
                    ),

                    image_url=(
                        image_url
                    ),

                    alt_text=(
                        image_data.get(
                            "alt_text"
                        )
                        or product.name
                    ),

                    sort_order=(
                        image_data.get(
                            "sort_order",
                            index
                        )
                    ),
                )
            )

            db.session.add(
                product_image
            )

        db.session.commit()

        return jsonify({
            "success": True,
            "message": (
                "Product created successfully"
            ),
            "product": (
                product.to_dict()
            ),
        }), 201

    except Exception as error:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": (
                "Unable to create product"
            ),
            "error": str(
                error
            ),
        }), 500


# =========================================================
# ADMIN: UPDATE PRODUCT
# =========================================================

@products_bp.put("/<int:product_id>")
@admin_required
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

    # =====================================================
    # BASIC INFORMATION
    # =====================================================

    if "name" in data:
        name = str(
            data["name"]
        ).strip()

        if not name:
            return jsonify({
                "success": False,
                "message": (
                    "Product name cannot be empty"
                ),
            }), 400

        product.name = name

    if "slug" in data:
        slug = (
            str(
                data["slug"]
            )
            .strip()
            .lower()
        )

        if not slug:
            return jsonify({
                "success": False,
                "message": (
                    "Product slug cannot be empty"
                ),
            }), 400

        existing = (
            Product.query.filter(
                Product.slug == slug,
                Product.id
                != product.id,
            ).first()
        )

        if existing:
            return jsonify({
                "success": False,
                "message": (
                    "Product slug already exists"
                ),
            }), 409

        product.slug = slug

    if "description" in data:
        product.description = (
            data["description"]
        )

    if "price" in data:
        product.price = (
            data["price"]
        )

    if "compare_price" in data:
        product.compare_price = (
            data["compare_price"]
        )

    if "sku" in data:
        sku = data["sku"]

        if sku:
            sku = str(
                sku
            ).strip()

            existing_sku = (
                Product.query.filter(
                    Product.sku
                    == sku,

                    Product.id
                    != product.id,
                ).first()
            )

            if existing_sku:
                return jsonify({
                    "success": False,
                    "message": (
                        "Product SKU already exists"
                    ),
                }), 409

        product.sku = (
            sku or None
        )

    if "stock" in data:
        product.stock = (
            data["stock"]
        )

    if "is_active" in data:
        product.is_active = (
            bool(
                data[
                    "is_active"
                ]
            )
        )

    if "is_new" in data:
        product.is_new = (
            bool(
                data[
                    "is_new"
                ]
            )
        )

    if "is_best_seller" in data:
        product.is_best_seller = (
            bool(
                data[
                    "is_best_seller"
                ]
            )
        )

    # =====================================================
    # CATEGORY
    # =====================================================

    if "category_id" in data:
        category_id = (
            data[
                "category_id"
            ]
        )

        if category_id is None:
            product.category = None

        else:
            category = (
                db.session.get(
                    Category,
                    category_id
                )
            )

            if not category:
                return jsonify({
                    "success": False,
                    "message": (
                        "Category not found"
                    ),
                }), 404

            product.category = (
                category
            )

    # =====================================================
    # CUSTOMIZATION
    # =====================================================

    new_is_customizable = (
        bool(
            data.get(
                "is_customizable",
                product.is_customizable
            )
        )
    )

    new_customization_type = (
        normalize_customization_type(
            data.get(
                "customization_type",
                product.customization_type
            )
        )
    )

    new_allow_custom_image = (
        bool(
            data.get(
                "allow_custom_image",
                product.allow_custom_image
            )
        )
    )

    new_allow_custom_text = (
        bool(
            data.get(
                "allow_custom_text",
                product.allow_custom_text
            )
        )
    )

    new_customization_price = (
        data.get(
            "customization_price",
            product.customization_price
        )
    )

    if not new_is_customizable:
        new_customization_type = None
        new_allow_custom_image = False
        new_allow_custom_text = False
        new_customization_price = 0

    else:
        if not new_customization_type:
            return jsonify({
                "success": False,
                "message": (
                    "Customization type is required "
                    "for customizable products"
                ),
            }), 400

        if not validate_customization_type(
            new_customization_type
        ):
            return jsonify({
                "success": False,
                "message": (
                    "Invalid customization type"
                ),
            }), 400

        try:
            if (
                float(
                    new_customization_price
                    or 0
                )
                < 0
            ):
                return jsonify({
                    "success": False,
                    "message": (
                        "Customization price "
                        "cannot be negative"
                    ),
                }), 400

        except (
            TypeError,
            ValueError,
        ):
            return jsonify({
                "success": False,
                "message": (
                    "Invalid customization price"
                ),
            }), 400

    product.is_customizable = (
        new_is_customizable
    )

    product.customization_type = (
        new_customization_type
    )

    product.allow_custom_image = (
        new_allow_custom_image
    )

    product.allow_custom_text = (
        new_allow_custom_text
    )

    product.customization_price = (
        new_customization_price
        or 0
    )

    # =====================================================
    # IMAGES + SAVE
    # =====================================================

    try:
        # Replace existing images only
        # when images field is provided.
        if "images" in data:
            ProductImage.query.filter_by(
                product_id=(
                    product.id
                )
            ).delete()

            images = data.get(
                "images",
                []
            )

            for (
                index,
                image_data,
            ) in enumerate(
                images
            ):
                image_url = (
                    image_data.get(
                        "image_url"
                    )
                )

                if not image_url:
                    continue

                product_image = (
                    ProductImage(
                        product_id=(
                            product.id
                        ),

                        image_url=(
                            image_url
                        ),

                        alt_text=(
                            image_data.get(
                                "alt_text"
                            )
                            or product.name
                        ),

                        sort_order=(
                            image_data.get(
                                "sort_order",
                                index
                            )
                        ),
                    )
                )

                db.session.add(
                    product_image
                )

        db.session.commit()

        return jsonify({
            "success": True,
            "message": (
                "Product updated successfully"
            ),
            "product": (
                product.to_dict()
            ),
        }), 200

    except Exception as error:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": (
                "Unable to update product"
            ),
            "error": str(
                error
            ),
        }), 500


# =========================================================
# ADMIN: DELETE PRODUCT
# =========================================================

@products_bp.delete("/<int:product_id>")
@admin_required
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

    try:
        # -------------------------------------------------
        # DELETE PRODUCT IMAGES FIRST
        # -------------------------------------------------

        ProductImage.query.filter_by(
            product_id=product.id
        ).delete(
            synchronize_session=False
        )

        # -------------------------------------------------
        # DELETE PRODUCT VARIANTS
        # -------------------------------------------------

        from models import ProductVariant

        ProductVariant.query.filter_by(
            product_id=product.id
        ).delete(
            synchronize_session=False
        )

        # -------------------------------------------------
        # DELETE PRODUCT
        # -------------------------------------------------

        db.session.delete(
            product
        )

        db.session.commit()

        return jsonify({
            "success": True,
            "message": (
                "Product deleted successfully"
            ),
        }), 200

    except Exception as error:
        db.session.rollback()

        print(
            "DELETE PRODUCT ERROR:",
            str(error)
        )

        return jsonify({
            "success": False,
            "message": (
                "Unable to delete product"
            ),
            "error": str(
                error
            ),
        }), 500