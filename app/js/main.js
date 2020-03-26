var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup();

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

function populateMap(data) {
    var collection = {
        "type": "FeatureCollection",
        "features": []
    };
    data.forEach(function(item){
        var feat = {
          type : "Feature",
          properties: {
              "Nom": item.Nom,
              "Addresse": item.Addresse,
              "MasquesFFP2": item.MasquesFFP2,
              "MasquesChir": item.MasquesChir,
              "Blouses": item.Blouses,
              "Gel": item.Gel,
              "Autre": item.Autre,
              "Commentaire": item.Commentaire,
              "Contact": item.Contact,
              "Secteur": item.Secteur
          },
          geometry : {
            type : 'Point',
            coordinates : [item.Lat, item.Lng]
          }
        }
        collection.features.push(feat);

    });
    console.log(collection);
    L.geoJSON(collection, {
    // style: myStyle
    onEachFeature: onEachFeature
    }).addTo(map);
}


function onEachFeature(feature, layer) {
    if (feature.properties) {
        layer.bindPopup(feature.properties.Nom);
    }
}