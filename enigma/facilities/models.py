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
    public_id = models.CharField(max_length=32, default=createUUID, editable=False, unique=True)

    name = models.CharField(max_length=256)
    location = models.CharField(max_length=256)
