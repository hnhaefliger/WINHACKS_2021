from django.contrib import admin
from django.contrib.admin.utils import quote
from django.contrib.admin.views.main import ChangeList
from django.core.exceptions import ValidationError
from django.urls import reverse

from .models import Instrument

class InstrumentAdmin(admin.ModelAdmin):
    fields = ('name',)
    readonly_fields = ('id', 'public_id')

    def id(self, obj): return obj.id
    def public_id(self, obj): return obj.public_id
    
admin.site.register(Instrument, InstrumentAdmin)