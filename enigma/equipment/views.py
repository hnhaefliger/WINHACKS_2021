from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

class PlaceholderViewSet(viewsets.ViewSet):
    '''
    Placeholder endpoint.
    '''
    lookup_url_kwarg = 'lookup_value'

    def retrieve(self, request, *args, **kwargs):
        '''
        '''
        return Response(data={'data': kwargs['lookup_value']}, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        '''
        '''
        return Response(data={}, status=status.HTTP_200_OK)
    
    def get(self, request, *args, **kwargs):
        '''
        '''
        return Response(data={}, status=status.HTTP_200_OK)