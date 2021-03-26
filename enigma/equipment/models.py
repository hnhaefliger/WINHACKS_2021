from django.db import models

from .utils import createUUID

class Equipment(models.Model):
    '''
    Model for data about medical equipment.

    Fields to include:
        - # of people trained
        - # of researchers using them
        - # of publications
        - # of students
        - # of samples processed
        - (Facility)
    '''
    public_id = models.CharField(max_length=32, default=createUUID, editable=False, unique=True)

    instrument = models.CharField(max_length=128)

    trained = models.IntegerField(default=0)
    researchers = models.IntegerField(default=0)
    publications = models.IntegerField(default=0)
    students = models.IntegerField(default=0)
    samples = models.IntegerField(default=0)

    facility = models.ForeignKey('facilities.facility', on_delete=models.SET_NULL, null=True, to_field='public_id')