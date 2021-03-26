from rest_framework import routers
from .views import FacilityViewSet

router = routers.DefaultRouter()

router.register('', FacilityViewSet, basename='')

urlpatterns = router.urls