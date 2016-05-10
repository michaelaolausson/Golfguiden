// Michaela Olausson VT 2016
// globala variabler
var map; // kartobjektet
//knappar
var clubBtn; // knapp för golfklubbar
var foodBtn; // knapp för restauranger
var hotelBtn; // knapp för boende
var activitesBtn; // knapp för övriga aktiviterer
var myMarkers = []; // klubbmarkeringar.
// arrayer för mareringar
var coordinates = [];
var JSONobjects = []; //array med JSONobjekt

var choosenMarker; // speciell markör för vald klubb

var clubMarkers;
var hotelMarkers = [];

function init() {

	clubBtn	= document.getElementById("clubBtn");
	foodBtn	= document.getElementById("foodBtn");
	hotelBtn = document.getElementById("hotelBtn");
	poiBtn = document.getElementById("activitesBtn");

	addListener(clubBtn,"click",setGolfMarkers);
/*	addListener(foodBtn,"click",setFoodMarkers);
	addListener(hotelBtn,"click",setHotelMarkers);
	addListener(poiBtn,"click",setActivitiesMarkers);*/

	requestID();

} // end init

addListener(window,"load",init);


// lägger in karta för klubb vald på startsidan.
function requestID() {

	var request; // request for AJAX
	var key = "reu|NdmV";
	var response; // JSONdata
	var choosenClub; // club med id från web storage (sparat från startsidan.)
	var myLatLng; // koordinater för vald klubb.

	if (XMLHttpRequest) { request = new XMLHttpRequest(); } // Olika objekt (XMLHttpRequest eller ActiveXObject), beroende på webbläsare
	else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
	else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
	
	request.open("GET","https://cactuar.lnu.se/course/1me302/?key=reu|NdmV&controller=location&method=getspecific&id=" + localStorage.clubID,true);
	request.send(null); // Skicka begäran till servern
	request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if ( (request.readyState == 4) && (request.status == 200) ) {
			
			response = JSON.parse(request.responseText);

			choosenClub = response.payload[0];

			myLatLng =  {lat: Number(choosenClub.latitude), lng: Number(choosenClub.longitude)};

			map = new google.maps.Map(document.getElementById('map'), {
         
          	center: myLatLng,
          	zoom: 10,
    		});

    		choosenMarker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			title: choosenClub.name,
			icon:'golf2.png',
 			});

		}
	}
}

// hämtar golfklubbar via SMAPI
function requestSMAPI(callback, tags) {

	var request; // request for AJAX
	var key = "reu|NdmV";
	var response; // JSONdata

	if (XMLHttpRequest) { request = new XMLHttpRequest(); } // Olika objekt (XMLHttpRequest eller ActiveXObject), beroende på webbläsare
	else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
	else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
	
	request.open("GET","https://cactuar.lnu.se/course/1me302/?key=" + key + "&controller=location&method=getByTags&tags=" + tags,true);
	request.send(null); // Skicka begäran till servern
	request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if ( (request.readyState == 4) && (request.status == 200) ) {
			
			response = JSON.parse(request.responseText);
			var JSONobjects = response.payload;
			callback(JSONobjects);
		}
	}
} // end requestSMAPIgolf

function createClubMarkers(smapiObjects) {

	for (var i = 0; i < smapiObjects.length; i++) {
		if (smapiObjects[i].id == localStorage.clubID) {
			smapiObjects.splice(i, 1);
			break;
		}
	}

	clubMarkers = createMarkers(smapiObjects, "golf.png");
	showMarkers(clubMarkers);

}

function createMarkers(smapiObjects, pic) {

	var markers = [];

	for (var i = 0; i < smapiObjects.length; i++) {
		var latlng = {lat: Number(smapiObjects[i].latitude), lng: Number(smapiObjects[i].longitude)};
		var newMarker = new google.maps.Marker ({
			position: latlng,
			title: smapiObjects[i].name,
			animation: google.maps.Animation.DROP,
			icon: pic });

		markers.push(newMarker);
	}

	return markers;
}

function showMarkers(markers) {

	for (var i = 0; i < markers.length; i++) {

		markers[i].setMap(map);
	}
}

function hideMarkers(markers) {

	for (var i = 0; i < markers.length; i++) {

		markers[i].setMap(null);
	}
}

function setGolfMarkers() {

	if (clubMarkers == null) {
		requestSMAPI(createClubMarkers, "golf");
	} else {
		showMarkers(clubMarkers);
	}

	removeListener(clubBtn,"click",setGolfMarkers);
	addListener(clubBtn,"click",removeGolfMarkers);
}

function removeGolfMarkers() {

	hideMarkers(clubMarkers);

	addListener(clubBtn,"click",setGolfMarkers);
	removeListener(clubBtn,"click",removeGolfMarkers);
}

 // lägger till markeringar på kartan.
function addMapMarkers() {

	var i; // loopvariabel
	var newMarker; // ny kartmarkering

	for (i = 0; i < coordinates.length; i++) {

		newMarker = new google.maps.Marker;
			myMarkers.push(newMarker);
			myMarkers[i] = new google.maps.Marker ({
			position: coordinates[i],
			title: JSONobjects[i].name,
			animation: google.maps.Animation.DROP,
			id: JSONobjects[i].id,
			icon:'golf.png'});

		myMarkers[i].setMap(map); // sätter makeringen på vald karta för att kunna ta bort dem genom myMarkers[i].setMap(null);
	} 
}
