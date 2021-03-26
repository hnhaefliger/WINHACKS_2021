from rest_framework import serializers
from rest_framework.exceptions import NotFound

from .models import Equipment
from facilities.models import Facility

class EquipmentSerializer(serializers.Serializer):
    '''
    Serializer for the equipment class.
    '''
    instrument = serializers.CharField()
    trained = serializers.IntegerField()
    researchers = serializers.IntegerField()
    publications = serializers.IntegerField()
    students = serializers.IntegerField()
    samples = serializers.IntegerField()

    facility = serializers.CharField()

    def create(self, validated_data):
        '''
        Create a new piece of equipment.
        '''
        return Equipment.objects.create(
            instrument=validated_data['instrument'],
            trained=validated_data['trained'],
            researchers=validated_data['researchers'],
            publications=validated_data['publications'],
            students=validated_data['students'],
            samples=validated_data['samples'],
            facility=validated_data['facility'],
        )

    def update(self, instance, validated_data):
        '''
        Update a piece of equipment's data.
        '''
        instance.trained = validated_data.get('trained', instance.trained)
        instance.researchers = validated_data.get('researchers', instance.researchers)
        instance.publications = validated_data.get('publications', instance.publications)
        instance.students = validated_data.get('students', instance.students)
        instance.samples = validated_data.get('sample', instance.samples)
        instance.facility = validated_data.get('facility', instance.facility)
        instance.save()
        return instance

    def validate(self, data):
        '''
        Validation for equipment.
        '''
        data['instrument'] = data['instrument'].lower()

        try:
            facility = Facility.objects.get(public_id=data['facility'])

        except:
            raise NotFound({'facility': 'This facility does not exist'})

        data['facility'] = facility
        return data