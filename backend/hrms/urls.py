# from rest_framework.routers import DefaultRouter
# from .views import EmployeeViewSet, AttendanceViewSet

# router = DefaultRouter()
# router.register(r'employees', EmployeeViewSet)
# router.register(r'attendance', AttendanceViewSet)

# urlpatterns = router.urls


from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, AttendanceViewSet, current_user

router = DefaultRouter()
router.register("employees", EmployeeViewSet, basename="employee")
router.register("attendance", AttendanceViewSet, basename="attendance")

urlpatterns = [
    path("", include(router.urls)),
    path("user/", current_user, name="current_user"),
]