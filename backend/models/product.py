from extensions import db


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(200),
        nullable=False
    )

    slug = db.Column(
        db.String(220),
        nullable=False,
        unique=True
    )

    description = db.Column(
        db.Text,
        nullable=True
    )

    price = db.Column(
        db.Numeric(10, 2),
        nullable=False
    )

    compare_price = db.Column(
        db.Numeric(10, 2),
        nullable=True
    )

    sku = db.Column(
        db.String(100),
        nullable=True,
        unique=True
    )

    stock = db.Column(
        db.Integer,
        nullable=False,
        default=0
    )

    is_active = db.Column(
        db.Boolean,
        nullable=False,
        default=True
    )

    is_new = db.Column(
        db.Boolean,
        nullable=False,
        default=False
    )

    is_best_seller = db.Column(
        db.Boolean,
        nullable=False,
        default=False
    )

    category_id = db.Column(
        db.Integer,
        db.ForeignKey("categories.id"),
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )

    category = db.relationship(
        "Category",
        back_populates="products"
    )

    images = db.relationship(
        "ProductImage",
        back_populates="product",
        cascade="all, delete-orphan"
    )

    variants = db.relationship(
        "ProductVariant",
        back_populates="product",
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "description": self.description,
            "price": float(self.price),
            "compare_price": (
                float(self.compare_price)
                if self.compare_price
                else None
            ),
            "sku": self.sku,
            "stock": self.stock,
            "is_active": self.is_active,
            "is_new": self.is_new,
            "is_best_seller": self.is_best_seller,
            "category": (
                self.category.to_dict()
                if self.category
                else None
            ),
            "images": [
                image.to_dict()
                for image in self.images
            ],
            "variants": [
                variant.to_dict()
                for variant in self.variants
            ],
        }