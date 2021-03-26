from django.db import models

from .utils import createUUID

class Equipment(models.Model):
    '''
    Model for data about medical equipment.
    '''
    public_id = models.CharField(max_length=32, default=createUUID, editable=False, unique=True)