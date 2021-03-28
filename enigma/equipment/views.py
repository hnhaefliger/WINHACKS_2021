from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import NotFound

from .serializers import EquipmentSerializer
from .models import Equipment
from facilities.models import Facility
from instruments.models import Instrument

class EquipmentViewSet(viewsets.ViewSet):
    '''
    Equipment endpoint.
    '''
    lookup_url_kwarg = 'lookup_value'

    def patch(self, request, *args, **kwargs):
        try:
            print(kwargs['lookup_value'])
            equipment = Equipment.objects.get(public_id=kwargs['lookup_value'])

            serializer = EquipmentSerializer(equipment, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            equipment = serializer.save()

            return Response(data={
                'id': equipment.public_id,
                'instrument': equipment.instrument.name,
                'trained': equipment.trained,
                'researchers': equipment.researchers,
                'publications': equipment.publications,
                'students': equipment.students,
                'samples': equipment.samples,
                'facility': {
                    'id': equipment.facility.public_id,
                    'name': equipment.facility.name,
                    'location': equipment.facility.location,
                },
                'in_use': equipment.in_use,
            }, status=status.HTTP_200_OK)

        except:
            raise NotFound('This piece of equipment does not exist.')

    def retrieve(self, request, *args, **kwargs):
        '''
        Get information about a specific piece of equipment.
        '''
        try: # search by id
            equipment = Equipment.objects.get(public_id=kwargs['lookup_value'])
            return Response(data={
                'id': equipment.public_id,
                'instrument': equipment.instrument.name,
                'trained': equipment.trained,
                'researchers': equipment.researchers,
                'publications': equipment.publications,
                'students': equipment.students,
                'samples': equipment.samples,
                'facility': {
                    'id': equipment.facility.public_id,
                    'name': equipment.facility.name,
                    'location': equipment.facility.location,
                },
                'in_use': equipment.in_use,
            }, status=status.HTTP_200_OK)

        except:
            raise NotFound('This piece of equipment does not exist.')

    def create(self, request, *args, **kwargs):
        '''
        Create a new piece of equipment.
        '''
        serializer = EquipmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        equipment = serializer.save()
        return Response(data={
            'id': equipment.public_id,
            'instrument': equipment.instrument.name,
            'trained': equipment.trained,
            'researchers': equipment.researchers,
            'publications': equipment.publications,
            'students': equipment.students,
            'samples': equipment.samples,
            'facility': {
                    'id': equipment.facility.public_id,
                    'name': equipment.facility.name,
                    'location': equipment.facility.location,
            },
            'in_use': equipment.in_use,
        }, status=status.HTTP_200_OK)
    
    def get(self, request, *args, **kwargs):
        '''
        List all pieces of equipment.
        '''
        data = []
        
        filtered = Equipment.objects.all()

        if 'instrument' in request.GET:
            try:
                instrument = Instrument.objects.get(public_id=request.GET['instrument'])
                filtered = filtered.filter(instrument=instrument)

            except:
                pass

        if 'facility' in request.GET:
            try:
                facility = Facility.objects.get(public_id=request.GET['facility'])
                filtered = filtered.filter(facility=facility)

            except: pass

        for equipment in filtered:
            data.append({
                'id': equipment.public_id,
                'instrument': equipment.instrument.name,
                'trained': equipment.trained,
                'researchers': equipment.researchers,
                'publications': equipment.publications,
                'students': equipment.students,
                'samples': equipment.samples,
                'facility': {
                    'id': equipment.facility.public_id,
                    'name': equipment.facility.name,
                    'location': equipment.facility.location,
                },
                'in_use': equipment.in_use,
            })

        return Response(data=data, status=status.HTTP_200_OK)
    
    def options(self, *args, **kwargs):
        return Response(data={'detail': 'Method \"OPTIONS\" not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)