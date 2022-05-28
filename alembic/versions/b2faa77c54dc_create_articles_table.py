"""create articles table

Revision ID: b2faa77c54dc
Revises: 
Create Date: 2022-05-28 15:48:04.582959

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b2faa77c54dc'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'articles',
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("headline", sa.Text),
        sa.Column("link", sa.Text),
        sa.Column("image", sa.Text),
        sa.Column("time_posted", sa.Text),
        sa.Column("publisher", sa.Text),
    )


def downgrade():
    op.drop_table('articles')
