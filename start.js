//globala variabler
var key = "reu|NdmV"; // SMAPI-nyckel
//formulär
var input; // sökfältet
var searchBtn; // sökknappen    
//arrays
var JSONobjects = []; // array 
var markers = []; // array för markering på kartan, men endast en ska användas..
var idObjs; // objekt med taggar
var nearbyObjects; //array med närliggande objekt.
var nearbyObjects; // array med närliggande golfklubbar hämtat från nearbyObjects
//karta
var map; // kartobjekt
var geocoder; // geocoder-objekt

function init() {
	//sökfältet
	input = document.getElementById("searchWindow");
	input.style.color = "#929292";
	addListener(input,"focus",removeText);
	addListener(input,"focus",getMap);
	//karta 
	map = new google.maps.Map(document.getElementById('map'), {
	    center: {lat: 57.167925, lng: 15.347129},
	    zoom: 7,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
  	});   
  	//stiländringar för kartobjektet. Ändring av färg på landmassa, vägar och vatten. 
  	map.set('styles', [
		{featureType: 'road', elementType: 'geometry',stylers: [{ color:'#ffffff'},{weight: 0.8}]}, 
		{featureType: 'road',elementType: 'labels',stylers: [{ saturation: 100 },{invert_lightness: true}]}, 
		{featureType: 'landscape',elementType: 'geometry.fill',stylers: [{color: '#799a24'}] },
		{featureType: 'water',elementType: 'geometry.fill',stylers:[{color: '#4a6c8e'}]},  
	]);
  	geocoder = new google.maps.Geocoder();
  	searchBtn = document.getElementById("searchButton");
  	addListener(searchBtn,"click",searchClub);
	//anrop
	requestSMAPI();
	submitEnter();
} // end init
// funktion för att enter-tangenten ska fungera på samma sätt som sökknappen.
function submitEnter() {
 	var submit = document.createElement("input");
	var form = document.getElementsByTagName("form")[0];
	submit.type = "submit";
	submit.style = "display:none";
	form.onsubmit = searchClub;
	form.appendChild(submit);
	addListener(form,"submit",function(event){
		event.preventDefault()
	});
}// end sumbitEnter
addListener(window,"load",init);
// tar bort text ur sökfältet när det är i fokus.
function removeText() {
	input.value = "";
	input.style.color = "#000000";
} // end removeText
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
// mellanlandning för smapi-objekten.
function getSMAPI(response) {
	response = JSON.parse(response);
	JSONobjects = response.payload;
	getMapMarkers();
} // end getSMAPI
// kod för sökruta där automatisk alternativ kommer fram när man börjar skriva.
function getMap() {
//-- kod från https://developers.google.com/maps/documentation/javascript/examples/places-searchbox med vissa ändringar (de är kommenterade på svenska). --//
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
    // ändring av ikon, till egen bild.
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
	// anropar ny requestfunktion för att kunna ladda in inforutor för närliggande klubbar.
	        requestNearbyClubs(lat,lng); 
	    }else {
	    	bounds.extend(place.geometry.location);
	     }
	    });
    map.fitBounds(bounds);
  });
 // slut på kod från https://developers.google.com/maps/documentation/javascript/examples/places-searchbox med ändringar för referens av sökruta.
}//end getMap
function getMapMarkers() {
// går igenom samtliga JSON-objekt som är golfrelaterade (golfklubbar)
var myLatLng; // koordinater
var markers = [];
	for (var i = 0; i < JSONobjects.length; i++) {
		newMarker = new google.maps.Marker;
		markers.push(newMarker);
		myLatLng = {lat: Number(JSONobjects[i].latitude), lng: Number(JSONobjects[i].longitude)};
		markers[i] = new google.maps.Marker ({
		position: myLatLng,
		title: JSONobjects[i].name,
		animation: google.maps.Animation.DROP,
		id: JSONobjects[i].id,
		icon: "pics/map_icons/golf.png",
		map: map,
		url: "clubinfo.html",
		rating: JSONobjects[i].ratings,
		opening: JSONobjects[i].opening_time.slice(0,5),
		closing: JSONobjects[i].closing_time.slice(0,5)
		});
		var content;
		var infoWindow = new google.maps.InfoWindow();
  		markers[i].addListener('click', function() {
  			clubID = this.id;
			localStorage.clubID = clubID;
  			var link = "<a href=" + this.url + ">Mer info</a>"
  			content = "<h4>" + this.title + "</h4>" + "<b>Betyg: </b>" + this.rating + "<br>" +  "<b>Öppnar: </b>" + this.opening + "<br>" + "<b>Stänger: </b>" + this.closing +
  					"<br>" + link;
	  		infoWindow.setContent(content);
	    	infoWindow.open(map,this);
 		 });
	}
}//end getMapMarkers
// lägger in värdet i textfältet i Geocode-sökning via google maps API
function searchClub() {
	localStorage.inValue = input.value;
	inValue = localStorage.inValue;
	var address = inValue;
	  	geocoder.geocode({'address': address}, function(results, status) {
	    if (status === google.maps.GeocoderStatus.OK) {
	     	map.setCenter(results[0].geometry.location);
	     	map.setZoom(11);
	    var markers = [];
	   	markers.push(new google.maps.Marker({
        map: map,
        icon: "pics/map_icons/here.png",
        position: results[0].geometry.location
	    }));   	
		// lat och lng plockas ur positionobjektet för att användas vid anrop av requestNearbyClubs.
		var lat = markers[0].getPosition().lat();
		var lng = markers[0].getPosition().lng();
		var placePosition = {lat:lat,lng:lng};
		lat = placePosition.lat;
		lng = placePosition.lng;
	
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
	nearbyObjects = []; //array med närliggande objekt.
	var request; // request for AJAX
	if (XMLHttpRequest) { request = new XMLHttpRequest(); } // Olika objekt (XMLHttpRequest eller ActiveXObject), beroende på webbläsare
	else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
	else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
	request.open("GET","https://cactuar.lnu.se/course/1me302/?key=" + key + "&controller=location&method=getByLatLng&lat=" + lat + "&lng=" + lng + "&radius=100",true);
	request.send(null); // Skicka begäran till servern
	request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if ( (request.readyState == 4) && (request.status == 200) ) {
			var nearbyObj = JSON.parse(request.responseText);
			nearbyObj = nearbyObj.payload;	
			for (var i = 0; i < nearbyObj.length; i++) {
				nearbyObjects.push(nearbyObj[i]);
			}
			getNearbyClubs();
		}
	};
}//end requestNearby
// jämför de närliggande objekten mot golfobjekten. Om ett matchande id upptäcks så anropas addInfoBoxes()
function getNearbyClubs() {
	nearbyGolfClubs = [];
	for (var i = 0; i < nearbyObjects.length; i++) {

		for (var j = 0; j < JSONobjects.length; j++) {

			if (nearbyObjects[i].id == JSONobjects[j].id) {

				nearbyGolfClubs.push(nearbyObjects[i]);
				addInfoBoxes();
			}
		}
	}		
}//end getNearbyClubs
//skriver ut infoboxar för närliggande klubbar i resElem. 
function addInfoBoxes() {
	//tömmer diven resElem innan nya rutor fylls på.
	document.getElementById("resElem").innerHTML = "";
	//loopar utsorterade golfobjekt och lägger till inforutor med innehåll från dem.
	if (nearbyGolfClubs.length > 0) {
		for (var i = 0; i < nearbyGolfClubs.length; i++) {
			//div - Element
			infoBox = document.createElement("div");
			infoBox.className = "infoBox";
			var t = document.createTextNode(nearbyGolfClubs[i].name);
			//titel - Element
			var h3 = document.createElement("h3");
			h3.className = "clubTitle";
			h3.appendChild(t);
			infoBox.appendChild(h3);
			var rating = nearbyGolfClubs[i].ratings;
			var r = document.createTextNode(rating);
			//för att samtliga betyg ska skrivas ut i samma format (med en decimal) läggs här till .0 på de tal som saknar detta.
			var r2 = document.createTextNode(".0");
			var pRate = document.createElement("p");
			pRate.className = "rating";
			pRate.appendChild(r);
			if (rating.length < 2) {
				pRate.appendChild(r2);
			}	
			infoBox.appendChild(pRate);
			var clubPic = document.createElement("img");
			clubPic.src = "pics/klubbhus.jpg"; // ska bytas mot bild via JSON-fil.
			clubPic.className = "golfhouse";
			clubPic.alt = "växjö klubbhus"; //ändras till payload.title sen kanske?
			var golfballPic = document.createElement("img");
			golfballPic.src = "pics/golfboll.png";
			golfballPic.className = "ratingBall";
			golfballPic.alt = "bild golfboll";
			//länk till infosida
			var a = document.createElement("a");
			a.href = ("clubinfo.html")
			a.id = nearbyGolfClubs[i].id;
			a.className = "infoLink";
			var linkName = document.createTextNode("Mer information");
			a.appendChild(linkName);
			infoBox.appendChild(golfballPic);
			infoBox.appendChild(clubPic);
			infoBox.appendChild(a);
			// lägger infoelementen i div-elementet med id resElem. 
			resElem.appendChild(infoBox); 
			//händlsehanterare för länken
			addListener(a,"click",loadInfoPage);
		}
	}
	else {
		//finns inga objekt i nearbyGolfClubs skrivs en text ut istället.
		document.getElementById("resElem").innerHTML = "Tyvärr finns det inga golfklubbar inom den bestämda radien. Prova en ny sökning.";
	}
}//end addInfoBoxes
//laddar in clubinfo.html med id från vald klubb. 
function loadInfoPage() {
 	var clubID = this.id;
	localStorage.clubID = clubID;
}