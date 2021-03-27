from rest_framework import serializers
from .models import Facility
from rest_framework.exceptions import NotAcceptable
import requests
import warnings

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
        data['name'] = data['name'].lower()
        data['location'] = data['location'].lower()

        key = 'dbAdsZpWeKfGbQQGKjD3juo4G5JWmIrt' # this isn't really best practice - remember to revoke key access after hackathon
        location = data['location'].replace(' ', '+')
        response = requests.get(f'http://www.mapquestapi.com/geocoding/v1/address?key={key}&location={location}', verify=False)
        location = response.json()['results'][0]['locations'][0]
        location = location['street'] + ',' + location['adminArea6'] + ',' + location['adminArea5'] + ',' + location['adminArea4'] + ',' + location['adminArea3'] + ',' + location['adminArea1'] + ',' + location['postalCode'] + ',' + str(location['latLng']['lat']) + ',' + str(location['latLng']['lng'])
        data['location'] = location

        try:
            Facility.objects.get(name=data['name'])
            
        except:
            try:
                Facility.objects.get(location=data['location'])

            except:
                return data

            raise NotAcceptable('There is already a facility at this address.')

        raise NotAcceptable('A facility with this name already exists.')