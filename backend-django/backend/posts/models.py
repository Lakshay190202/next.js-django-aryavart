from django.db import models

class Post(models.Model):
  user = models.ForeignKey('cheki.CustomUser', on_delete=models.CASCADE)
  image = models.ImageField(upload_to='images/', null=True, blank=True)
  video = models.FileField(upload_to='videos/', null=True, blank=True)
  likes = models.BigIntegerField(default=0)
  likes_by = models.ManyToManyField('cheki.CustomUser', related_name='liked_posts')
  type = models.ManyToManyField('cheki.Interest', related_name='posts_of_type')
  upload_time = models.DateTimeField(auto_now_add=True)
  is_hidden = models.BooleanField(default=False)
  caption = models.TextField(max_length=500, default=' ',null=False, blank=False)

