from app import app
from extensions import db
from models import Category, Product


categories_data = [
    {
        "name": "Essentials",
        "slug": "essentials",
        "description": "Everyday pieces, refined.",
    },
    {
        "name": "Classics",
        "slug": "classics",
        "description": "Timeless forms for modern wardrobes.",
    },
    {
        "name": "Signature",
        "slug": "signature",
        "description": "Distinctly Ostrin.",
    },
    {
        "name": "Minimal",
        "slug": "minimal",
        "description": "Clean design, quiet confidence.",
    },
]


products_data = [
    {
        "name": "Ostrin Essential",
        "slug": "ostrin-essential",
        "description": "A clean everyday essential designed with a timeless Ostrin aesthetic.",
        "price": 1499,
        "sku": "OST-001",
        "stock": 25,
        "category": "Essentials",
        "is_new": True,
    },
    {
        "name": "Signature Classic",
        "slug": "signature-classic",
        "description": "A refined classic with a modern silhouette and effortless appeal.",
        "price": 1899,
        "sku": "OST-002",
        "stock": 18,
        "category": "Classics",
        "is_new": True,
    },
    {
        "name": "Everyday Edit",
        "slug": "everyday-edit",
        "description": "Thoughtfully designed for everyday use with a minimal aesthetic.",
        "price": 1699,
        "sku": "OST-003",
        "stock": 20,
        "category": "Essentials",
    },
    {
        "name": "Modern Essential",
        "slug": "modern-essential",
        "description": "A contemporary essential created for a modern, understated wardrobe.",
        "price": 2099,
        "sku": "OST-004",
        "stock": 14,
        "category": "Essentials",
        "is_new": True,
    },
    {
        "name": "Ostrin Signature",
        "slug": "ostrin-signature",
        "description": "One of Ostrin's signature pieces, balancing simplicity and character.",
        "price": 1999,
        "sku": "OST-005",
        "stock": 22,
        "category": "Signature",
        "is_best_seller": True,
    },
    {
        "name": "Classic Form",
        "slug": "classic-form",
        "description": "A versatile classic built around clean lines and timeless proportions.",
        "price": 2299,
        "sku": "OST-006",
        "stock": 16,
        "category": "Classics",
        "is_best_seller": True,
    },
    {
        "name": "Daily Essential",
        "slug": "daily-essential",
        "description": "An easy everyday choice designed to fit seamlessly into your routine.",
        "price": 1799,
        "sku": "OST-007",
        "stock": 28,
        "category": "Essentials",
        "is_best_seller": True,
    },
    {
        "name": "The Essential Edit",
        "slug": "the-essential-edit",
        "description": "A considered Ostrin essential combining modern design with everyday comfort.",
        "price": 2499,
        "sku": "OST-008",
        "stock": 12,
        "category": "Signature",
        "is_best_seller": True,
    },
    {
        "name": "Minimal Form",
        "slug": "minimal-form",
        "description": "A minimal design focused on clean details and effortless styling.",
        "price": 2199,
        "sku": "OST-009",
        "stock": 17,
        "category": "Minimal",
    },
    {
        "name": "Ostrin Daily",
        "slug": "ostrin-daily",
        "description": "An uncomplicated everyday piece made for modern living.",
        "price": 1599,
        "sku": "OST-010",
        "stock": 30,
        "category": "Essentials",
    },
    {
        "name": "Studio Classic",
        "slug": "studio-classic",
        "description": "A polished classic with a subtle contemporary edge.",
        "price": 2399,
        "sku": "OST-011",
        "stock": 11,
        "category": "Classics",
    },
    {
        "name": "Modern Signature",
        "slug": "modern-signature",
        "description": "A refined signature design that represents the modern Ostrin aesthetic.",
        "price": 2699,
        "sku": "OST-012",
        "stock": 9,
        "category": "Signature",
        "is_new": True,
    },
]


def seed_database():
    with app.app_context():

        print("Seeding Ostrin database...")

        category_map = {}

        for category_data in categories_data:
            category = Category.query.filter_by(
                slug=category_data["slug"]
            ).first()

            if not category:
                category = Category(
                    name=category_data["name"],
                    slug=category_data["slug"],
                    description=category_data["description"],
                )

                db.session.add(category)
                db.session.flush()

                print(
                    f"Created category: {category.name}"
                )

            category_map[
                category_data["name"]
            ] = category

        for product_data in products_data:
            existing_product = Product.query.filter_by(
                slug=product_data["slug"]
            ).first()

            if existing_product:
                print(
                    f"Skipped existing product: {existing_product.name}"
                )
                continue

            category = category_map.get(
                product_data["category"]
            )

            product = Product(
                name=product_data["name"],
                slug=product_data["slug"],
                description=product_data["description"],
                price=product_data["price"],
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

            print(
                f"Created product: {product.name}"
            )

        db.session.commit()

        print("Database seeded successfully.")


if __name__ == "__main__":
    seed_database()