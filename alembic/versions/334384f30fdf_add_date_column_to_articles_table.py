"""add date column to articles table

Revision ID: 334384f30fdf
Revises: bbcecbc27916
Create Date: 2022-09-24 19:30:47.467265

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "334384f30fdf"
down_revision = "eda81e5e2eaa"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "articles",
        sa.Column("date_saved", sa.Date, server_default=sa.text("CURRENT_DATE")),
    )


def downgrade():
    op.drop_column("articles", "date_saved")
