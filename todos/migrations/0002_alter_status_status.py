# Generated by Django 4.2.3 on 2023-07-23 12:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todos', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='status',
            name='status',
            field=models.IntegerField(default=0),
        ),
    ]