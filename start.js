//globala variabler

var key = "reu|NdmV"; // SMAPI-nyckel
var JSONobjects; //array for clubinfo elems (data from SMAPI).
var input; // sökfältet
var searchBtn; // sökknappen    
var enter; // entertangenten
var JSONobjects = []; // array 
var map; // kartobjekt
var markers = []; // array för markering på kartan, men endast en ska användas..

function init() {
	//sökfältet
	input = document.getElementById("searchWindow");
	input.style.color = "#929292";
	//addListener(input,"focus",removeText);
	//karta 
	map = new google.maps.Map(document.getElementById('map'), {
	    center: {lat: 57.167925, lng: 15.347129},
	    zoom: 7,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
  	});   
  	var geocoder = new google.maps.Geocoder();
  	searchBtn = document.getElementById("searchButton");
	//addListener(searchBtn,"click",searchClub(geocoder));
	addListener(input,"focus",getMap);
	var value = input.value;
	localStorage.value = input.value;
	//addListener(searchBtn,"click",searchClub(geocoder,value)); // nånting stämmer inte här.

	//stiländringar för kartobjektet. Ändring av färg på landmassa, vägar och vatten. 
  	map.set('styles', [
		{featureType: 'road', elementType: 'geometry',stylers: [{ color:'#ffffff'},{weight: 0.8}]}, 
		{featureType: 'road',elementType: 'labels',stylers: [{ saturation: 100 },{invert_lightness: true}]}, 
		{featureType: 'landscape',elementType: 'geometry.fill',stylers: [{color: '#799a24'}] },
		{featureType: 'water',elementType: 'geometry.fill',stylers:[{color: '#4a6c8e'}]},  
	]);
	//anrop
	requestSMAPI();

} // end init

addListener(window,"load",init);

/*function removeText() {
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
} // end addText*/

function requestSMAPI() {
	var request; // request for AJAX
	if (XMLHttpRequest) { request = new XMLHttpRequest(); } // Olika objekt (XMLHttpRequest eller ActiveXObject), beroende på webbläsare
	else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
	else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
	request.open("GET","https://cactuar.lnu.se/course/1me302/?key=" + key + "&controller=location&method=getByTags&tags=golf",true);
	request.send(null); // Skicka begäran till servern
	request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if ( (request.readyState == 4) && (request.status == 200) ) 
			getSMAPI(request.responseText);
	};
} // end requestSMAPI

function getSMAPI(response) {

	response = JSON.parse(response);
	JSONobjects = response.payload;
	getMapMarkers();
}
// kod för sökruta där automatisk alternativ kommer fram när man börjar skriva.
function getMap() {
//-- kod från https://developers.google.com/maps/documentation/javascript/examples/places-searchbox med ändringar för referens av sökruta. --//
	// Create the search box and link it to the UI element.
  	var searchBox = new google.maps.places.SearchBox(input);
	// Bias the SearchBox results towards current map's viewport.
	map.addListener('bounds_changed', function() {
	searchBox.setBounds(map.getBounds());
	});
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
   	// zooma in på vald markering. centrera vid markering.
    map.setZoom(11);
    map.setCenter(place.geometry.location);
    // Skapa markering
    markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location,
    }));  
	// lat och lng plockas ur positionobjektet för att användas vid anrop av requestNearbyClubs.
	var lat = markers[0].getPosition().lat();
	var lng = markers[0].getPosition().lng();
	var placePosition = {lat:lat,lng:lng};
	lat = placePosition.lat;
	lng = placePosition.lng;
      
     if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
        requestNearbyClubs(lat,lng); // anropar ny requestfunktion för att kunna ladda in inforutor för närliggande klubbar.
    } else {
    	bounds.extend(place.geometry.location);
     }
    });
    map.fitBounds(bounds);
  });
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
}//end getMapMarkers
// lägger in värdet i textfältet i Geocode-sökning via google maps API
function searchClub(geocoder,value) {

	localStorage.value = value;

	var address = localStorage.value;
	  	geocoder.geocode({'address': address}, function(results, status) {
	    if (status === google.maps.GeocoderStatus.OK) {
	     	map.setCenter(results[0].geometry.location);
	     	map.setZoom(11);
	    	var marker = new google.maps.Marker({
	        map: map,
	        position: results[0].geometry.location,
	        icon: "pics/map_icons/here.png",
	    });

	var lat = markers[0].getPosition().lat();
	var lng = markers[0].getPosition().lng();
		placePosition = {lat:lat,lng:lng};
		lat = placePosition.lat;
		lng = placePostion.lng;
		requestNearbyClubs(lat,lng);
	    } else {
	      alert('Sökningen misslyckades. Anledning: ' + status);
	    }
	  	});
} // end searchClub
//sparar klubbens unika ID i web storage och laddar in ny sida för klubbinformation - lämnar startsidan
function loadClubPage() {
	clubID = this.id;
	localStorage.clubID = clubID;
	window.location.href = "clubinfo.html"; // ladda sida för klubbinformation
} // end loadClubPage

function requestNearbyClubs(lat,lng) {
	var request; // request for AJAX

	if (XMLHttpRequest) { request = new XMLHttpRequest(); } // Olika objekt (XMLHttpRequest eller ActiveXObject), beroende på webbläsare
	else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
	else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
	request.open("GET","https://cactuar.lnu.se/course/1me302/?key=" + key + "&controller=location&method=getByLatLng&lat=" + lat + "&lng=" + lng + "&radius=100&tags=golf",true);
	request.send(null); // Skicka begäran till servern
	request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if ( (request.readyState == 4) && (request.status == 200) ) getNearbyClubs(request.responseText);
	};
}//end requestNearbyClubs.

function getNearbyClubs(response) {
	
	response = JSON.parse(response);
	nearbyClubsElems = response.payload;
	infoBoxElems = document.getElementsByClassName("infoBox");
	//for (var i = 0; i < infoBoxElems.length; i++) {

		document.getElementById("resElem").innerHTML = "";
	//}
	for (var i = 0; i < nearbyClubsElems.length; i++) {

		infoBox = document.createElement("div");
				infoBox.className = "infoBox";
				var t = document.createTextNode(nearbyClubsElems[i].name);
				//titel - Element
				var h3 = document.createElement("h3");
				h3.className = "clubTitle";
				h3.appendChild(t);
				infoBox.appendChild(h3);
				// Beskrivning
				/*clubDesc = document.createTextNode(nearbyClubsElems[i].description);
				var p = document.createElement("p");
				p.className = "clubDesc";
				p.appendChild(clubDesc);
				infoBox.appendChild(clubDesc);*/
				//betyg
				var r = document.createTextNode(JSONobjects[i].ratings);
				var pRate = document.createElement("p");
				pRate.className = "ratingNumber";
				pRate.appendChild(r);
				infoBox.appendChild(pRate);
				var clubPic = document.createElement("img");
				clubPic.src = "pics/klubbhus.png"; // ska bytas mot bild via JSON-fil.
				clubPic.className = "golfhouse";
				clubPic.alt = "växjö klubbhus"; //ändras till payload.title sen kanske?
				var golfballPic = document.createElement("img");
				golfballPic.src = "pics/golfboll.png";
				golfballPic.className = "rating";
				golfballPic.alt = "bild golfboll";

				infoBox.appendChild(golfballPic);
				infoBox.appendChild(clubPic);

				document.getElementById("resElem").appendChild(infoBox); // lägger infoelementen i div-elementet med id wrap. 
	}
}//end getNearbyClubs