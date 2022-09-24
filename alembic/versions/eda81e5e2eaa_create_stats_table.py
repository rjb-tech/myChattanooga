"""create stats table

Revision ID: eda81e5e2eaa
Revises: 334384f30fdf
Create Date: 2022-09-24 19:30:54.170488

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "eda81e5e2eaa"
down_revision = "334384f30fdf"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "stats",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("publisher", sa.Text),
        sa.Column("scraped", sa.Integer),
        sa.Column("relevant", sa.Integer),
        sa.Column("date_saved", sa.Date, default=sa.sql.functions.current_date()),
    )


def downgrade():
    op.drop_table("stats")
