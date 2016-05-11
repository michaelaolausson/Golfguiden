// Michaela Olausson VT 2016
// globala variabler
var map; // kartobjektet
var key = "reu|NdmV"; // api-nyckel till SMAPI
//knappar
var clubBtn; // knapp för golfklubbar
var foodBtn; // knapp för restauranger
var hotelBtn; // knapp för boende
var activitiesBtn; // knapp för övriga aktiviterer
var myMarkers = []; // klubbmarkeringar.
var choosenMarker; // speciell markör för vald klubb
var clubMarkers;
var hotelMarkers; 
var campingMarkers;
var cabinMarkers;
var foodMarkers;
var activitiesMarkers;

function init() {

	clubBtn	= document.getElementById("clubBtn");
	foodBtn	= document.getElementById("foodBtn");
	hotelBtn = document.getElementById("hotelBtn");
	activitiesBtn = document.getElementById("activitesBtn");

	addListener(clubBtn,"click",setClubMarkers);
	addListener(hotelBtn,"click",setHotelMarkers);
	addListener(hotelBtn,"click",setCampingMarkers);
	addListener(foodBtn,"click",setFoodMarkers);
	addListener(activitiesBtn,"click",setActivitiesMarkers);

	requestID();

} // end init

addListener(window,"load",init);

// lägger in karta för klubb vald på startsidan.
function requestID() {

	var request; // request for AJAX
	var response; // JSONdata
	var choosenClub; // club med id från web storage (sparat från startsidan.)
	var myLatLng; // koordinater för vald klubb.

	if (XMLHttpRequest) { request = new XMLHttpRequest(); } // Olika objekt (XMLHttpRequest eller ActiveXObject), beroende på webbläsare
	else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
	else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
	
	request.open("GET","https://cactuar.lnu.se/course/1me302/?key=" + key + "&controller=location&method=getspecific&id=" + localStorage.clubID,true);
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
			      { color: '#286cb1' }
			    ]
			},  
			]);
		}
	}
}
// hämtar golfklubbar via SMAPI
function requestSMAPI(callback, tags) {

	var request; // request for AJAX
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

//callback-funktion som skickas med vid anrop till SMAPI från setGolfMarkers
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

//callback-funktion som skickas med vid anrop till SMAPI från setHotelMarkers
function createHotelMarkers(smapiObjects) {

	hotelMarkers = createMarkers(smapiObjects, "hotel.png");
	showMarkers(hotelMarkers);
}

//callback-funktion som skickas med vid anrop till SMAPI från setFoodMarkers
function createCampingMarkers(smapiObjects) {

	activitiesMarkers = createMarkers(smapiObjects, "hotel.png");
	showMarkers(activitiesMarkers);
}

//callback-funktion som skickas med vid anrop till SMAPI från setFoodMarkers
function createCabinMarkers(smapiObjects) {

	activitiesMarkers = createMarkers(smapiObjects, "hotel.png");
	showMarkers(CabinMarkers);
}

//callback-funktion som skickas med vid anrop till SMAPI från setFoodMarkers
function createFoodMarkers(smapiObjects) {

	foodMarkers = createMarkers(smapiObjects, "food.png");
	showMarkers(foodMarkers);
}

//callback-funktion som skickas med vid anrop till SMAPI från setActivitiesMarkers
function createActivitiesMarkers(smapiObjects) {

	activitiesMarkers = createMarkers(smapiObjects, "activities.png");
	showMarkers(activitiesMarkers);
}

function setClubMarkers() {

	if (clubMarkers == null) {
		requestSMAPI(createClubMarkers, "golf");

	} else {

		showMarkers(clubMarkers);
	}

	removeListener(clubBtn,"click",setClubMarkers);
	addListener(clubBtn,"click",hideClubMarkers);
}

function setHotelMarkers() {

	if (hotelMarkers == null) {

		requestSMAPI(createHotelMarkers, "hotel");

	} else {

		showMarkers(hotelMarkers);
	}

	removeListener(hotelBtn,"click",setHotelMarkers);
	addListener(hotelBtn,"click",hideHotelMarkers);
}

function setCampingMarkers() {

	if (campingMarkers == null) {

		requestSMAPI(createCampingMarkers, "camping");

	} else {

		showMarkers(campingMarkers);
	}

	removeListener(hotelBtn,"click",setCampingMarkers);
	addListener(hotelBtn,"click",hideCampingMarkers);
}

function setCabinMarkers() {

	if (cabinMarkers == null) {

		requestSMAPI(createCabinMarkers, "cabin");

	} else {

		showMarkers(cabinMarkers);
	}

	removeListener(hotelBtn,"click",setCabinMarkers);
	addListener(hotelBtn,"click",hideCabinMarkers);
}

function setFoodMarkers() {

	if (foodMarkers == null) {
		requestSMAPI(createFoodMarkers, "restaurant");
	} else {
		showMarkers(foodMarkers);
	}

	removeListener(foodBtn,"click",setFoodMarkers);
	addListener(foodBtn,"click",hideFoodMarkers);
}

function setActivitiesMarkers() {

	if (activitiesMarkers == null) {
		requestSMAPI(createActivitiesMarkers, "culture");
	} else {
		showMarkers(activitiesMarkers);
	}

	removeListener(activitiesBtn,"click",setActivitiesMarkers);
	addListener(activitiesBtn,"click",hideActivitiesMarkers);
}

function hideClubMarkers() {

	hideMarkers(clubMarkers);

	addListener(clubBtn,"click",setClubMarkers);
	removeListener(clubBtn,"click",hideClubMarkers);
}

function hideHotelMarkers() {

	hideMarkers(hotelMarkers);

	addListener(hotelBtn,"click",setHotelMarkers);
	removeListener(hotelBtn,"click",hideHotelMarkers);
}

function hideCampingMarkers() {

	hideMarkers(campingMarkers);

	addListener(hotelBtn,"click",setCampingMarkers);
	removeListener(hotelBtn,"click",hideCampingMarkers);
}

function hideCabinMarkers() {

	hideMarkers(cabinMarkers);

	addListener(hotelBtn,"click",setCabinMarkers);
	removeListener(hotelBtn,"click",hideCabinMarkers);
}

function hideFoodMarkers() {

	hideMarkers(foodMarkers);

	addListener(foodBtn,"click",setFoodMarkers);
	removeListener(foodBtn,"click",hideFoodMarkers);
}

function hideActivitiesMarkers() {

	hideMarkers(activitiesMarkers);

	addListener(activitiesBtn,"click",setActivitiesMarkers);
	removeListener(activitiesBtn,"click",hideActivitiesMarkers);
}
 //-- GEMENSAMMA -- FUNKTIONER --//

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
