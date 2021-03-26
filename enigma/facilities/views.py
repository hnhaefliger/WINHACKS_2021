from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import NotFound

from .serializers import FacilitySerializer
from .models import Facility
from equipment.models import Equipment

class FacilityViewSet(viewsets.ViewSet):
    '''
    Facility endpoint.
    '''
    lookup_url_kwarg = 'lookup_value'

    def retrieve(self, request, *args, **kwargs):
        '''
        Get information about a specific facility.
        '''
        try: # search by id
            facility = Facility.objects.get(public_id=kwargs['lookup_value'])
            return Response(data={'id': facility.public_id, 'name': facility.name, 'location': facility.location}, status=status.HTTP_200_OK)

        except:
            try: # search by name
                facility = Facility.objects.get(name=kwargs['lookup_value'])
                return Response(data={'id': facility.public_id, 'name': facility.name, 'location': facility.location}, status=status.HTTP_200_OK)

            except:
                raise NotFound('This facility does not exist.')

    def create(self, request, *args, **kwargs):
        '''
        Create a new facility.
        '''
        serializer = FacilitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        facility = serializer.save()
        return Response(data={'id': facility.public_id, 'name': facility.name, 'location': facility.location}, status=status.HTTP_200_OK)
    
    def get(self, request, *args, **kwargs):
        '''
        List all facilities
        '''
        data = []

        for facility in Facility.objects.all():
            data.append({
                'id': facility.public_id,
                'name': facility.name,
                'location': facility.location,
                'equipment': [object.public_id for object in Equipment.objects.filter(facility=facility)],
            })

        return Response(data=data, status=status.HTTP_200_OK)
    
    def options(self, *args, **kwargs):
        return Response(data={'detail': 'Method \"OPTIONS\" not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)