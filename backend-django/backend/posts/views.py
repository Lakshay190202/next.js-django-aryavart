from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import viewsets, status, generics
from rest_framework.views import APIView
from posts.models import Post
from posts.serializers import PostSerializer
from posts.pagination import HomePagePagination



class PostViewSet(viewsets.ModelViewSet):
  queryset = Post.objects.all()
  serializer_class = PostSerializer
  permission_classes = [IsAuthenticated]
  
  def create(self, request, *args, **kwargs):
    user = request.user
    data = request.data.dict()
    data['user'] = user.id
    
    if not data.get('caption'):
      data['caption'] = 'Uploaded by ' + user.name

    serializer = self.get_serializer(data=data)
    serializer.is_valid(raise_exception=True)
    self.perform_create(serializer)
    headers =self.get_success_headers(serializer.data)
    return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers) 


class UserPostView(APIView):
  permission_classes = [IsAuthenticated]
  
  def get(self, request, *args, **kwargs):
    user = request.user
    posts = Post.objects.filter(user=user)
    serializer = PostSerializer(posts, many=True , context ={ 'request': request})
    return Response(serializer.data)
  
  def delete(self, request, *args, **kwargs):
    user = request.user
    post_id = request.data.get('post_id')
    post = Post.objects.get(id = post_id)
    if post.user== user:
      post.delete()
      return Response(status=status.HTTP_202_ACCEPTED)
    else:
      return Response(status=status.HTTP_401_UNAUTHORIZED)


class LikePost(APIView): 
  permission_classes = [IsAuthenticated]

  def post(self, request, *args, **kwargs):
    user = request.user
    post_id = request.data.get('post_id')
    try:
      post = Post.objects.get(id = post_id)
    except:
      return Response({"error": "Post not found"},status=status.HTTP_404_NOT_FOUND)
    
    if user in post.likes_by.all():
      post.likes_by.remove(user)
      post.likes -= 1
      action = 'unliked'
    else: 
      post.likes_by.add(user)
      post.likes += 1
      action = 'liked'
      for interest in post.type.all():
        user.interests.add(interest)
    
    user.save()
    post.save()
    
    return Response({"Messages": f"Post {action} successfully"}, status=status.HTTP_200_OK)

class likedPostsProfile(APIView):
  permission_classes = [IsAuthenticated]

  def post(self, request,*args, **kwargs):
    user = request.user
    posts = Post.objects.filter(likes_by = user)  
    serializer = PostSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data)

class homePageViewSet(APIView):
  permission_classes = [AllowAny]
  def get(self, request, *args, **kwargs):
    user = request.user
    paginator = HomePagePagination()

    if user.is_authenticated:
       user_interests = user.interests.all()
       posts = Post.objects.filter(type__in=user_interests).distinct()
    else:
      posts = Post.objects.order_by('-likes')
    result_page = paginator.paginate_queryset(posts, request)
    serializer = PostSerializer(result_page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)