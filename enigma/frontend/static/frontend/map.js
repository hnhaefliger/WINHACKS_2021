mapboxgl.accessToken = 'pk.eyJ1Ijoiam9lYWxmIiwiYSI6ImNrbXIyNHF3YTAzcHoydnBuc2x1YjRyZ3QifQ.UbmitObJVmkFyJFSC2o5cQ'; // this is also bad - remember to revoke access

var features = [];

const makeFeatures = (list) => {
    feat = []

    list.forEach(element => {
        const loc = element.location.split(',');

        feat.push({
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [parseFloat(loc[8]), parseFloat(loc[7])]
            },
            'properties': {
                'title': element.name,
                'description': makeDescription(element),
            }
        })
    });

    return feat;
}

const addInstrument = () => {
    const facility = document.getElementById('facilityid').value;
    console.log(facility);
    const instrument = document.getElementById('insturmenttypeinput').value;
    const trained = document.getElementById('instrumenttrainedinput').value;
    const researchers = document.getElementById('instrumentresearchers')
}

const makeDescription = (element) => {
    return `
            <form class="facilityform" id="createfacilityform">
                <h2>Add a new piece of equipment</h2>
                <div class="form-group">
                  <label for="exampleInputEmail1">Instrument</label>
                  <input type="email" class="form-control" id="instrumenttypeinput" placeholder="Choose an instrument type">
                </div>
                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <label for="exampleInputEmail1">Trained</label>
                            <input type="email" class="form-control" id="instrumenttrainedinput" placeholder="#">
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label for="exampleInputEmail1">Researchers</label>
                            <input type="email" class="form-control" id="instrumentresearchersinput" placeholder="#">
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label for="exampleInputEmail1">Students</label>
                            <input type="email" class="form-control" id="instrumentstudentsinput" placeholder="#">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <label for="exampleInputEmail1">Publications</label>
                            <input type="email" class="form-control" id="instrumentpublicationsinput" placeholder="#">
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label for="exampleInputEmail1">Samples</label>
                            <input type="email" class="form-control" id="instrumentsamplesinput" placeholder="#">
                        </div>
                    </div>
                    <input type="hidden" id="facilityid" value="${element.id}" />
                </div>
                <button type="button" id="addinstrument" class="btn btn-primary addinstrument">Add</button>
            </form>
    `;
}

$.ajax({
    url: '/api/facilities/',
    success: (res) => {
        features = makeFeatures(res);
    },
});

navigator.geolocation.getCurrentPosition(position => { 
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [position.coords.longitude, position.coords.latitude],
        zoom: 5,
    });

    map.on('load', function () {
        map.loadImage(
            'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
            function (error, image) {
                if (error) throw error;
                map.addImage('custom-marker', image);
                map.addSource('places', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': features,
                    }
                });
                
                // Add a symbol layer
                map.addLayer({
                    'id': 'places',
                    'type': 'symbol',
                    'source': 'places',
                    'layout': {
                        'icon-image': 'custom-marker',
                        'text-field': ['get', 'title'],
                        'text-font': [
                            'Open Sans Semibold',
                            'Arial Unicode MS Bold'
                        ],
                        'text-offset': [0, 1.25],
                        'text-anchor': 'top',
                        'icon-allow-overlap': false,
                    }
                });

                map.on('click', 'places', function (e) {
                    var coordinates = e.features[0].geometry.coordinates.slice();
                    var description = e.features[0].properties.description;
                     
                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                     
                    new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(description)
                    .addTo(map);

                    const buttons = document.getElementsByClassName("addinstrument");

                    for (let button of buttons) {
                        button.addEventListener('click', (event) => {
                            addInstrument();
                        });
                    };
                });
                     
                // Change the cursor to a pointer when the mouse is over the places layer.
                map.on('mouseenter', 'places', function () {
                    map.getCanvas().style.cursor = 'pointer';
                });
                     
                // Change it back to a pointer when it leaves.
                map.on('mouseleave', 'places', function () {
                    map.getCanvas().style.cursor = '';
                });
            }
        );
    });
});

