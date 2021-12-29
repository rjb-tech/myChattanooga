from django.urls import path
from . import views

urlpatterns = [
    # Empty path string = homepage
    path('', views.home, name = 'site-home'),
    path('faq/', views.faq, name = 'site-about'),
    path('stats/', views.stats, name = 'stats'),
    #path('brews/', views.brews, name = 'brews')
    #path('newslettergen/', views.newsletter_gen, name = 'newsletter-generator'),
    #path('signup/', views.newsletter_signup, name = 'newsletter-signup')
]
