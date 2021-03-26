from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('frontend.urls')),
    path('api/data/', include('data.urls')),
    path('api/equipment/', include('equipment.urls')),
    path('admin/', admin.site.urls),
]