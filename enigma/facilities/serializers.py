from rest_framework import serializers
from .models import Facility
from rest_framework.exceptions import NotAcceptable

class FacilitySerializer(serializers.Serializer):
    '''
    Serializer for the facility class.
    '''
    name = serializers.CharField()
    location = serializers.CharField()

    def create(self, validated_data):
        '''
        Create a new facility.
        '''
        return Facility.objects.create(
            name=validated_data['name'],
            location=validated_data['location'],
        )

    def update(self, instance, validated_data):
        '''
        Update a facility's data.
        '''
        instance.name = validated_data.get('name', instance.name)
        instance.location = validated_data.get('location', instance.location)
        instance.save()
        return instance

    def validate(self, data):
        '''
        Validation for facility.

        Todo:
            - Validate location
        '''
        try:
            Facility.objects.get(name=data['name'])
            
        except:
            try:
                Facility.objects.get(location=data['location'])

            except:
                return data

            raise NotAcceptable('There is already a facility at this address.')

        raise NotAcceptable('A facility with this name already exists.')