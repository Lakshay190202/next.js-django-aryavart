from django.urls import path
from .views import SignupView, CustomTokenObtainPairView, DeleteUser, CustomTokenBlackListView
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('signin/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('signin/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('signout/', CustomTokenBlackListView.as_view(), name='auth_signout'),
    path('du/<int:user_id>/', DeleteUser.as_view(), name='delete_user'),
    
    ]