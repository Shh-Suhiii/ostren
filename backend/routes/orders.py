from decimal import Decimal
import secrets

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
)

from extensions import db
from models import (
    Order,
    OrderItem,
    Product,
    User,
)


orders_bp = Blueprint(
    "orders",
    __name__,
    url_prefix="/api/orders",
)


# =========================================================
# ORDER NUMBER
# =========================================================

def generate_order_number():
    while True:
        order_number = (
            "OST-"
            + secrets.token_hex(4).upper()
        )

        existing_order = (
            Order.query.filter_by(
                order_number=order_number
            ).first()
        )

        if not existing_order:
            return order_number


# =========================================================
# CREATE ORDER
# =========================================================

@orders_bp.post("")
@jwt_required()
def create_order():
    user_id = get_jwt_identity()

    user = db.session.get(
        User,
        int(user_id)
    )

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found",
        }), 404

    if not user.is_active:
        return jsonify({
            "success": False,
            "message": "Your account is inactive",
        }), 403

    if user.role == "admin":
        return jsonify({
            "success": False,
            "message": "Please use a customer account to place an order",
        }), 403

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

    address = (
        data.get("address") or ""
    ).strip()

    city = (
        data.get("city") or ""
    ).strip()

    state = (
        data.get("state") or ""
    ).strip()

    pincode = (
        data.get("pincode") or ""
    ).strip()

    items = data.get("items") or []

    # =====================================================
    # DELIVERY VALIDATION
    # =====================================================

    if not all([
        full_name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
    ]):
        return jsonify({
            "success": False,
            "message":
                "All delivery details are required",
        }), 400

    if not isinstance(items, list) or not items:
        return jsonify({
            "success": False,
            "message":
                "Your cart is empty",
        }), 400

    # =====================================================
    # BUILD ORDER ITEMS
    # =====================================================

    subtotal = Decimal("0.00")

    prepared_items = []

    seen_product_ids = set()

    for item in items:
        if not isinstance(item, dict):
            return jsonify({
                "success": False,
                "message":
                    "Invalid cart item",
            }), 400

        try:
            product_id = int(
                item.get("product_id")
            )

            quantity = int(
                item.get("quantity")
            )
        except (
            TypeError,
            ValueError,
        ):
            return jsonify({
                "success": False,
                "message":
                    "Invalid product or quantity",
            }), 400

        if quantity <= 0:
            return jsonify({
                "success": False,
                "message":
                    "Quantity must be at least 1",
            }), 400

        if product_id in seen_product_ids:
            return jsonify({
                "success": False,
                "message":
                    "Duplicate products are not allowed in the order",
            }), 400

        seen_product_ids.add(
            product_id
        )

        product = db.session.get(
            Product,
            product_id
        )

        if not product:
            return jsonify({
                "success": False,
                "message":
                    f"Product #{product_id} was not found",
            }), 404

        if not product.is_active:
            return jsonify({
                "success": False,
                "message":
                    f"{product.name} is currently unavailable",
            }), 400

        if product.stock < quantity:
            return jsonify({
                "success": False,
                "message":
                    (
                        f"Only {product.stock} "
                        f"{product.name} available"
                    ),
            }), 409

        unit_price = Decimal(
            str(product.price)
        )

        line_total = (
            unit_price
            * quantity
        )

        subtotal += line_total

        prepared_items.append({
            "product":
                product,
            "quantity":
                quantity,
            "unit_price":
                unit_price,
            "line_total":
                line_total,
        })

    # =====================================================
    # SHIPPING
    # =====================================================

    shipping = (
        Decimal("0.00")
        if subtotal >= Decimal("999.00")
        else Decimal("99.00")
    )

    total = (
        subtotal
        + shipping
    )

    # =====================================================
    # SAVE ORDER
    # =====================================================

    try:
        order = Order(
            order_number=
                generate_order_number(),

            user_id=
                user.id,

            full_name=
                full_name,

            email=
                email,

            phone=
                phone,

            address=
                address,

            city=
                city,

            state=
                state,

            pincode=
                pincode,

            subtotal=
                subtotal,

            shipping=
                shipping,

            total=
                total,

            status=
                "pending",

            payment_method=
                "cod",

            payment_status=
                "pending",
        )

        db.session.add(
            order
        )

        # Flush creates order.id
        # without committing yet.
        db.session.flush()

        for prepared in prepared_items:
            product = (
                prepared[
                    "product"
                ]
            )

            quantity = (
                prepared[
                    "quantity"
                ]
            )

            order_item = OrderItem(
                order_id=
                    order.id,

                product_id=
                    product.id,

                product_name=
                    product.name,

                sku=
                    product.sku,

                unit_price=
                    prepared[
                        "unit_price"
                    ],

                quantity=
                    quantity,

                line_total=
                    prepared[
                        "line_total"
                    ],
            )

            db.session.add(
                order_item
            )

            # Reduce stock
            product.stock -= (
                quantity
            )

        db.session.commit()

        return jsonify({
            "success": True,
            "message":
                "Order placed successfully",
            "order":
                order.to_dict(),
        }), 201

    except Exception as error:
        db.session.rollback()

        print(
            "CREATE ORDER ERROR:",
            str(error),
        )

        return jsonify({
            "success": False,
            "message":
                "Unable to place order",
            "error":
                str(error),
        }), 500


# =========================================================
# CUSTOMER ORDER HISTORY
# =========================================================

@orders_bp.get("")
@jwt_required()
def get_my_orders():
    user_id = int(
        get_jwt_identity()
    )

    orders = (
        Order.query
        .filter_by(
            user_id=user_id
        )
        .order_by(
            Order.created_at.desc()
        )
        .all()
    )

    return jsonify({
        "success": True,
        "count":
            len(orders),
        "orders": [
            order.to_dict()
            for order in orders
        ],
    }), 200


# =========================================================
# CUSTOMER SINGLE ORDER
# =========================================================

@orders_bp.get(
    "/<int:order_id>"
)
@jwt_required()
def get_my_order(
    order_id
):
    user_id = int(
        get_jwt_identity()
    )

    order = (
        Order.query
        .filter_by(
            id=order_id,
            user_id=user_id,
        )
        .first()
    )

    if not order:
        return jsonify({
            "success": False,
            "message":
                "Order not found",
        }), 404

    return jsonify({
        "success": True,
        "order":
            order.to_dict(),
    }), 200