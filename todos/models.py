from django.db import models

# Create your models here.

class Category(models.Model):
    title = models.CharField(max_length=200);
    color = models.CharField(max_length=20);
    

class Status(models.Model):
    status = models.IntegerField(default=0);
    name = models.CharField(max_length=50, default="");

class Task(models.Model):
    title = models.CharField(max_length=200);
    description = models.CharField(max_length=200);
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    status = models.ForeignKey(Status, on_delete=models.CASCADE)
    