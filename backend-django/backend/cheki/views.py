from cheki.models import CustomUser
from .serializers import UserSerializer
from rest_framework import generics, status
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


class SignupView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def encrypt_password(self, password):
        password = self.request.data('password')
        encrypted_password = make_password(password)
        return encrypted_password


class CustomTokenObtainPairView(TokenObtainPairView):


    def post(self, request, *args, **kwargs):
        identifier = request.data.get('username')
        password = request.data.get('password')

        if '@' in identifier:
            user = CustomUser.objects.get(email=identifier)
        else:
            user = CustomUser.objects.get(username=identifier)

        try:
            if check_password(password, user.password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'id': user.id
                })
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except CustomUser.DoesNotExist:
            return Response({'error': "User doesn't exist"}, status=status.HTTP_404_NOT_FOUND)


@method_decorator(csrf_exempt, name='dispatch')
class CustomTokenBlackListView(TokenBlacklistView):

    def post(self, request, *args, **kwargs):
        Refresh_Token = request.data.get('token')
        refresh = RefreshToken(Refresh_Token)
        refresh.blacklist()
        return Response({'message': 'Token blacklisted successfully'}, status=status.HTTP_200_OK)


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get('refreshtoken')
        refresh = RefreshToken(refresh_token)
        access_token = str(refresh.access_token)
        Response({
            'access': access_token,
        })


class DeleteUser(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        user_id = request.data.get('user_id')

        if user.id != user_id:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            user.delete()
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({'error': "User doesn't exist"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
