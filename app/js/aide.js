  var p = document.getElementById("GeoBtn");
  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, {
    	dropdownOptions : {
    		
    }
    });
  });

  p.onclick = geolocate;

  function geolocate() {
      event.preventDefault();
      console.log("geooooo");
      var adresstoLoc = document.getElementById("adress").value;

      var apikey = 'YOUR-API-KEY';
      var latitude = '51.0';
      var longitude = '7.0';

      var api_url = 'http://nominatim.openstreetmap.org/search'

      var request_url = api_url +
          '?' +
          '&q=' + encodeURIComponent(adresstoLoc) +
          '&format=json' ;

      // see full list of required and optional parameters:
      // https://opencagedata.com/api#forward

      var request = new XMLHttpRequest();
      request.open('GET', request_url, true);

      request.onload = function() {
          // see full list of possible response codes:
          // https://opencagedata.com/api#codes

          if (request.status == 200) {
              // Success!
              var data = JSON.parse(request.responseText);
              console.log(data);
              populateCard(data);

          } else if (request.status <= 500) {
              // We reached our target server, but it returned an error

              console.log("unable to geocode! Response code: " + request.status);
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
var locationsAvailable = document.getElementById('locationsAvailable');
  function populateCard(geoResults){
  	// console.log(geoResult);
  	// var geoResults = [];
  	 geoResults.map(geoResult => {
    // first create the input div container
    const addressCard = document.createElement('div');
    // then create the input and label elements
    const input = document.createElement('input');
    const label = document.createElement('label');
    const span = document.createElement('span');
    span.innerHTML = geoResult.display_name;
    // then add materialize classes to the div and input
    addressCard.classList.add("card");
    input.classList.add("with-gap");
    // add attributes to them
    label.setAttribute("for", geoResult.place_id);
    label.appendChild(input);
    
    label.appendChild(span);
    input.setAttribute("name", "address");
    input.setAttribute("type", "radio");
    // input.setAttribute("value", geoResult.display_name);
    input.setAttribute("id", geoResult.place_id);
    // addressCard.appendChild(input);
    addressCard.appendChild(label);

    return (
      // append the created div to the locationsAvailable div

      locationsAvailable.appendChild(addressCard)
    );
  })
  }