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
  collapsed : false
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