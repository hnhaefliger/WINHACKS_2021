from rest_framework import routers
from .views import InstrumentViewSet

router = routers.DefaultRouter()

router.register('', InstrumentViewSet, basename='')

urlpatterns = router.urls