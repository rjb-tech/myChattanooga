from django.db import models
from django.utils import timezone

class Article(models.Model):
    headline = models.TextField()
    link = models.TextField()
    image = models.TextField()
    date_posted = models.DateField()
    time_posted = models.TimeField()
