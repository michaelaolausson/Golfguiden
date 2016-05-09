var map; // kartobjektet

function init() {

	var infoElem = document.getElementById("infoDiv"); 

	requestSMAPI("golf");
	//requestSMAPI("restaurant");

} // end init

addListener(window,"load",init);

// hämtar golfklubbar via SMAPI
function requestSMAPI(tags) {

	var request; // request for AJAX
	var key = "reu|NdmV";

	if (XMLHttpRequest) { request = new XMLHttpRequest(); } // Olika objekt (XMLHttpRequest eller ActiveXObject), beroende på webbläsare
	else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
	else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
	
	request.open("GET","https://cactuar.lnu.se/course/1me302/?key=reu|NdmV&controller=location&method=getall&method=getByTags&tags=" + tags,true);
	request.send(null); // Skicka begäran till servern
	request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if ( (request.readyState == 4) && (request.status == 200) ) {
			getMap(request.responseText);
		}
	}
} // end requestSMAPIgolf

function getMap(response) {

	var myLatLng; // koordinater för vald klubb.
	var clubElems; // klubbobjekt från JSON
	var id; // id från web storage

	response = JSON.parse(response);

	clubElems = response.payload;

	id = localStorage.clubID;

	for (i = 0; i < clubElems.length; i++) {

		if (clubElems[i].id == id) {

			myLatLng = {lat: Number(clubElems[i].latitude), lng: Number(clubElems[i].longitude)};
			map = new google.maps.Map(document.getElementById('map'), {
         
         	center: myLatLng,
         	zoom: 10,
   			});

			var marker = new google.maps.Marker({
    		position: myLatLng,
   			map: map,
    		title: clubElems[i].name,
 			});
		}
	}
}
// sätter ut markers på kartan relaterade till restaurant-taggen.
function getRestaurants(response) {

	var i; // loop variabel
	var newMarker; // nytt markerobjekt
	var myMarkers; // array för nya markers

	response = JSON.parse(response);

	restaurantElems = response.payload;

	myMarkers = [];

	newMarker = new google.maps.Marker;
	myMarkers.push(newMarker);

		for (i = 0; i < restaurantElems.length; i++) {

			newMarker = new google.maps.Marker;
			myMarkers.push(newMarker);

			myLatLng = {lat: Number(restaurantElems[i].latitude), lng: Number(restaurantElems[i].longitude)};

			myMarkers[i] = new google.maps.Marker ({
			position: myLatLng,
			map: map,
			title: restaurantElems[i].name,
			animation: google.maps.Animation.DROP,
			id: restaurantElems[i].id,

			});
		}

	requestSMAPI("hotel");
}
// sätter ut markers på kartan relaterade till Hotel-taggen.
function getHotels(response) {

	var i; // loop variabel
	var newMarker; // nytt markerobjekt
	var myMarkers; // array för nya markers
	var hoteElems; // hotell-elems

	response = JSON.parse(response);

	hotelElems = response.payload;

	myMarkers = [];

	newMarker = new google.maps.Marker;
	myMarkers.push(newMarker);

		for (i = 0; i < hotelElems.length; i++) {

			newMarker = new google.maps.Marker;
			myMarkers.push(newMarker);

			myLatLng = {lat: Number(hotelElems[i].latitude), lng: Number(hotelElems[i].longitude)};

			myMarkers[i] = new google.maps.Marker ({
			position: myLatLng,
			map: map,
			title: hotelElems[i].name,
			animation: google.maps.Animation.DROP,
			id: hotelElems[i].id,

			});
		}

		requestSMAPIpoi();
}
// 
function getPOI() {


}