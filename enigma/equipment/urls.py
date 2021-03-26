from rest_framework import routers
from .views import EquipmentViewSet

router = routers.DefaultRouter()

router.register('', EquipmentViewSet, basename='')

urlpatterns = router.urls