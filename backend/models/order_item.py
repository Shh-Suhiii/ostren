from extensions import db


class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    order_id = db.Column(
        db.Integer,
        db.ForeignKey(
            "orders.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    # -----------------------------------------------------
    # PRODUCT
    # -----------------------------------------------------

    product_id = db.Column(
        db.Integer,
        db.ForeignKey(
            "products.id",
            ondelete="SET NULL"
        ),
        nullable=True
    )

    # Snapshot fields remain even if product is later deleted.

    product_name = db.Column(
        db.String(200),
        nullable=False
    )

    sku = db.Column(
        db.String(100),
        nullable=True
    )

    # -----------------------------------------------------
    # PRICING
    # -----------------------------------------------------

    unit_price = db.Column(
        db.Numeric(10, 2),
        nullable=False
    )

    quantity = db.Column(
        db.Integer,
        nullable=False
    )

    line_total = db.Column(
        db.Numeric(10, 2),
        nullable=False
    )

    # -----------------------------------------------------
    # CUSTOMIZATION SNAPSHOT
    # -----------------------------------------------------

    customization_data = db.Column(
        db.JSON,
        nullable=True
    )

    # Example:
    #
    # {
    #     "type": "frame",
    #     "custom_text": "Our favourite memory",
    #     "uploaded_image": "/uploads/customizations/2/abc.webp",
    #     "placement": "Frame artwork area",
    #     "customization_price": 199.0
    # }

    # -----------------------------------------------------
    # RELATIONSHIPS
    # -----------------------------------------------------

    order = db.relationship(
        "Order",
        back_populates="items"
    )

    product = db.relationship(
        "Product"
    )

    # -----------------------------------------------------
    # SERIALIZE
    # -----------------------------------------------------

    def to_dict(self):
        return {
            "id": self.id,

            "product_id":
                self.product_id,

            "product_name":
                self.product_name,

            "sku":
                self.sku,

            "unit_price":
                float(
                    self.unit_price
                ),

            "quantity":
                self.quantity,

            "line_total":
                float(
                    self.line_total
                ),

            "customization_data":
                self.customization_data,
        }