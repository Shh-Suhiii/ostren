from extensions import db


class ProductImage(db.Model):
    __tablename__ = "product_images"

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

    image_url = db.Column(
        db.String(500),
        nullable=False
    )

    alt_text = db.Column(
        db.String(255),
        nullable=True
    )

    sort_order = db.Column(
        db.Integer,
        nullable=False,
        default=0
    )

    product = db.relationship(
        "Product",
        back_populates="images"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "image_url": self.image_url,
            "alt_text": self.alt_text,
            "sort_order": self.sort_order,
        }