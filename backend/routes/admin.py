# backend/routes/admin.py

from flask import Blueprint, jsonify, request

from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
)

from extensions import db

from models import (
    User,
    Product,
    Category,
    Order,
)

from utils.admin_required import admin_required


admin_bp = Blueprint(
    "admin",
    __name__,
    url_prefix="/api/admin",
)


# =========================================================
# ADMIN LOGIN
# =========================================================

@admin_bp.post("/login")
def admin_login():
    data = request.get_json() or {}

    email = (
        data.get("email", "")
        .strip()
        .lower()
    )

    password = data.get(
        "password",
        ""
    )

    if not email or not password:
        return jsonify({
            "success": False,
            "message":
                "Email and password are required",
        }), 400

    user = (
        User.query
        .filter(
            db.func.lower(
                User.email
            ) == email
        )
        .first()
    )

    if not user:
        return jsonify({
            "success": False,
            "message":
                "Invalid email or password",
        }), 401

    if not user.check_password(
        password
    ):
        return jsonify({
            "success": False,
            "message":
                "Invalid email or password",
        }), 401

    if not user.is_active:
        return jsonify({
            "success": False,
            "message":
                "This account is inactive",
        }), 403

    if user.role != "admin":
        return jsonify({
            "success": False,
            "message":
                "Admin access only",
        }), 403

    access_token = (
        create_access_token(
            identity=str(
                user.id
            )
        )
    )

    return jsonify({
        "success": True,
        "message":
            "Admin login successful",
        "access_token":
            access_token,
        "user":
            user.to_dict(),
    }), 200


# =========================================================
# ADMIN PROFILE / TOKEN CHECK
# =========================================================

@admin_bp.get("/me")
@admin_required
def admin_me():
    user_id = int(
        get_jwt_identity()
    )

    user = db.session.get(
        User,
        user_id
    )

    return jsonify({
        "success": True,
        "user":
            user.to_dict(),
    }), 200


# =========================================================
# DASHBOARD STATS
# =========================================================

@admin_bp.get("/dashboard")
@admin_required
def admin_dashboard():
    total_products = (
        Product.query.count()
    )

    active_products = (
        Product.query
        .filter_by(
            is_active=True
        )
        .count()
    )

    inactive_products = (
        Product.query
        .filter_by(
            is_active=False
        )
        .count()
    )

    low_stock_products = (
        Product.query
        .filter(
            Product.stock <= 5
        )
        .count()
    )

    out_of_stock_products = (
        Product.query
        .filter(
            Product.stock <= 0
        )
        .count()
    )

    total_categories = (
        Category.query.count()
    )

    total_customers = (
        User.query
        .filter_by(
            role="customer"
        )
        .count()
    )

    total_admins = (
        User.query
        .filter_by(
            role="admin"
        )
        .count()
    )

    # Order statistics
    total_orders = (
        Order.query.count()
    )

    pending_orders = (
        Order.query
        .filter_by(
            status="pending"
        )
        .count()
    )

    confirmed_orders = (
        Order.query
        .filter_by(
            status="confirmed"
        )
        .count()
    )

    shipped_orders = (
        Order.query
        .filter_by(
            status="shipped"
        )
        .count()
    )

    delivered_orders = (
        Order.query
        .filter_by(
            status="delivered"
        )
        .count()
    )

    cancelled_orders = (
        Order.query
        .filter_by(
            status="cancelled"
        )
        .count()
    )

    return jsonify({
        "success": True,

        "stats": {
            "total_products":
                total_products,

            "active_products":
                active_products,

            "inactive_products":
                inactive_products,

            "low_stock_products":
                low_stock_products,

            "out_of_stock_products":
                out_of_stock_products,

            "total_categories":
                total_categories,

            "total_customers":
                total_customers,

            "total_admins":
                total_admins,

            "total_orders":
                total_orders,

            "pending_orders":
                pending_orders,

            "confirmed_orders":
                confirmed_orders,

            "shipped_orders":
                shipped_orders,

            "delivered_orders":
                delivered_orders,

            "cancelled_orders":
                cancelled_orders,
        },
    }), 200


# =========================================================
# CUSTOMERS
# =========================================================

@admin_bp.get("/customers")
@admin_required
def get_customers():
    customers = (
        User.query
        .filter_by(
            role="customer"
        )
        .order_by(
            User.created_at.desc()
        )
        .all()
    )

    return jsonify({
        "success": True,
        "count":
            len(customers),

        "customers": [
            customer.to_dict()
            for customer in customers
        ],
    }), 200


# =========================================================
# SINGLE CUSTOMER
# =========================================================

@admin_bp.get(
    "/customers/<int:customer_id>"
)
@admin_required
def get_customer(
    customer_id
):
    customer = db.session.get(
        User,
        customer_id
    )

    if (
        not customer
        or customer.role != "customer"
    ):
        return jsonify({
            "success": False,
            "message":
                "Customer not found",
        }), 404

    return jsonify({
        "success": True,
        "customer":
            customer.to_dict(),
    }), 200


# =========================================================
# ACTIVATE / DEACTIVATE CUSTOMER
# =========================================================

