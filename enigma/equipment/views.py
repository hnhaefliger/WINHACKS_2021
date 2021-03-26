from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import NotFound

from .serializers import EquipmentSerializer
from .models import Equipment

class EquipmentViewSet(viewsets.ViewSet):
    '''
    Equipment endpoint.
    '''
    lookup_url_kwarg = 'lookup_value'

    def retrieve(self, request, *args, **kwargs):
        '''
        Get information about a specific piece of equipment.
        '''
        try: # search by id
            equipment = Equipment.objects.get(public_id=kwargs['lookup_value'])
            return Response(data={
                'id': equipment.public_id,
                'instrument': equipment.instrument,
                'trained': equipment.trained,
                'researchers': equipment.researchers,
                'publications': equipment.publications,
                'students': equipment.students,
                'samples': equipment.samples,
                'facility': equipment.facility.public_id,
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
            'instrument': equipment.instrument,
            'trained': equipment.trained,
            'researchers': equipment.researchers,
            'publications': equipment.publications,
            'students': equipment.students,
            'samples': equipment.samples,
            'facility': equipment.facility.public_id,
        }, status=status.HTTP_200_OK)
    
    def get(self, request, *args, **kwargs):
        '''
        List all pieces of equipment.
        '''
        data = []

        for equipment in Equipment.objects.all():
            data.append({
                'id': equipment.public_id,
                'instrument': equipment.instrument,
                'trained': equipment.trained,
                'researchers': equipment.researchers,
                'publications': equipment.publications,
                'students': equipment.students,
                'samples': equipment.samples,
                'facility': equipment.facility.public_id,
            })

        return Response(data=data, status=status.HTTP_200_OK)
    
    def options(self, *args, **kwargs):
        return Response(data={'detail': 'Method \"OPTIONS\" not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)