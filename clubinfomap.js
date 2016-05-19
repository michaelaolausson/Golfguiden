// globala variabler
//var myKey =  "AIzaSyA4sq08oYLsb2ZXGE6AbNHhQfrSFryVEsQ"; // google Maps API key
var map; // kartobjektet
var key = "reu|NdmV";
//knappar
var clubBtn; // knapp för golfklubbar
var foodBtn; // knapp för restauranger
var hotelBtn; // knapp för boende
var activitiesBtn; // knapp för övriga aktiviterer
var myMarkers = []; // klubbmarkeringar.
var choosenMarker; // speciell markör för vald klubb
var choosenClub; // club med id från web storage (sparat från startsidan.)
// arryer för markeringar
var clubMarkers;
var foodMarkers;
var hotelMarkers;
var campingMarkers;
var cabinMarkers;
var activitiesMarkers;
//
var distanceObjects; // array för distanslistan. 
// programmet initieras
function init() {
	//knappar
	clubBtn	= document.getElementById("clubBtn");
	foodBtn	= document.getElementById("foodBtn");
	hotelBtn = document.getElementById("hotelBtn");
	activitiesBtn = document.getElementById("activitesBtn");
	//händelsehanterare för knappar
	addListener(clubBtn,"click",setClubMarkers);
	addListener(hotelBtn,"click",setHotelMarkers);
	addListener(hotelBtn,"click",setCampingMarkers);
	addListener(hotelBtn,"click",setCabinMarkers);
	addListener(foodBtn,"click",setFoodMarkers);
	addListener(activitiesBtn,"click",setActivitiesMarkers);
	//anrop av funktion för att hämta "baskartan"
	requestID();
	requestDistance();
} // end init
addListener(window,"load",init);
// lägger in karta för klubb vald på startsidan.
function requestID() {

	var request; // request for AJAX
	var response; // JSONdata
	var myLatLng; // koordinater för vald klubb.
	if (XMLHttpRequest) {request = new XMLHttpRequest();} // Olika objekt (XMLHttpRequest eller ActiveXObject), beroende på webbläsare
	else if (ActiveXObject) {request = new ActiveXObject("Microsoft.XMLHTTP");}
	else {alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false;}
	request.open("GET","https://cactuar.lnu.se/course/1me302/?key=" + key + "&controller=location&method=getspecific&id=" + localStorage.clubID,true);
	request.send(null); // Skicka begäran till servern
	request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if ( (request.readyState == 4) && (request.status == 200) ) {
			response = JSON.parse(request.responseText);
			choosenClub = response.payload[0];
			myLatLng =  {lat: Number(choosenClub.latitude), lng: Number(choosenClub.longitude)};
			//"grundkartan läses in"
			map = new google.maps.Map(document.getElementById('map2'), {center: myLatLng,zoom: 9,});
    		choosenMarker = new google.maps.Marker({position: myLatLng,map: map,title: choosenClub.name,icon:'pics/map_icons/here.png',});
			//kartan får ny design
			map.set('styles', [
				{featureType: 'road', elementType: 'geometry',stylers: [{ color:'#ffffff'},{weight: 0.8}]}, 
				{featureType: 'road',elementType: 'labels',stylers: [{ saturation: 100 },{invert_lightness: true}]}, 
				{featureType: 'landscape',elementType: 'geometry.fill',stylers: [{color: '#799a24'}] },
				{featureType: 'water',elementType: 'geometry.fill',stylers:[{color: '#4a6c8e'}]},  
			]);
		addClubInfo();
		}
	}
}// end requestID
//hämtar info från SMAPI och lägger i passande div.
function addClubInfo() {

	var description = document.getElementById("coursetext");//HTML-element för description.
	var extrainfo = document.getElementById("extrainfo");
	var open = choosenClub.opening_time.slice(0,5);
	var closed = choosenClub.closing_time.slice(0,5);

	coursetext.innerHTML = "<h2>" + choosenClub.name + "</h2>" + choosenClub.description;
	extrainfo.innerHTML = "<b>Öppetider</b>" + "<br>" + open + "<br>" + closed;
}
// hämtar JSON-object från SMAPI med taggar baserat på vilken knapp som klickats på. 
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
} // end requestSMAPI
// hämtar en lista från SMAPI med avståndsdata från ett bestämt objekt
function requestDistance() {
	var request; // request for AJAX
	var response; // JSONdata
	if (XMLHttpRequest) { request = new XMLHttpRequest(); } // Olika objekt (XMLHttpRequest eller ActiveXObject), beroende på webbläsare
	else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
	else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }	
	request.open("GET","https://cactuar.lnu.se/course/1me302/?key=" + key + "&controller=location&method=getDistanceList&id=" + localStorage.clubID,true);
	request.send(null); // Skicka begäran till servern
	request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if ( (request.readyState == 4) && (request.status == 200) ) {
			response = JSON.parse(request.responseText);
			//skapar en array för objekten med avståndsdata som senare används i funktionen createMarkers.
			distanceObjects = response.payload;
		}
	}
}// end requestDistance
//callback-funktion som skickas med vid anrop till SMAPI från setGolfMarkers
function createClubMarkers(smapiObjects) {
	for (var i = 0; i < smapiObjects.length; i++) {
		if (smapiObjects[i].id == localStorage.clubID) {
			smapiObjects.splice(i, 1);
			break;
		}
	}
	clubMarkers = createMarkers(smapiObjects, "pics/map_icons/golf.png");
	showMarkers(clubMarkers);
} 
//callback-funktion som skickas med vid anrop till SMAPI från setHotelMarkers
function createHotelMarkers(smapiObjects) {
	hotelMarkers = createMarkers(smapiObjects, "pics/map_icons/hotel.png");
	showMarkers(hotelMarkers);
} 
//callback-funktion som skickas med vid anrop till SMAPI från setHotelMarkers
function createCampingMarkers(smapiObjects) {
	campingMarkers = createMarkers(smapiObjects, "pics/map_icons/camping.png");
	showMarkers(campingMarkers);
} 
//callback-funktion som skickas med vid anrop till SMAPI från setHotelMarkers
function createCabinMarkers(smapiObjects) {
	cabinMarkers = createMarkers(smapiObjects, "pics/map_icons/camping.png");
	showMarkers(cabinMarkers);
}
//callback-funktion som skickas med vid anrop till SMAPI från setFoodMarkers
function createFoodMarkers(smapiObjects) {
	foodMarkers = createMarkers(smapiObjects, "pics/map_icons/food.png");
	showMarkers(foodMarkers);
}
//callback-funktion som skickas med vid anrop till SMAPI från setActivitiesMarkers
function createActivitiesMarkers(smapiObjects) {
	activitiesMarkers = createMarkers(smapiObjects, "pics/map_icons/activities.png");
	showMarkers(activitiesMarkers);
}
//funktion som anropas med hjälp av addListener i init()
function setClubMarkers() {
	if (clubMarkers == null) {
		requestSMAPI(createClubMarkers, "golf");
	} else {
		showMarkers(clubMarkers);
	}
	removeListener(clubBtn,"click",setClubMarkers);
	addListener(clubBtn,"click",hideClubMarkers);
}
//funktion som anropas med hjälp av addListener i init()
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
		requestSMAPI(createCabinMarkers, "cabins");
	} else {
		showMarkers(cabinMarkers);
	}
	removeListener(hotelBtn,"click",setCabinMarkers);
	addListener(hotelBtn,"click",hideCabinMarkers);
}
//funktion som anropas med hjälp av addListener i init()
function setFoodMarkers() {
	if (foodMarkers == null) {
		requestSMAPI(createFoodMarkers, "restaurant");
	} else {
		showMarkers(foodMarkers);
	}

	removeListener(foodBtn,"click",setFoodMarkers);
	addListener(foodBtn,"click",hideFoodMarkers);
}
//funktion som anropas med hjälp av addListener i init()
function setActivitiesMarkers() {
	if (activitiesMarkers == null) {
		requestSMAPI(createActivitiesMarkers, "culture");
	} else {
		showMarkers(activitiesMarkers);
	}
	removeListener(activitiesBtn,"click",setActivitiesMarkers);
	addListener(activitiesBtn,"click",hideActivitiesMarkers);
}
//funktion som anropas med hjälp av addListener i init()
function hideClubMarkers() {
	hideMarkers(clubMarkers);
	addListener(clubBtn,"click",setClubMarkers);
	removeListener(clubBtn,"click",hideClubMarkers);
}
//funktion som anropas med hjälp av addListener i init()
function hideHotelMarkers() {
	hideMarkers(hotelMarkers);
	addListener(hotelBtn,"click",setHotelMarkers);
	removeListener(hotelBtn,"click",hideHotelMarkers);
}
//funktion som anropas med hjälp av addListener i init()
function hideCampingMarkers() {
	hideMarkers(campingMarkers);
	addListener(hotelBtn,"click",setCampingMarkers);
	removeListener(hotelBtn,"click",hideCampingMarkers);
}
//funktion som anropas med hjälp av addListener i init()
function hideCabinMarkers() {
	hideMarkers(cabinMarkers);
	addListener(hotelBtn,"click",setCabinMarkers);
	removeListener(hotelBtn,"click",hideCabinMarkers);
}
//funktion som anropas med hjälp av addListener i init()
function hideFoodMarkers() {
	hideMarkers(foodMarkers);
	addListener(foodBtn,"click",setFoodMarkers);
	removeListener(foodBtn,"click",hideFoodMarkers);
}
//funktion som anropas med hjälp av addListener i init()
function hideActivitiesMarkers() {
	hideMarkers(activitiesMarkers);
	addListener(activitiesBtn,"click",setActivitiesMarkers);
	removeListener(activitiesBtn,"click",hideActivitiesMarkers);
}
 //-- GEMENSAMMA -- FUNKTIONER --//

 // JSONobjekten skickas med till denna funktion som skapar markeringarna.
