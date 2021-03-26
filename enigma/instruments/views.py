from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import NotFound

from .models import Instrument

class InstrumentViewSet(viewsets.ViewSet):
    '''
    Instrument endpoint.
    '''
    lookup_url_kwarg = 'lookup_value'

    def retrieve(self, request, *args, **kwargs):
        '''
        Get information about a specific instrument class.
        '''
        try: # search by id
            instrument = Instrument.objects.get(public_id=kwargs['lookup_value'])
            return Response(data={
                'id': instrument.public_id,
                'name': instrument.name,
            }, status=status.HTTP_200_OK)

        except:
            try: # search by name
                instrument = Instrument.objects.get(name=kwargs['lookup_value'])
                return Response(data={
                    'id': instrument.public_id,
                    'name': instrument.name,
                }, status=status.HTTP_200_OK)

            except:
                raise NotFound('This piece of equipment does not exist.')

    def create(self, request, *args, **kwargs):
        return Response(data={'detail': 'Method \"POST\" not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def get(self, request, *args, **kwargs):
        '''
        List all pieces of equipment.
        '''
        data = []

        for instrument in Instrument.objects.all():
            data.append({
                'id': instrument.public_id,
                'name': instrument.name,
            })

        return Response(data=data, status=status.HTTP_200_OK)
    
    def options(self, *args, **kwargs):
        return Response(data={'detail': 'Method \"OPTIONS\" not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)