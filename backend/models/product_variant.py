from extensions import db


class ProductVariant(db.Model):
    __tablename__ = "product_variants"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    product_id = db.Column(
        db.Integer,
        db.ForeignKey(
            "products.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    size = db.Column(
        db.String(50),
        nullable=True
    )

    color = db.Column(
        db.String(50),
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

    price = db.Column(
        db.Numeric(10, 2),
        nullable=True
    )

    product = db.relationship(
        "Product",
        back_populates="variants"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "size": self.size,
            "color": self.color,
            "sku": self.sku,
            "stock": self.stock,
            "price": (
                float(self.price)
                if self.price is not None
                else None
            ),
        }