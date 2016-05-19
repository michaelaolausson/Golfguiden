var key = "reu|NdmV"; // SMAPI-nyckel
var abcBtn; //knapp för sortering i bokstavsordning.
var priceBtn; //knapp för sortering i pris, billigast först.
var ratingsBtn;
// array
var JSONobjects; // array med JSON-object
function init() {
	//sortering i bokstavsordning
	abcBtn = document.getElementById("abcBtn");
	addListener(abcBtn,"click",sortObjByAbc);
	//sortering efter betyg
	ratingsBtn = document.getElementById("ratingsBtn");
	addListener(ratingsBtn,"click",sortObjByRate);
	//sortering efter pris
	priceBtn = document.getElementById("priceBtn");
	addListener(priceBtn,"click",sortObjByPrice);

	requestSMAPI();
}

addListener(window,"load",init);
// anropar SMAPI och hämtar samtliga object som har taggen Golf. 
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
//sorterar objekt efter betyg.

function getSMAPI(response) {
	response = JSON.parse(response);
	JSONobjects = response.payload;
	sortObjByAbc();
	return JSONobjects;
}
//sorterar JSON-objekten i bokstavsordning
function sortObjByAbc() {
	JSONobjects.sort( function( a, b ) {
    a = a.name.toLowerCase();
    b = b.name.toLowerCase();
    return a < b ? -1 : a > b ? 1 : 0;
});
	addInfoBoxes();
}
//sorterar objekten efter ratings. högst betyg först.
function sortObjByRate() {
	JSONobjects.sort(function(a, b){return b.ratings - a.ratings;});
	addInfoBoxes();
} // sortObjByAbc
//sorterar objekt efter prisnivå. lägsta först.
function sortObjByPrice() {
	JSONobjects.sort(function(a, b){return a.price_factor - b.price_factor;});
	addInfoBoxes();
}
// skapar inforutor och placerar information i inforutor.
function addInfoBoxes() {
	var infoBox; // div-element för info
	var clubTitle; // h3-element
	var clubDesc; // klubbeskrivning.
	var rating; // p-element för betyg.
	var resElem; //div elem
	resElem = document.getElementById("resElem");
	resElem.innerHTML = "";
	for (var i = 0; i < JSONobjects.length; i++) {
		//div - Element
		infoBox = document.createElement("div");
		infoBox.className = "infoBox";
		var t = document.createTextNode(JSONobjects[i].name);
		//titel - Element
		var h3 = document.createElement("h3");
		h3.className = "clubTitle";
		h3.appendChild(t);
		infoBox.appendChild(h3);
		var rating = JSONobjects[i].ratings;
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
		a.id = JSONobjects[i].id;
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
}//end addInfoBoxes
function loadInfoPage() {
 	var clubID = this.id;
	localStorage.clubID = clubID;
}