"""create weather table

Revision ID: bbcecbc27916
Revises: b2faa77c54dc
Create Date: 2022-05-28 15:55:39.050787

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import REAL


# revision identifiers, used by Alembic.
revision = "bbcecbc27916"
down_revision = "b2faa77c54dc"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "weather",
        sa.Column("weather_location", sa.String(50), primary_key=True),
        sa.Column("temp", REAL),
        sa.Column("humidity", REAL),
        sa.Column("weather_code", sa.Integer),
        sa.Column("weather_description", sa.Text),
        sa.Column("sunrise", sa.Integer),
        sa.Column("sunset", sa.Integer),
        sa.Column("wind_speed", sa.Integer),
        sa.Column("wind_direction", sa.Text),
    )


def downgrade():
    op.drop_table("weather")
