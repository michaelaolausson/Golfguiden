//global variables

var myKey =  "AIzaSyA4sq08oYLsb2ZXGE6AbNHhQfrSFryVEsQ"; // google Maps API key
var clubElems; //array for clubinfo elems (data from SMAPI).

function init() {

		requestSMAPI();

} // end init

addListener(window,"load",init);

function requestSMAPI() {

	var request; // request for AJAX
	var key = "reu|NdmV";

	if (XMLHttpRequest) { request = new XMLHttpRequest(); } // Olika objekt (XMLHttpRequest eller ActiveXObject), beroende på webbläsare
	else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
	else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
	
	request.open("GET","https://cactuar.lnu.se/course/1me302/?key=reu|NdmV&controller=location&method=getall&method=getByTags&tags=golf",true);
	request.send(null); // Skicka begäran till servern
	request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if ( (request.readyState == 4) && (request.status == 200) ) getSMAPI(request.responseText);
	};
}

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
          zoom: 8,
    });

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

			});

			var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Hello World!'
  });


			google.maps.event.addListener(myMarkers[i], 'click', loadClubPage)
			
		}
}
	//sparar klubbens unika ID i web storage och laddar in ny sida för klubbinformation - lämnar startsidan
function loadClubPage() {

	clubID = this.id;

	localStorage.clubID = clubID;

	window.location.href = "clubinfo.html"; // ladda sida för klubbinformation
}