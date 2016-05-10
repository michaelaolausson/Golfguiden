// Michaela Olausson VT 2016
// globala variabler
var map; // kartobjektet
//knappar
var clubBtn; // knapp för golfklubbar
var foodBtn; // knapp för restauranger
var hotelBtn; // knapp för boende
var activitesBtn; // knapp för övriga aktiviterer
var myMarkers; // klubbmarkeringar.
// arrayer för mareringar
var coordinates = [];
var myMarkers = []; 
var JSONobjects = []; //array med JSONobjekt


function init() {

	clubBtn	= document.getElementById("clubBtn");
	foodBtn	= document.getElementById("foodBtn");
	hotelBtn = document.getElementById("hotelBtn");
	poiBtn = document.getElementById("activitesBtn");

	addListener(clubBtn,"click",setGolfMarkers);
	addListener(foodBtn,"click",setFoodMarkers);
	addListener(hotelBtn,"click",setHotelMarkers);
	addListener(poiBtn,"click",setActivitiesMarkers);

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

    		var marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			title: choosenClub.name,
  });

	}
}
}

// hämtar golfklubbar via SMAPI
function requestSMAPI(tags) {

	var request; // request for AJAX
	var key = "reu|NdmV";
	var response; // JSONdata

	if (XMLHttpRequest) { request = new XMLHttpRequest(); } // Olika objekt (XMLHttpRequest eller ActiveXObject), beroende på webbläsare
	else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
	else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
	
	request.open("GET","https://cactuar.lnu.se/course/1me302/?key=reu|NdmV&controller=location&method=getall&method=getByTags&tags=" + tags,true);
	request.send(null); // Skicka begäran till servern
	request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if ( (request.readyState == 4) && (request.status == 200) ) {
			
			response = JSON.parse(request.responseText);
			JSONobjects = response.payload;

			for (i = 0; i < JSONobjects.length; i++) {

				latlng =  {lat: Number(JSONobjects[i].latitude), lng: Number(JSONobjects[i].longitude)};

				coordinates.push(latlng);
			}
				addMapMarkers();
		}
	}
} // end requestSMAPIgolf

function setGolfMarkers() {

	removeListener(clubBtn,"click",setGolfMarkers);
	addListener(clubBtn,"click",removeGolfMarkers);

	requestSMAPI("golf");
}

function removeGolfMarkers() {

	var i; // loopvariabel.

	for (i = 0; i < myMarkers.length; i++) {

			myMarkers[i].setMap(null);
	}

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

			});

		myMarkers[i].setMap(map); // sätter makeringen på vald karta för att kunna ta bort dem genom myMarkers[i].setMap(null);
	} 
}
