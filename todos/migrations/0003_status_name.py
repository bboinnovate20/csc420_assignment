# Generated by Django 4.2.3 on 2023-07-23 12:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todos', '0002_alter_status_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='status',
            name='name',
            field=models.CharField(default='', max_length=50),
        ),
    ]
