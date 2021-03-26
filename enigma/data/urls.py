from rest_framework import routers
from .views import PlaceholderViewSet

router = routers.DefaultRouter()

router.register('', PlaceholderViewSet, basename='')

urlpatterns = router.urls