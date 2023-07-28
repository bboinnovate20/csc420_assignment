from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from todos.models import Category, Task
from todos.serializers import TaskSerializer, CategorySerializer
from django.http import Http404
from django.shortcuts import render

class ListTaskView(APIView):
    # 1. List all
    def get(self, request, *args, **kwargs):
        '''
        List all the todo items
        '''
        task = Task.objects.all()
        serializer = TaskSerializer(task, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    def get_object(self, task_id, *args, **kwargs):
        '''
        List all the todo items
        '''
        try:
            return Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            return None
        
    
    # 2. Create
    def post(self, request, *args, **kwargs):
        '''
        Create the Todo with given todo data
        '''
        data = {
            'title': request.data.get('title'), 
            'description': request.data.get('description'), 
            'category': request.data.get('category'),
            'status': request.data.get('status')
        }
        serializer = TaskSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
         # 4. Update
    def put(self, request, task_id, *args, **kwargs):
        '''
        Updates the todo item with given todo_id if exists
        '''
        task_instance = self.get_object(task_id)
        if not task_instance:
            return Response(
                {"res": "Object with todo id does not exists"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        data = {
            'status': request.data.get('status'), 
        }
        serializer = TaskSerializer(instance = task_instance, data=data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, task_id, *args, **kwargs):
        '''
        Deletes the todo item with given todo_id if exists
        '''
        task_instance = self.get_object(task_id)
        if not task_instance:
            return Response(
                {"res": "Object with todo id does not exists"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        task_instance.delete()
        return Response(
            {"res": "Object deleted!"},
            status=status.HTTP_200_OK
        ) 

class TaskEditView(APIView):
    def get_object(self, task_id, *args, **kwargs):
        '''
        List all the todo items
        '''
        try:
            return Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            return None
        
    def put(self, request, task_id, *args, **kwargs):
        '''
        Updates the todo item with given todo_id if exists
        '''
        task_instance = self.get_object(task_id)
        if not task_instance:
            return Response(
                {"res": "Object with todo id does not exists"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        data = {
            'title':request.data.get('title'),
            'description':request.data.get('description'),
            'category':request.data.get('category'),
            'status': request.data.get('status'), 
        }
        serializer = TaskSerializer(instance = task_instance, data=data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryAllView(APIView):
    # 1. List all
    def get(self, request, *args, **kwargs):
        category = Category.objects.all()
        serializer = CategorySerializer(category, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


class CategoryDetailView(APIView):
    
    def get_object(self, category_id, *args, **kwargs):
        
        try:
            return Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return None
    
    def get(self, request, category_id, *args, **kwargs):
        
        category_instance = self.get_object(category_id)
        if not category_instance:
            return Response(
                {"res": "Object with todo id does not exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = CategorySerializer(category_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

def index(request):
    return render(request, "index.html")


def single(request, task_id):
    try:
        print(task_id)
        task = Task.objects.get(pk=task_id)
    except Task.DoesNotExist:
        raise Http404("Task does not exist")
    return render(request, "index2.html", {"task": task})