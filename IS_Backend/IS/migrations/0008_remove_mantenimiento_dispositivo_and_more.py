# Generated by Django 5.1.4 on 2025-07-06 18:24

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('IS', '0007_dispositivoiot_fecha_registro_and_more'),
        ('contenttypes', '0002_remove_content_type_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='mantenimiento',
            name='dispositivo',
        ),
        migrations.AddField(
            model_name='mantenimiento',
            name='content_type',
            field=models.ForeignKey(default=10, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='mantenimiento',
            name='object_id',
            field=models.PositiveIntegerField(default=1),
            preserve_default=False,
        ),
    ]