function createMarkers(smapiObjects, pic) {
	var markers = [];
	for (var i = 0; i < smapiObjects.length; i++) {
		var latlng = {lat: Number(smapiObjects[i].latitude), lng: Number(smapiObjects[i].longitude)};
		var newMarker = new google.maps.Marker ({
			position: latlng,
			id: smapiObjects[i].id,
			title: smapiObjects[i].name,
			animation: google.maps.Animation.DROP,
			icon: pic,
			url: smapiObjects[i].website,
			rating: smapiObjects[i].ratings,
			opening: smapiObjects[i].opening_time.slice(0,5),
			closing: smapiObjects[i].closing_time.slice(0,5),
			});
		markers.push(newMarker);

		// Hitta distance från andra listan
		for (var j = 0; j < distanceObjects.length; j++) {
			if (distanceObjects[j].id == newMarker.id) {
				markers[i].distance = distanceObjects[j].distance_in_km;
			}
		}
		var content;
		var infoWindow = new google.maps.InfoWindow();
  		markers[i].addListener('click', function() {
		if (Number(this.id) < 40) {
			var link = "<a href='clubinfo.html'>Mer info</a>";
			localStorage.clubID = this.id;
		}
		else {
			var link = "<a target='_blank' href=" + this.url + ">Webbplats</a>";
		}
		content = "<h4>" + this.title + "</h4>" + "<b>Avstånd från golfbanan:</b> " + Math.round(this.distance) + "km" + "<br>" + "<b>Betyg: </b>" + this.rating + "<br>" +  "<b>Öppnar: </b>" + this.opening + "<br>" + "<b>Stänger: </b>" + this.closing +"<br>" + link;
		infoWindow.setContent(content);
		infoWindow.open(map,this);
 		});
	}//end loop

	return markers;
}//end createMarkers
function showMarkers(markers) {
	for (var i = 0; i < markers.length; i++) {

		markers[i].setMap(map);
	}
} // end showMarkers
function hideMarkers(markers) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
} // end hideMarkers