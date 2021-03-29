mapboxgl.accessToken = 'pk.eyJ1Ijoiam9lYWxmIiwiYSI6ImNrbXIyNHF3YTAzcHoydnBuc2x1YjRyZ3QifQ.UbmitObJVmkFyJFSC2o5cQ'; // this is also bad - remember to revoke access

var equipment = {};
var instruments = []
var facilities = [];
var updateMapFunc = null;
var filter = ''

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
                    url: filter ? 'api/equipment/?facility=' + facility.id + '&instrument=' + filter : 'api/equipment/?facility=' + facility.id,
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

const formatSelection = () => {
    formatted = `
        <form>
            <h2>Show me</h2>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="selection" id="selection_none" value="" checked onclick="selectFilter('')">
                <label class="form-check-label" for="selection_none">
                Everything
                </label>
            </div>
    `;
    instruments.forEach((instrument) => {
        formatted += `
            <div class="form-check">
                <input class="form-check-input" type="radio" name="selection" id="selection_${instrument.id}" value="${instrument.id}" onclick="selectFilter('${instrument.id}')">
                <label class="form-check-label" for="selection_${instrument.id}">
                ${instrument.name}
                </label>
            </div>
        `;
    });
    formatted += '</form>';
    return formatted;
}

getInstruments();
const selection = document.getElementById('selection');
selection.innerHTML = formatSelection();