@admin_bp.patch(
    "/customers/<int:customer_id>/status"
)
@admin_required
def update_customer_status(
    customer_id
):
    customer = db.session.get(
        User,
        customer_id
    )

    if (
        not customer
        or customer.role != "customer"
    ):
        return jsonify({
            "success": False,
            "message":
                "Customer not found",
        }), 404

    data = (
        request.get_json(
            silent=True
        )
        or {}
    )

    if "is_active" not in data:
        return jsonify({
            "success": False,
            "message":
                "is_active is required",
        }), 400

    is_active = data.get(
        "is_active"
    )

    if not isinstance(
        is_active,
        bool
    ):
        return jsonify({
            "success": False,
            "message":
                "is_active must be true or false",
        }), 400

    try:
        customer.is_active = (
            is_active
        )

        db.session.commit()

        return jsonify({
            "success": True,

            "message": (
                "Customer activated successfully"
                if is_active
                else
                "Customer deactivated successfully"
            ),

            "customer":
                customer.to_dict(),
        }), 200

    except Exception as error:
        db.session.rollback()

        print(
            "UPDATE CUSTOMER STATUS ERROR:",
            str(error),
        )

        return jsonify({
            "success": False,
            "message":
                "Unable to update customer status",
            "error":
                str(error),
        }), 500


# =========================================================
# ALL PRODUCTS FOR ADMIN
# =========================================================

@admin_bp.get("/products")
@admin_required
def get_admin_products():
    products = (
        Product.query
        .order_by(
            Product.created_at.desc()
        )
        .all()
    )

    return jsonify({
        "success": True,
        "count":
            len(products),

        "products": [
            product.to_dict()
            for product in products
        ],
    }), 200


# =========================================================
# SINGLE PRODUCT FOR ADMIN
# =========================================================

@admin_bp.get(
    "/products/<int:product_id>"
)
@admin_required
def get_admin_product(
    product_id
):
    product = db.session.get(
        Product,
        product_id
    )

    if not product:
        return jsonify({
            "success": False,
            "message":
                "Product not found",
        }), 404

    return jsonify({
        "success": True,
        "product":
            product.to_dict(),
    }), 200


# =========================================================
# ALL CATEGORIES FOR ADMIN
# =========================================================

@admin_bp.get("/categories")
@admin_required
def get_admin_categories():
    categories = (
        Category.query
        .order_by(
            Category.name.asc()
        )
        .all()
    )

    return jsonify({
        "success": True,
        "count":
            len(categories),

        "categories": [
            category.to_dict()
            for category in categories
        ],
    }), 200


# =========================================================
# ALL ORDERS FOR ADMIN
# =========================================================

@admin_bp.get("/orders")
@admin_required
def get_admin_orders():
    orders = (
        Order.query
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
# SINGLE ORDER FOR ADMIN
# =========================================================

@admin_bp.get(
    "/orders/<int:order_id>"
)
@admin_required
def get_admin_order(
    order_id
):
    order = db.session.get(
        Order,
        order_id
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


# =========================================================
# UPDATE ORDER STATUS
# =========================================================

@admin_bp.patch(
    "/orders/<int:order_id>/status"
)
@admin_required
def update_order_status(
    order_id
):
    order = db.session.get(
        Order,
        order_id
    )

    if not order:
        return jsonify({
            "success": False,
            "message":
                "Order not found",
        }), 404

    data = (
        request.get_json(
            silent=True
        )
        or {}
    )

    status = (
        data.get("status")
        or ""
    ).strip().lower()

    allowed_statuses = {
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
    }

    if status not in allowed_statuses:
        return jsonify({
            "success": False,
            "message": (
                "Status must be pending, "
                "confirmed, shipped, "
                "delivered or cancelled"
            ),
        }), 400

    current_status = (
        order.status
        or "pending"
    ).lower()

    # Same status = no change required.
    if status == current_status:
        return jsonify({
            "success": True,
            "message":
                "Order status is already up to date",
            "order":
                order.to_dict(),
        }), 200

    # Delivered orders are final.
    if current_status == "delivered":
        return jsonify({
            "success": False,
            "message":
                "Delivered orders cannot be changed",
        }), 409

    # Cancelled orders are final.
    if current_status == "cancelled":
        return jsonify({
            "success": False,
            "message":
                "Cancelled orders cannot be changed",
        }), 409

    status_rank = {
        "pending": 0,
        "confirmed": 1,
        "shipped": 2,
        "delivered": 3,
    }

    # Prevent backwards movement.
    if (
        status != "cancelled"
        and status_rank.get(
            status,
            -1
        )
        < status_rank.get(
            current_status,
            -1
        )
    ):
        return jsonify({
            "success": False,
            "message":
                "Order status cannot move backwards",
        }), 409

    try:
        # ================================================
        # CANCEL ORDER
        # Restore stock exactly once because cancelled
        # orders cannot be changed again.
        # ================================================

        if status == "cancelled":
            for item in order.items:
                if item.product:
                    item.product.stock += (
                        item.quantity
                    )

            order.status = (
                "cancelled"
            )

            order.payment_status = (
                "cancelled"
            )

        else:
            order.status = status

            # COD payment is completed on delivery.
            if (
                status == "delivered"
                and order.payment_method == "cod"
            ):
                order.payment_status = (
                    "paid"
                )

        db.session.commit()

        return jsonify({
            "success": True,
            "message":
                "Order status updated successfully",
            "order":
                order.to_dict(),
        }), 200

    except Exception as error:
        db.session.rollback()

        print(
            "UPDATE ORDER STATUS ERROR:",
            str(error),
        )

        return jsonify({
            "success": False,
            "message":
                "Unable to update order status",
            "error":
                str(error),
        }), 500