from django.db import models

from .utils import createUUID

class Instrument(models.Model):
    '''
    Model for data about an instrument type.

    Examples:
        - Mass spectrometer
        - Confocal microscope
        - Flow cytometer
        - Centrifuge
        - Fluorometer
    '''
    class Meta:
        verbose_name = 'Instrument'
        verbose_name_plural = 'Instruments'

    public_id = models.CharField(max_length=32, default=createUUID, editable=False, unique=True)

    name = models.CharField(max_length=128, unique=True)

    def __str__(self):
        return self.name