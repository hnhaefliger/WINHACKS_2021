from django.db import models

from .utils import createUUID

class Facility(models.Model):
    '''
    Model for data about medical facility.

    Fields to include:
        - Name
        - Location
        - List of equipment housed there (will be stored in the equipment data)
    '''
    class Meta:
        verbose_name = 'Facility'
        verbose_name_plural = 'Facilities'

    public_id = models.CharField(max_length=32, default=createUUID, editable=False, unique=True)

    name = models.CharField(max_length=256, unique=True)
    location = models.CharField(max_length=256, unique=True)

    def __str__(self):
        return self.name