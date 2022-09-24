"""create stats table

Revision ID: e253db173640
Revises: bbcecbc27916
Create Date: 2022-09-24 00:23:04.473504

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "e253db173640"
down_revision = "bbcecbc27916"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "stats",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("publisher", sa.Text),
        sa.Column("scraped", sa.Integer),
        sa.Column("relevant", sa.Integer),
        sa.Column("date_saved", sa.Date),
    )


def downgrade():
    op.drop_table("stats")
