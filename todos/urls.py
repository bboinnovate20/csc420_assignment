from django.urls import path

from . import views

urlpatterns = [
    # path("", views.index, name="index"),    
    path('', views.index),
    path('api', views.ListTaskView.as_view()),
    path('api/<int:task_id>', views.ListTaskView.as_view()),
    path('api/all/<int:task_id>', views.TaskEditView.as_view()),
    path('api/category', views.CategoryAllView.as_view()),
    path('api/category/<int:category_id>/', views.CategoryDetailView.as_view()),
]

