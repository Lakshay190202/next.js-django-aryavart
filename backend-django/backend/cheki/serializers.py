from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		fields = ('email', 'username', 'name', 'password', 'profile_picture')
		extra_kwargs = {'password': {'write_only': True}}

	def create(self, validated_data):
		if 'profile_picture' not in validated_data:
			validated_data['profile_picture'] = 'images/Default_pfp.svg'
		user = CustomUser(
			email = validated_data['email'],
			username = validated_data['username'],
			name = validated_data['name'],
			profile_picture = validated_data['profile_picture']
		)
		user.set_password(validated_data['password'])
		user.save()
		return user
	
