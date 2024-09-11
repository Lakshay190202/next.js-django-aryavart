from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models


class Interest(models.Model):
	name = models.CharField(max_length=50)

	def __str__(self) -> str:
		return self.name
	

class UserManager(BaseUserManager):
	def create_user(self, email, username, name, password=None, profile_picture=None, interests =None, Bio=None):
		if not email:
			raise ValueError('Users must have an email address')
		if not username:
			raise ValueError('Users must have a username')
		if not name:
			raise ValueError('Users must have a name')
		
		user = self.model(
			email=self.normalize_email(email),
			username=username,
			name=name,
			profile_picture = profile_picture,
			interests = interests,
			Bio = Bio
		)
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, email, username, name, password=None, profile_picture=None):
		user = self.create_user(email, username, name, password, profile_picture)
		user.is_admin = True
		user.save(using=self._db)
		return user

class CustomUser(AbstractBaseUser):
	email = models.EmailField(unique=True)
	username = models.CharField(max_length=30, unique=True)
	name = models.CharField(max_length=50)
	profile_picture = models.ImageField(upload_to='images/profilepictures', null=True, blank=True)
	interests = models.ManyToManyField(Interest, related_name='users')
	Bio = models.TextField(null=True, blank=True)
	is_active = models.BooleanField(default=True)
	is_admin = models.BooleanField(default=False)

	objects = UserManager()

	USERNAME_FIELD = 'email' 
	REQUIRED_FIELDS = ['username', 'name']

