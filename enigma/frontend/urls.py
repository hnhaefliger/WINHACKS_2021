from django.urls import path
from .views import index, map, admin_panel

urlpatterns = [
    path('', index),
    path('map', map),
    path('admin_panel', admin_panel),
]