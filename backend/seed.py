from app import app
from extensions import db
from models import Category, Product, ProductImage


categories_data = [
    {
        "name": "T-Shirts",
        "slug": "t-shirts",
        "description": "Oversized, graphic and everyday tees by Ostren Fit.",
    },
    {
        "name": "Hoodies",
        "slug": "hoodies",
        "description": "Relaxed hoodies and sweatshirts designed for everyday streetwear.",
    },
    {
        "name": "Joggers",
        "slug": "joggers",
        "description": "Relaxed joggers and utility bottoms built for comfort and movement.",
    },
    {
        "name": "Jewelry",
        "slug": "jewelry",
        "description": "Minimal jewelry pieces designed to finish the look.",
    },
    {
        "name": "Mugs & Bottles",
        "slug": "mugs-bottles",
        "description": "Everyday lifestyle essentials with the Ostren Fit aesthetic.",
    },
    {
        "name": "Photo Frames",
        "slug": "photo-frames",
        "description": "Personalized frames made for your favorite moments.",
    },
]


products_data = [
    # --------------------------------------------------
    # HOMEPAGE - NEW ARRIVALS
    # --------------------------------------------------

    {
        "name": "Mountain Graphic Oversized Tee",
        "slug": "mountain-graphic-oversized-tee",
        "description": (
            "A relaxed oversized T-shirt featuring an Ostren Fit "
            "mountain-inspired graphic for an effortless streetwear look."
        ),
        "price": 1299,
        "compare_price": 1599,
        "sku": "OF-TS-001",
        "stock": 30,
        "category": "T-Shirts",
        "is_new": True,
        "is_best_seller": False,
        "image": "/arrivals/ostren-tee.png",
    },

    {
        "name": "Mountain Graphic Hoodie",
        "slug": "mountain-graphic-hoodie",
        "description": (
            "A comfortable oversized hoodie with a bold mountain graphic "
            "and relaxed Ostren Fit silhouette."
        ),
        "price": 2199,
        "compare_price": 2599,
        "sku": "OF-HD-001",
        "stock": 24,
        "category": "Hoodies",
        "is_new": True,
        "is_best_seller": False,
        "image": "/arrivals/ostren-hood.png",
    },

    {
        "name": "Relaxed Logo Joggers",
        "slug": "relaxed-logo-joggers",
        "description": (
            "Relaxed everyday joggers with subtle Ostren Fit branding "
            "and an easy streetwear-inspired fit."
        ),
        "price": 1699,
        "compare_price": 1999,
        "sku": "OF-JG-001",
        "stock": 28,
        "category": "Joggers",
        "is_new": True,
        "is_best_seller": False,
        "image": "/arrivals/ostren-jogg.png",
    },

    {
        "name": "Minimal Gold Jewelry Set",
        "slug": "minimal-gold-jewelry-set",
        "description": (
            "A minimal gold-tone jewelry set designed to add a clean "
            "finishing detail to everyday outfits."
        ),
        "price": 999,
        "compare_price": 1299,
        "sku": "OF-JW-001",
        "stock": 35,
        "category": "Jewelry",
        "is_new": True,
        "is_best_seller": False,
        "image": "/arrivals/ostren-jwel.png",
    },

    # --------------------------------------------------
    # HOMEPAGE - BEST SELLERS
    # --------------------------------------------------

    {
        "name": "Graphic Oversized T-Shirt",
        "slug": "graphic-oversized-tshirt",
        "description": (
            "A statement oversized T-shirt with a bold Ostren Fit graphic "
            "and relaxed everyday silhouette."
        ),
        "price": 1499,
        "compare_price": 1799,
        "sku": "OF-TS-002",
        "stock": 32,
        "category": "T-Shirts",
        "is_new": False,
        "is_best_seller": True,
        "image": "/products/best-sellers/tshirt.png",
    },

    {
        "name": "Oversized Printed Sweatshirt",
        "slug": "oversized-printed-sweatshirt",
        "description": (
            "An oversized sweatshirt with a distinctive printed graphic, "
            "soft feel and relaxed streetwear fit."
        ),
        "price": 1999,
        "compare_price": 2399,
        "sku": "OF-HD-002",
        "stock": 22,
        "category": "Hoodies",
        "is_new": False,
        "is_best_seller": True,
        "image": "/products/best-sellers/sweatshirt.png",
    },

    {
        "name": "Vintage Washed Hoodie",
        "slug": "vintage-washed-hoodie",
        "description": (
            "A vintage-inspired washed hoodie with an oversized silhouette "
            "and premium everyday comfort."
        ),
        "price": 2399,
        "compare_price": 2799,
        "sku": "OF-HD-003",
        "stock": 20,
        "category": "Hoodies",
        "is_new": False,
        "is_best_seller": True,
        "image": "/products/best-sellers/hoodie.png",
    },

    {
        "name": "Relaxed Printed Joggers",
        "slug": "relaxed-printed-joggers",
        "description": (
            "Relaxed-fit joggers with subtle printed detailing and "
            "an easy everyday streetwear finish."
        ),
        "price": 1899,
        "compare_price": 2199,
        "sku": "OF-JG-002",
        "stock": 26,
        "category": "Joggers",
        "is_new": False,
        "is_best_seller": True,
        "image": "/products/best-sellers/joggers.png",
    },

    # --------------------------------------------------
    # SHOP EXCLUSIVES
    # --------------------------------------------------

    {
        "name": "Abstract Back Print Tee",
        "slug": "abstract-back-print-tee",
        "description": (
            "An oversized cream T-shirt featuring a distressed abstract "
            "back graphic and minimal Ostren Fit front branding."
        ),
        "price": 1399,
        "compare_price": 1699,
        "sku": "OF-TS-003",
        "stock": 25,
        "category": "T-Shirts",
        "is_new": True,
        "is_best_seller": False,
        "image": "/products/shop/relaxed tshirt.png",
    },

    {
        "name": "Washed Minimal T-Shirt",
        "slug": "washed-minimal-tshirt",
        "description": (
            "A charcoal washed oversized T-shirt with understated "
            "Ostren Fit branding and a premium worn-in finish."
        ),
        "price": 1299,
        "compare_price": 1599,
        "sku": "OF-TS-004",
        "stock": 27,
        "category": "T-Shirts",
        "is_new": True,
        "is_best_seller": False,
        "image": "/products/shop/tshirt washed.png",
    },

    {
        "name": "Graphic Zip Hoodie",
        "slug": "graphic-zip-hoodie",
        "description": (
            "A washed charcoal zip hoodie featuring a bold distressed "
            "back graphic, metal zip and relaxed oversized fit."
        ),
        "price": 2499,
        "compare_price": 2899,
        "sku": "OF-HD-004",
        "stock": 18,
        "category": "Hoodies",
        "is_new": True,
        "is_best_seller": False,
        "image": "/products/shop/hoodie.png",
    },

    {
        "name": "Oversized Street Sweatshirt",
        "slug": "oversized-street-sweatshirt",
        "description": (
            "A washed oversized sweatshirt with a monochrome mountain "
            "graphic and minimal Ostren Fit detailing."
        ),
        "price": 2099,
        "compare_price": 2499,
        "sku": "OF-HD-005",
        "stock": 21,
        "category": "Hoodies",
        "is_new": True,
        "is_best_seller": False,
        "image": "/products/shop/sweatshirt.png",
    },

    {
        "name": "Wide Leg Utility Joggers",
        "slug": "wide-leg-utility-joggers",
        "description": (
            "Wide-leg utility joggers with oversized cargo pockets, "
            "washed finish and adjustable drawstring waistband."
        ),
        "price": 1999,
        "compare_price": 2399,
        "sku": "OF-JG-003",
        "stock": 23,
        "category": "Joggers",
        "is_new": True,
        "is_best_seller": False,
        "image": "/products/shop/joggers.png",
    },

    {
        "name": "Silver Layered Jewelry Set",
        "slug": "silver-layered-jewelry-set",
        "description": (
            "A coordinated silver-tone jewelry set featuring layered "
            "necklaces, earrings and rings with minimal Ostren detailing."
        ),
        "price": 1199,
        "compare_price": 1499,
        "sku": "OF-JW-002",
        "stock": 30,
        "category": "Jewelry",
        "is_new": True,
        "is_best_seller": False,
        "image": "/products/shop/jwellery.png",
    },

    {
        "name": "Ostren Graphic Bottle",
        "slug": "ostren-graphic-bottle",
        "description": (
            "A matte black reusable bottle with minimal Ostren branding, "
            "carry handle and clean everyday design."
        ),
        "price": 799,
        "compare_price": 999,
        "sku": "OF-LS-001",
        "stock": 40,
        "category": "Mugs & Bottles",
        "is_new": True,
        "is_best_seller": False,
        "image": "/products/shop/bottle.png",
    },

    {
        "name": "Custom Memory Photo Frame",
        "slug": "custom-memory-photo-frame",
        "description": (
            "A personalized black photo frame designed for your favorite "
            "memories, prints and custom photo collections."
        ),
        "price": 899,
        "compare_price": 1199,
        "sku": "OF-PF-001",
        "stock": 20,
        "category": "Photo Frames",
        "is_new": True,
        "is_best_seller": False,
        "image": "/products/shop/frame.png",
    },
]


