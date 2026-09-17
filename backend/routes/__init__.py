from .categories import categories_bp
from .products import products_bp
from .auth import auth_bp
from .admin import admin_bp
from .uploads import uploads_bp
from .orders import orders_bp
from .addresses import addresses_bp


__all__ = [
    "categories_bp",
    "products_bp",
    "auth_bp",
    "admin_bp",
    "uploads_bp",
    "orders_bp",
    "addresses_bp",
]