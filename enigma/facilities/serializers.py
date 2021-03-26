from rest_framework import serializers
from .models import Facility

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
        '''
        return data