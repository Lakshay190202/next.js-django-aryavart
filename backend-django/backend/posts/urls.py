from django.urls import path
from posts.views import PostViewSet , UserPostView ,LikePost, likedPostsProfile, homePageViewSet
from rest_framework.routers import DefaultRouter
from django.urls import include
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register('posts', PostViewSet, basename='posts')


urlpatterns = [
  path('', include(router.urls)),
  path('userposts/', UserPostView.as_view(), name='userposts'),
  path('deleteposts/<int:post_id>/', UserPostView.as_view(), name='deletepost'),
  path('likepost/<int:post_id>/', LikePost.as_view(), name='likepost'),
  path('likedposts/', likedPostsProfile.as_view(), name='likedposts'),
  path('homepage/',homePageViewSet.as_view(), name='homepage'),


]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)