def seed_database():
    with app.app_context():

        print("Seeding Ostren Fit database...")

        try:
            category_map = {}

            # --------------------------------------------------
            # CREATE / UPDATE CATEGORIES
            # --------------------------------------------------

            for category_data in categories_data:
                category = Category.query.filter_by(
                    slug=category_data["slug"]
                ).first()

                if not category:
                    category = Category(
                        name=category_data["name"],
                        slug=category_data["slug"],
                        description=category_data[
                            "description"
                        ],
                    )

                    db.session.add(category)
                    db.session.flush()

                    print(
                        f"Created category: {category.name}"
                    )

                else:
                    category.name = category_data[
                        "name"
                    ]
                    category.description = category_data[
                        "description"
                    ]

                    print(
                        f"Updated category: {category.name}"
                    )

                category_map[
                    category_data["name"]
                ] = category

            # --------------------------------------------------
            # CREATE / UPDATE PRODUCTS
            # --------------------------------------------------

            for product_data in products_data:

                product = Product.query.filter_by(
                    slug=product_data["slug"]
                ).first()

                category = category_map.get(
                    product_data["category"]
                )

                if not category:
                    print(
                        "Missing category for:",
                        product_data["name"],
                    )
                    continue

                if not product:
                    product = Product(
                        name=product_data["name"],
                        slug=product_data["slug"],
                        description=product_data[
                            "description"
                        ],
                        price=product_data["price"],
                        compare_price=product_data.get(
                            "compare_price"
                        ),
                        sku=product_data["sku"],
                        stock=product_data["stock"],
                        category=category,
                        is_active=True,
                        is_new=product_data.get(
                            "is_new",
                            False
                        ),
                        is_best_seller=product_data.get(
                            "is_best_seller",
                            False
                        ),
                    )

                    db.session.add(product)
                    db.session.flush()

                    print(
                        f"Created product: {product.name}"
                    )

                else:
                    product.name = product_data["name"]
                    product.description = product_data[
                        "description"
                    ]
                    product.price = product_data["price"]
                    product.compare_price = product_data.get(
                        "compare_price"
                    )
                    product.sku = product_data["sku"]
                    product.stock = product_data["stock"]
                    product.category = category
                    product.is_active = True
                    product.is_new = product_data.get(
                        "is_new",
                        False
                    )
                    product.is_best_seller = (
                        product_data.get(
                            "is_best_seller",
                            False
                        )
                    )

                    print(
                        f"Updated product: {product.name}"
                    )

                # --------------------------------------------------
                # PRODUCT IMAGE
                # --------------------------------------------------

                image = ProductImage.query.filter_by(
                    product_id=product.id,
                    sort_order=0,
                ).first()

                if not image:
                    image = ProductImage(
                        product_id=product.id,
                        image_url=product_data["image"],
                        alt_text=(
                            f"{product_data['name']} - "
                            "Ostren Fit"
                        ),
                        sort_order=0,
                    )

                    db.session.add(image)

                    print(
                        f"Added image: {product.name}"
                    )

                else:
                    image.image_url = product_data[
                        "image"
                    ]
                    image.alt_text = (
                        f"{product_data['name']} - "
                        "Ostren Fit"
                    )

            db.session.commit()

            print("")
            print(
                "Ostren Fit database seeded successfully."
            )
            print(
                f"Categories: {len(categories_data)}"
            )
            print(
                f"Products: {len(products_data)}"
            )

        except Exception as error:
            db.session.rollback()

            print("")
            print("Seed failed.")
            print(error)


if __name__ == "__main__":
    seed_database()