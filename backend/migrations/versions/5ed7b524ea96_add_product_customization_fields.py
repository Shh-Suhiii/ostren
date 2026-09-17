"""add product customization fields

Revision ID: 5ed7b524ea96
Revises: 8838ac72c77e
Create Date: 2026-09-15 09:33:53.849741
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "5ed7b524ea96"
down_revision = "8838ac72c77e"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table(
        "products",
        schema=None
    ) as batch_op:

        batch_op.add_column(
            sa.Column(
                "is_customizable",
                sa.Boolean(),
                nullable=False,
                server_default=sa.false(),
            )
        )

        batch_op.add_column(
            sa.Column(
                "customization_type",
                sa.String(length=50),
                nullable=True,
            )
        )

        batch_op.add_column(
            sa.Column(
                "allow_custom_image",
                sa.Boolean(),
                nullable=False,
                server_default=sa.false(),
            )
        )

        batch_op.add_column(
            sa.Column(
                "allow_custom_text",
                sa.Boolean(),
                nullable=False,
                server_default=sa.false(),
            )
        )

        batch_op.add_column(
            sa.Column(
                "customization_price",
                sa.Numeric(
                    precision=10,
                    scale=2,
                ),
                nullable=False,
                server_default=sa.text("0"),
            )
        )

    # Remove temporary database defaults.
    # Existing rows have already received safe values.
    with op.batch_alter_table(
        "products",
        schema=None
    ) as batch_op:

        batch_op.alter_column(
            "is_customizable",
            server_default=None,
        )

        batch_op.alter_column(
            "allow_custom_image",
            server_default=None,
        )

        batch_op.alter_column(
            "allow_custom_text",
            server_default=None,
        )

        batch_op.alter_column(
            "customization_price",
            server_default=None,
        )


def downgrade():
    with op.batch_alter_table(
        "products",
        schema=None
    ) as batch_op:

        batch_op.drop_column(
            "customization_price"
        )

        batch_op.drop_column(
            "allow_custom_text"
        )

        batch_op.drop_column(
            "allow_custom_image"
        )

        batch_op.drop_column(
            "customization_type"
        )

        batch_op.drop_column(
            "is_customizable"
        )