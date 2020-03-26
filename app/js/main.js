var map = L.map('map').setView([51.505, -0.09], 13);


if (navigator.geolocation) {
    test = navigator.geolocation.getCurrentPosition(showPosition);

} else {
    x.innerHTML = "Geolocation is not supported by this browser.";
}


function showPosition(position) {
    console.log(position);
    map.setView([position.coords.latitude,position.coords.longitude]);
}
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// L.marker([51.5, -0.09]).addTo(map)
//     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//     .openPopup();

// L.Control.geocoder().addTo(map);
var geocoder = L.Control.geocoder({
    defaultMarkGeocode: false,
    collapsed: false
}).on('markgeocode', function(e) {
    console.log(e.geocode);
    L.marker([e.geocode.center.lat, e.geocode.center.lng]).addTo(map)
        .bindPopup('eeee')
        .openPopup();
    var bbox = e.geocode.bbox;
    var poly = L.polygon([
        bbox.getSouthEast(),
        bbox.getNorthEast(),
        bbox.getNorthWest(),
        bbox.getSouthWest()
    ]);
    map.fitBounds(poly.getBounds());
}).addTo(map);

getData();

function getData() {
    var request = new XMLHttpRequest();
    request.open('GET', '/besoins', true);

    request.onload = function() {
        // see full list of possible response codes:
        // https://opencagedata.com/api#codes

        if (request.status == 200) {
            // Success!
            var data = JSON.parse(request.responseText);
            console.log(data);
            populateMap(data);
            // populateCard(data);

        } else if (request.status <= 500) {
            // We reached our target server, but it returned an error

            console.log("unable to access datas ! Response code: " + request.status);
            var data = JSON.parse(request.responseText);
            console.log(data.status.message);
        } else {
            console.log("server error");
        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
        console.log("unable to connect to server");
    };

    request.send(); // make the request
}

function createCustomIcon(feature, latlng) {

    if (feature.properties.Secteur === 'Transport') {
        var transportIcon = new L.Icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        return L.marker(latlng, {
            icon: transportIcon
        })

    }
    if (feature.properties.Secteur == "Santé") {
        var santeIcon = new L.Icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        return L.marker(latlng, {
            icon: santeIcon
        })

    }

    if (feature.properties.Secteur == "Alimentation") {
        var alimIcon = new L.Icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        return L.marker(latlng, {
            icon: alimIcon
        })

    }

}

function populateMap(data) {
    var collection = {
        "type": "FeatureCollection",
        "features": []
    };
    data.forEach(function(item) {
        var feat = {
            type: "Feature",
            properties: {
                "Nom": item.Nom,
                "Addresse": item.Addresse,
                "MasquesFFP2": item.MasquesFFP2,
                "MasquesChir": item.MasquesChir,
                "Blouses": item.Blouses,
                "Gants": item.Gants,
                "Gel": item.Gel,
                "Autre": item.Autre,
                "Commentaire": item.Commentaire,
                "Contact": item.Contact,
                "Secteur": item.Secteur,
                "Company": item.Company
            },
            geometry: {
                type: 'Point',
                coordinates: [item.Lng, item.Lat]
            }
        }
        collection.features.push(feat);

    });
    console.log(collection);
    L.geoJSON(collection, {
        // style: myStyle
        pointToLayer: createCustomIcon,
        onEachFeature: onEachFeature
    }).addTo(map);
}


function onEachFeature(feature, layer) {
    if (feature.properties) {
        var popupC = document.createElement('div');
        var title = document.createElement('h3');
        title.innerHTML = feature.properties.Company;
        var besoins = document.createElement('ul');
        if (feature.properties.MasquesFFP2 == 1) {
            var li = document.createElement("li");
            li.innerHTML = "Masques FFP2";
            besoins.appendChild(li);
        }
        if (feature.properties.MasquesChir == 1) {
            var li = document.createElement("li");
            li.innerHTML = "Masques Chir";
            besoins.appendChild(li);
        }
        if (feature.properties.Blouses == 1) {
            var li = document.createElement("li");
            li.innerHTML = "Blouses";
            besoins.appendChild(li);
        }
        if (feature.properties.Gants == 1) {
            var li = document.createElement("li");
            li.innerHTML = "Gants";
            besoins.appendChild(li);
        }
        if (feature.properties.Gel == 1) {
            var li = document.createElement("li");
            li.innerHTML = "Gel";
            besoins.appendChild(li);
        }
        if (feature.properties.Autre) {
            var li = document.createElement("li");
            li.innerHTML = feature.properties.Autre;
            besoins.appendChild(li);
        }
        var p = document.createElement("p");
        if (feature.properties.Commentaire) {

            p.innerHTML = 'Modalités : ' + feature.properties.Commentaire;
        }
        var contact = document.createElement("p");
        if (feature.properties.Contact) {

            contact.innerHTML = 'Contact : ' + feature.properties.Contact;
        }
        popupC.appendChild(title);
        popupC.appendChild(besoins);
        popupC.appendChild(p);
        popupC.appendChild(contact);
        layer.bindPopup(popupC);
    }
}


/*Legend specific*/
var legend = L.control({
    position: "bottomleft"
});

legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Légende</h4>";
    div.innerHTML += '<i style="background: #CB2B3E"></i><span>Santé</span><br>';
    div.innerHTML += '<i style="background: #7B7B7B"></i><span>Transport</span><br>';
    div.innerHTML += '<i style="background: #2AAD27"></i><span>Alimentation</span><br>';


    return div;
};

legend.addTo(map);