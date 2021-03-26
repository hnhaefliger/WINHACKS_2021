from django.db import models

from .utils import createUUID

class DataColumn(models.Model):
    '''
    Class to represent a database column.
    '''
    public_id = models.CharField(max_length=32, default=createUUID, editable=False, unique=True)
    name = models.CharField(max_length=128, )

class DataRow(models.Model):
    '''
    Class to represent a database row (mostly for relationships between entries).
    '''
    public_id = models.CharField(max_length=32, default=createUUID, editable=False, unique=True)

class DataEntry(models.Model):
    '''
    Class for a database entry.
    '''
    public_id = models.CharField(max_length=32, default=createUUID, editable=False, unique=True)