const selectFilter = (filt) => {
    filter = filt;
    updateMapFunc();
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
    console.log('a');
    features = [];
    facilities.forEach(facility => {
        if (!filter || (filter && equipment[facility.id].length)) {
            console.log(facility);
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
        }
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

const startEdit = (id) => {
    document.getElementById('trainedtext_' + id).classList.toggle('hiddenedit');
    document.getElementById('trainededit_' + id).classList.toggle('hiddenedit');
    document.getElementById('researcherstext_' + id).classList.toggle('hiddenedit');
    document.getElementById('researchersedit_' + id).classList.toggle('hiddenedit');
    document.getElementById('studentstext_' + id).classList.toggle('hiddenedit');
    document.getElementById('studentsedit_' + id).classList.toggle('hiddenedit');
    document.getElementById('publicationstext_' + id).classList.toggle('hiddenedit');
    document.getElementById('publicationsedit_' + id).classList.toggle('hiddenedit');
    document.getElementById('samplestext_' + id).classList.toggle('hiddenedit');
    document.getElementById('samplesedit_' + id).classList.toggle('hiddenedit');
    document.getElementById('markused_' + id).classList.toggle('hiddenedit');
    document.getElementById('savechanges_' + id).classList.toggle('hiddenedit');
}

const stopEdit = (id) => {
    const trainedtext = document.getElementById('trainedtext_' + id);
    const trainededit = document.getElementById('trainededit_' + id);
    const researcherstext = document.getElementById('researcherstext_' + id);
    const researchersedit = document.getElementById('researchersedit_' + id);
    const studentstext = document.getElementById('studentstext_' + id);
    const studentsedit = document.getElementById('studentsedit_' + id);
    const publicationstext = document.getElementById('publicationstext_' + id);
    const publicationsedit = document.getElementById('publicationsedit_' + id);
    const samplestext = document.getElementById('samplestext_' + id);
    const samplesedit = document.getElementById('samplesedit_' + id);
    trainedtext.innerHTML = trainededit.value;
    researcherstext.innerHTML = researchersedit.value;
    studentstext.innerHTML = studentsedit.value;
    publicationstext.innerHTML = publicationsedit.value;
    samplestext.innerHTML = samplesedit.value;

    $.ajax({
        type: 'PATCH',
        url: 'api/equipment/' + id + '/',
        headers: {'X-CSRFToken': csrftoken},
        data: {
            'trained': trainededit.value,
            'researchers': researchersedit.value,
            'students': studentsedit.value,
            'publications': publicationsedit.value,
            'samples': samplesedit.value,
        },
        dataType: "json",
        success: (res) => {
            updateMapFunc();
        },
        error: (err) => {
            alert('Something went wrong');
        }
    });

    trainedtext.classList.toggle('hiddenedit');
    trainededit.classList.toggle('hiddenedit');
    researcherstext.classList.toggle('hiddenedit');
    researchersedit.classList.toggle('hiddenedit');
    studentstext.classList.toggle('hiddenedit');
    studentsedit.classList.toggle('hiddenedit');
    publicationstext.classList.toggle('hiddenedit');
    publicationsedit.classList.toggle('hiddenedit');
    samplestext.classList.toggle('hiddenedit');
    samplesedit.classList.toggle('hiddenedit');
    document.getElementById('markused_' + id).classList.toggle('hiddenedit');
    document.getElementById('savechanges_' + id).classList.toggle('hiddenedit');
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
                <td><p>${equip.instrument}</p></td>
                <td>
                    <p onclick="startEdit('${equip.id}')" id="trainedtext_${equip.id}">${equip.trained}</p>
                    <input type="text" class="form-control hiddenedit" value="${equip.trained}" id="trainededit_${equip.id}" placeholder="#">
                </td>
                <td>
                    <p onclick="startEdit('${equip.id}')" id="researcherstext_${equip.id}">${equip.researchers}</p>
                    <input type="text" class="form-control hiddenedit" value="${equip.researchers}" id="researchersedit_${equip.id}" placeholder="#">
                </td>
                <td>
                    <p onclick="startEdit('${equip.id}')" id="studentstext_${equip.id}">${equip.students}</p>
                    <input type="text" class="form-control hiddenedit" value="${equip.students}" id="studentsedit_${equip.id}" placeholder="#">
                </td>
                <td>
                    <p onclick="startEdit('${equip.id}')" id="publicationstext_${equip.id}">${equip.publications}</p>
                    <input type="text" class="form-control hiddenedit" value="${equip.publications}" id="publicationsedit_${equip.id}" placeholder="#">
                </td>
                <td>
                    <p onclick="startEdit('${equip.id}')" id="samplestext_${equip.id}">${equip.samples}</p>
                    <input type="text" class="form-control hiddenedit" value="${equip.samples}" id="samplesedit_${equip.id}" placeholder="#">
                </td>
                <td>
                    <button type="button" value="${equip.id}" class="btn btn-sm ${equip.in_use ? 'btn-danger' : 'btn-success'} bookequipment" id="markused_${equip.id}">${equip.in_use ? 'In use' : 'Free'}</button>
                    <button type="button" value="${equip.id}" class="btn btn-sm btn-primary hiddenedit" onclick="stopEdit('${equip.id}')" id="savechanges_${equip.id}">Save</button>    
                </td>
            </tr>
        `;
    });
    return formatted;
}

const makeDescription = (facility) => {
    return `
                <div class="tablecontainer">
                    <table id="equipmenttable" class="table table-bordered table-striped mb-0">
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
                                <input type="text" class="form-control" id="instrumenttrainedinput" placeholder="#">
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label for="exampleInputEmail1">Researchers</label>
                                <input type="text" class="form-control" id="instrumentresearchersinput" placeholder="#">
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label for="exampleInputEmail1">Students</label>
                                <input type="text" class="form-control" id="instrumentstudentsinput" placeholder="#">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="exampleInputEmail1">Publications</label>
                                <input type="text" class="form-control" id="instrumentpublicationsinput" placeholder="#">
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label for="exampleInputEmail1">Samples</label>
                                <input type="text" class="form-control" id="instrumentsamplesinput" placeholder="#">
                            </div>
                        </div>
                        <input type="hidden" id="facilityid" value="${facility.id}" />
                    </div>
                    <button type="button" id="addinstrument" class="btn btn-primary addinstrument">Add</button>
                </form>
    `;
}

const addFacility = () => {
    const name = document.getElementById('facilitynameinput').value;
    const address = document.getElementById('facilityaddressinput').value;
    const postalcode = document.getElementById('facilitypostalcodeinput').value;
    const region = document.getElementById('facilityregioninput').value;
    const country = document.getElementById('facilitycountryinput').value;

    if (name && address && postalcode && region && country) {
        const location = address + ',' + postalcode + ',' + region + ',' + country;
        $.ajax({
            type: 'POST',
            url: 'api/facilities/',
            async: true,
            headers: {'X-CSRFToken': csrftoken},
            data: {
                'name': name,
                'location': location,
            },
            dataType: "json",
            success: (res) => {
                updateMapFunc();
            },
            error: (err) => {
                alert('Something went wrong');
            }
        });

        document.getElementById('facilitynameinput').value = '';
        document.getElementById('facilityaddressinput').value = '';
        document.getElementById('facilitypostalcodeinput').value = ''
        document.getElementById('facilityregioninput').value = '';
        document.getElementById('facilitycountryinput').value = '';
        
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
            success: (response) => {
                document.getElementById('facilityid').value = '';
                document.getElementById('instrumenttypeinput').value = '';
                document.getElementById('instrumenttrainedinput').value = '';
                document.getElementById('instrumentresearchersinput').value = '';
                document.getElementById('instrumentstudentsinput').value = '';
                document.getElementById('instrumentpublicationsinput').value = '';
                document.getElementById('instrumentsamplesinput').value = '';

                document.getElementById('equipmenttable').innerHTML += `
                    <tr>
                        <td><p>${response.instrument}</p></td>
                        <td>
                            <p onclick="startEdit('${response.id}')" id="trainedtext_${response.id}">${response.trained}</p>
                            <input type="text" class="form-control hiddenedit" value="${response.trained}" id="trainededit_${response.id}" placeholder="#">
                        </td>
                        <td>
                            <p onclick="startEdit('${response.id}')" id="researcherstext_${response.id}">${response.researchers}</p>
                            <input type="text" class="form-control hiddenedit" value="${response.researchers}" id="researchersedit_${response.id}" placeholder="#">
                        </td>
                        <td>
                            <p onclick="startEdit('${response.id}')" id="studentstext_${response.id}">${response.students}</p>
                            <input type="text" class="form-control hiddenedit" value="${response.students}" id="studentsedit_${response.id}" placeholder="#">
                        </td>
                        <td>
                            <p onclick="startEdit('${response.id}')" id="publicationstext_${response.id}">${response.publications}</p>
                            <input type="text" class="form-control hiddenedit" value="${response.publications}" id="publicationsedit_${response.id}" placeholder="#">
                        </td>
                        <td>
                            <p onclick="startEdit('${response.id}')" id="samplestext_${response.id}">${response.samples}</p>
                            <input type="text" class="form-control hiddenedit" value="${response.samples}" id="samplesedit_${response.id}" placeholder="#">
                        </td>
                        <td>
                            <button type="button" value="${response.id}" class="btn btn-sm ${response.in_use ? 'btn-danger' : 'btn-success'} bookequipment" id="markused_${response.id}">${response.in_use ? 'In use' : 'Free'}</button>
                            <button type="button" value="${response.id}" class="btn btn-sm btn-primary hiddenedit" onclick="stopEdit('${response.id}')" id="savechanges_${response.id}">Save</button>    
                        </td>
                    </tr>
                `;

                updateMapFunc();
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
        addFacility();
    });
};

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [40, 105],
    zoom: 5,
    cluster: false
});

const updateMap = () => {
    getFacilities();
    getInstruments();
    getEquipment();

    map.getSource('places').setData({
        'type': 'FeatureCollection',
        'features': formatFeatures(),
    })
}

updateMapFunc = updateMap;

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
                                    updateMapFunc();
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
                                    updateMapFunc();
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

            updateMapFunc();
        }
    );
});