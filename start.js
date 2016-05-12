//globala variabler

var key = "reu|NdmV"; // SMAPI-nyckel
var clubElems; //array for clubinfo elems (data from SMAPI).
var searchInput; // sökfältet
var searchBtn; // sökknappen    
var enter; // entertangenten

function init() {

	requestSMAPI();

} // end init

addListener(window,"load",init);

function requestSMAPI() {

	var request; // request for AJAX

	if (XMLHttpRequest) { request = new XMLHttpRequest(); } // Olika objekt (XMLHttpRequest eller ActiveXObject), beroende på webbläsare
	else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
	else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
	
	request.open("GET","https://cactuar.lnu.se/course/1me302/?key=reu|NdmV&controller=location&method=getByTags&tags=golf",true);
	request.send(null); // Skicka begäran till servern
	request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if ( (request.readyState == 4) && (request.status == 200) ) getSMAPI(request.responseText);
	};
} // end requestSMAPI
// placerar ut markeringar för golfklubbar.
function getSMAPI(response) {

	var i; // loop-var
	var map; // kartobjekt
	var marker; // marker object
	var myMarkers; // marker array
	var myLatLng; // koordinater


	response = JSON.parse(response);

	clubElems = response.payload;

	myMarkers = [];

	map = new google.maps.Map(document.getElementById('map'), {
         
        center: {lat: 57.167925, lng: 15.347129},
        zoom: 7,

    });
//-- kod från https://developers.google.com/maps/documentation/javascript/examples/places-searchbox med ändringar för referens av sökruta. --//
   
    // Create the search box and link it to the UI element.
  	var input = document.getElementById('searchWindow');
 	var searchBox = new google.maps.places.SearchBox(input);
  		// Bias the SearchBox results towards current map's viewport.
  	map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  	});

 	var markers = [];

  	// Listen for the event fired when the user selects a prediction and retrieve
  	// more details for that place.
  		searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    // Clear out the old markers.
   		markers.forEach(function(marker) {
      	marker.setMap(null);
    	});
    
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: "pics/map_icons/here.png", 
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(40, 47)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  }); // slut på kod från https://developers.google.com/maps/documentation/javascript/examples/places-searchbox med ändringar för referens av sökruta.

	map.set('styles', [

	  {
	    featureType: 'road',
	    elementType: 'geometry',
	    stylers: [
	      { color: '#ffffff' },
	      { weight: 0.8 }
	    ]
	  }, {
	    featureType: 'road',
	    elementType: 'labels',
	    stylers: [
	      { saturation: 100 },
	      { invert_lightness: true }
	    ]
	  }, {
	    featureType: 'landscape',
	    elementType: 'geometry.fill',
	    stylers: [
	      { color: '#799a24' }
	    ]
	  },
	  {
	    featureType: 'water',
	    elementType: 'geometry.fill',
	    stylers: [
	      { color: '#4a6c8e' }
	    ]
	  },  
	]);
		// går igenom samtliga JSON-objekt som är golfrelaterade (golfklubbar)
		//samt placerar ut markeringar
		for (i = 0; i < clubElems.length; i++) {

			newMarker = new google.maps.Marker;
			myMarkers.push(newMarker);

			myLatLng = {lat: Number(clubElems[i].latitude), lng: Number(clubElems[i].longitude)};

			myMarkers[i] = new google.maps.Marker ({
			position: myLatLng,
			map:map,
			title: clubElems[i].name,
			animation: google.maps.Animation.DROP,
			id: clubElems[i].id,
			icon: "pics/map_icons/golf.png"

			});

			google.maps.event.addListener(myMarkers[i], 'click', loadClubPage)
			
		}
} // end getSMAPI

	//sparar klubbens unika ID i web storage och laddar in ny sida för klubbinformation - lämnar startsidan
function loadClubPage() {

	clubID = this.id;

	localStorage.clubID = clubID;

	window.location.href = "clubinfo.html"; // ladda sida för klubbinformation
} // end loadClubPage

function searchClub() {


}