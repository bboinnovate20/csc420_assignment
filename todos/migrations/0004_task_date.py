# Generated by Django 4.2.3 on 2023-07-28 22:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todos', '0003_status_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='date',
            field=models.DateTimeField(auto_now=True),
        ),
    ]