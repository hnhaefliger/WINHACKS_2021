mapboxgl.accessToken = 'pk.eyJ1Ijoiam9lYWxmIiwiYSI6ImNrbXIyNHF3YTAzcHoydnBuc2x1YjRyZ3QifQ.UbmitObJVmkFyJFSC2o5cQ'; // this is also bad - remember to revoke access

var equipment = {};
var instruments = []
var facilities = [];

const setEquipment = (id, value) => {
    equipment[id] = value;
}

const setInstruments = (values) => {
    instruments = values;
}

const setFacilities = (values) => {
    facilities = values;
}

const getEquipment = () => {
    return $.ajax({
        url: '/api/facilities/',
        async: false,
        success: (facilities) => {
            facilities.forEach((facility) => {
                $.ajax({
                    type: 'GET',
                    async: false,
                    url: 'api/equipment/?facility=' + facility.id,
                    success: (equip) => {
                        setEquipment(facility.id, equip)
                    },
                });
            });
        },
    })
}

const getInstruments = () => {
    return $.ajax({
        type: 'GET',
        async: false,
        url: 'api/instruments/',
        success: (response) => {
            setInstruments(response)
        },
    })
}

const getFacilities = () => {
    return $.ajax({
        url: '/api/facilities/',
        async: false,
        success: (response) => {
            setFacilities(response);
        },
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

const formatFeatures = () => {
    features = [];
    facilities.forEach(facility => {
        const location = facility.location.split(',');

        features.push({
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [parseFloat(location[8]), parseFloat(location[7])]
            },
            'properties': {
                'title': facility.name,
                'description': makeDescription(facility),
            }
        });
    });

    return features;
}

const formatInstruments = () => {
    formatted = '';
    instruments.forEach(instrument => {
        formatted += `<option value="${instrument.name}">${instrument.name}</option>`
    })
    return formatted;
}

const formatEquipment = (facility) => {
    formatted = `
                <thead><tr>
                    <th scope="col">Instrument</th>
                    <th scope="col">Trained</th>
                    <th scope="col">Researchers</th>
                    <th scope="col">Students</th>
                    <th scope="col">Publications</th>
                    <th scope="col">Samples</th>
                    <th scope="col"></th>
                </tr></thead><tbody>
    `;
    equipment[facility].forEach(equip => {
        formatted += `
            <tr>
                <td>${equip.instrument}</td>
                <td>${equip.trained}</td>
                <td>${equip.researchers}</td>
                <td>${equip.students}</td>
                <td>${equip.publications}</td>
                <td>${equip.samples}</td>
                <td><button type="button" value="${equip.id}" class="btn btn-sm ${equip.in_use ? 'btn-danger' : 'btn-success'} bookequipment">${equip.in_use ? 'In use' : 'Free'}</button></td>
            </tr>
        `;
    });
    return formatted;
}

const makeDescription = (facility) => {
    return `
                <div class="tablecontainer">
                    <table id="equipmenttable_${facility.id}" class="table table-bordered table-striped mb-0">
                        ${formatEquipment(facility.id)}
                    </table>
                </div>
                <form class="instrumentform" id="addinstrumentform">
                    <h2>Add a new piece of equipment</h2>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Instrument</label>
                        <select class="form-control" id="instrumenttypeinput" placeholder="Choose an instrument type">
                            ${formatInstruments()}
                        </select> 
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
                        <input type="hidden" id="facilityid" value="${facility.id}" />
                    </div>
                    <button type="button" id="addinstrument" class="btn btn-primary addinstrument">Add</button>
                </form>
    `;
}

navigator.geolocation.getCurrentPosition(position => { 
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [position.coords.longitude, position.coords.latitude],
        zoom: 5,
        cluster: false
    });

    const updateMap = () => {
        const res1 = getFacilities();
        const res2 = getInstruments();
        const res3 = getEquipment();

        map.getSource('places').setData({
            'type': 'FeatureCollection',
            'features': formatFeatures(),
        })   
    }

    const addFacility = () => {
        const name = document.getElementById('facilitynameinput').value;
        const address = document.getElementById('facilityaddressinput').value;
        const postalcode = document.getElementById('facilitypostalcodeinput').value;
        const region = document.getElementById('facilityregioninput').value;
        const country = document.getElementById('facilitycountryinput').value;
    
        if (name && address && postalcode && region && country) {
            const location = address + ',' + postalcode + ',' + region + ',' + country
            $.ajax({
                type: 'POST',
                url: 'api/facilities/',
                headers: {'X-CSRFToken': csrftoken},
                data: {
                    'name': name,
                    'location': location,
                },
                dataType: "json",
                success: (res) => {
                    document.getElementById('facilitynameinput').value = '';
                    document.getElementById('facilityaddressinput').value = '';
                    document.getElementById('facilitypostalcodeinput').value = '';
                    document.getElementById('facilityregioninput').value = '';
                    document.getElementById('facilitycountryinput').value = '';
    
                    getFacilities();
                    getEquipment();
                },
                error: (err) => {
                    alert('Something went wrong');
                }
            });
        } else {
            alert('Please fill in all fields');
        }
    }
    
    const addInstrument = () => {
        const facility = document.getElementById('facilityid').value;
        const instrument = document.getElementById('instrumenttypeinput').value;
        const trained = document.getElementById('instrumenttrainedinput').value;
        const researchers = document.getElementById('instrumentresearchersinput').value;
        const students = document.getElementById('instrumentstudentsinput').value;
        const publications = document.getElementById('instrumentpublicationsinput').value;
        const samples = document.getElementById('instrumentsamplesinput').value;
    
        if (facility && instrument && trained && researchers && students && publications && samples) {
            $.ajax({
                type: 'POST',
                url: 'api/equipment/',
                headers: {'X-CSRFToken': csrftoken},
                data: {
                    'facility': facility,
                    'instrument': instrument,
                    'trained': trained,
                    'researchers': researchers,
                    'students': students,
                    'publications': publications,
                    'samples': samples,
                },
                dataType: "json",
                success: (res) => {
                    document.getElementById('facilityid').value = '';
                    document.getElementById('instrumenttypeinput').value = '';
                    document.getElementById('instrumenttrainedinput').value = '';
                    document.getElementById('instrumentresearchersinput').value = '';
                    document.getElementById('instrumentstudentsinput').value = '';
                    document.getElementById('instrumentpublicationsinput').value = '';
                    document.getElementById('instrumentsamplesinput').value = '';
    
                    updateMap();
                },
                error: (err) => {
                    alert('Something went wrong');
                }
            });
        } else {
            alert('Please fill in all fields');
        }
    }
    
    const newFacilityButton = document.getElementById('createfacility')
    
    if (newFacilityButton) {
        newFacilityButton.addEventListener('click', (event) => {
            updateMap();
        });
    };

    map.on('load', function () {
        map.loadImage(
            'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
            function (error, image) {
                if (error) throw error;
                map.addImage('custom-marker', image);
                map.addSource('places', {
                    'type': 'geojson',
                    cluster: false,
                    clusterMinPoints: 1000,
                    clusterRadius: 1,
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [],
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

                    const usebuttons = document.getElementsByClassName("bookequipment");

                    for (let button of usebuttons) {
                        button.addEventListener('click', (event) => {
                            if (button.classList.contains('btn-success')) {
                                button.classList.add('btn-danger');
                                button.classList.remove('btn-success');
                                button.innerHTML = 'In use'
                                $.ajax({
                                    type: 'PATCH',
                                    url: 'api/equipment/' + button.value + '/',
                                    headers: {'X-CSRFToken': csrftoken},
                                    data: {
                                        'in_use': true,
                                    },
                                    dataType: "json",
                                    success: (res) => {
                                        updateMap();
                                    },
                                    error: (err) => {
                                        alert('Something went wrong');
                                    }
                                });
                            } else {
                                button.classList.add('btn-success');
                                button.classList.remove('btn-danger');
                                button.innerHTML = 'Free'
                                $.ajax({
                                    type: 'PATCH',
                                    url: 'api/equipment/' + button.value + '/',
                                    headers: {'X-CSRFToken': csrftoken},
                                    data: {
                                        'in_use': false,
                                    },
                                    dataType: "json",
                                    success: (res) => {
                                        updateMap();
                                    },
                                    error: (err) => {
                                        alert('Something went wrong');
                                    }
                                });
                            }
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

                updateMap();
            }
        );
    });
});