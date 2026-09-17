"""add customization data to order items

Revision ID: e160bb53ff59
Revises: 5ed7b524ea96
Create Date: 2026-09-18 02:55:59.669700
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "e160bb53ff59"
down_revision = "5ed7b524ea96"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table(
        "order_items",
        schema=None,
    ) as batch_op:
        batch_op.add_column(
            sa.Column(
                "customization_data",
                sa.JSON(),
                nullable=True,
            )
        )


def downgrade():
    with op.batch_alter_table(
        "order_items",
        schema=None,
    ) as batch_op:
        batch_op.drop_column(
            "customization_data"
        )