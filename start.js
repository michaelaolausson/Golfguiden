//globala variabler

var key = "reu|NdmV"; // SMAPI-nyckel
var JSONobjects; //array for clubinfo elems (data from SMAPI).
var input; // sökfältet
var searchBtn; // sökknappen    
var enter; // entertangenten
var JSONobjects = []; // array 
var map; // map object

var markers = []; // array för markering på kartan, men endast en ska användas..
var placePosition; // den utlagda punktens position (efter sök.) Används i ny request till smapi.

function init() {
	//sökfältet
	input = document.getElementById("searchWindow");
	input.value = "sök på golfbana eller stad";
	input.style.color = "#929292";
	addListener(input,"focus",removeText);
	//anrop
	requestSMAPI();
} // end init

addListener(window,"load",init);

function removeText() {
	input.value = "";
	input.style.color = "#000000";
	removeListener(input,"focus",removeText);
	addListener(input,"blur",addText);
} // end removeText

function addText() {
	input.value = "sök på golfbana eller stad";
	input.style.color = "#929292";
	addListener(input,"focus",removeText);
	removeListener(input,"blur",addText);
} // end addText

function requestSMAPI() {
	var request; // request for AJAX
	if (XMLHttpRequest) { request = new XMLHttpRequest(); } // Olika objekt (XMLHttpRequest eller ActiveXObject), beroende på webbläsare
	else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
	else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
	request.open("GET","https://cactuar.lnu.se/course/1me302/?key=" + key + "&controller=location&method=getByTags&tags=golf",true);
	request.send(null); // Skicka begäran till servern
	request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if ( (request.readyState == 4) && (request.status == 200) ) getSMAPI(request.responseText);
	};
} // end requestSMAPI
// placerar ut markeringar för golfklubbar.
function getSMAPI(response) {
		response = JSON.parse(response);
		JSONobjects = response.payload;
		//samt placerar ut markeringar
		getMap();
} // end getSMAPI
// kod för sökruta där alternativ automatiskt kommer fram när man börjar skriva.
function getMap() {
//-- kod från https://developers.google.com/maps/documentation/javascript/examples/places-searchbox med ändringar för referens av sökruta. --//
	// Create the search box and link it to the UI element.
  	var input = document.getElementById('searchWindow'); //sökrutan
  	var searchBox = new google.maps.places.SearchBox(input);

  	map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 57.167925, lng: 15.347129},
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    //stiländringar för kartobjektet. Ändring av färg på landmassa, vägar och vatten. 
  	});
  		map.set('styles', [
		{featureType: 'road', elementType: 'geometry',stylers: [{ color:'#ffffff'},{weight: 0.8}]}, 
		{featureType: 'road',elementType: 'labels',stylers: [{ saturation: 100 },{invert_lightness: true}]}, 
		{featureType: 'landscape',elementType: 'geometry.fill',stylers: [{color: '#799a24'}] },
		{featureType: 'water',elementType: 'geometry.fill',stylers:[{color: '#4a6c8e'}]},  
	]);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  	//var markers = [];
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
        size: new google.maps.Size(40, 47),
      };
      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));  
	// positionen på utlagd markör efter sökning. används i requestNearbyClubs
	
	var lat = markers[0].getPosition().lat();
	var lng = markers[0].getPosition().lng();

	placePosition = {lat:lat,lng:lng};

	//placePosition.location.lat
      
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
        requestNearbyClubs(); // anropar ny requestfunktion för att kunna ladda in inforutor för närliggande klubbar.
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
getMapMarkers();
 // slut på kod från https://developers.google.com/maps/documentation/javascript/examples/places-searchbox med ändringar för referens av sökruta.
}//end getPlaces
function getMapMarkers() {
// går igenom samtliga JSON-objekt som är golfrelaterade (golfklubbar)
var myLatLng; // koordinater
var myMarkers = [];
	for (var i = 0; i < JSONobjects.length; i++) {
		newMarker = new google.maps.Marker;
		myMarkers.push(newMarker);
		myLatLng = {lat: Number(JSONobjects[i].latitude), lng: Number(JSONobjects[i].longitude)};
		myMarkers[i] = new google.maps.Marker ({
		position: myLatLng,
		title: JSONobjects[i].name,
		animation: google.maps.Animation.DROP,
		id: JSONobjects[i].id,
		icon: "pics/map_icons/golf.png",
		map: map
		});
	google.maps.event.addListener(myMarkers[i], 'click', loadClubPage)
	}
}
//sparar klubbens unika ID i web storage och laddar in ny sida för klubbinformation - lämnar startsidan
function loadClubPage() {
	clubID = this.id;
	localStorage.clubID = clubID;
	window.location.href = "clubinfo.html"; // ladda sida för klubbinformation
} // end loadClubPage

function requestNearbyClubs() {
	var request; // request for AJAX

	if (XMLHttpRequest) { request = new XMLHttpRequest(); } // Olika objekt (XMLHttpRequest eller ActiveXObject), beroende på webbläsare
	else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
	else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
	request.open("GET","https://cactuar.lnu.se/course/1me302/?key=" + key + "&controller=location&method=getByLatLng&lat=" + placePosition.lat + "&lng=" + placePosition.lng + "&radius=150&tags=golf",true);
	request.send(null); // Skicka begäran till servern
	request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if ( (request.readyState == 4) && (request.status == 200) ) getNearbyClubs(request.responseText);
	};
}//end requestNearbyClubs.

function getNearbyClubs(response) {
	
	response = JSON.parse(response);

	nearbyClubsElems = response.payload;

	var resElem = document.getElementById("resDiv"); // divElem för sökresultat. Närliggande klubbar.

	for (var i = 0; i < nearbyClubsElems.length; i++) {

		alert(nearbyClubsElems[i].name)
	}
}