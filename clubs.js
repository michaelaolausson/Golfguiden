function init() {

	// bokstavsordningsknappen-anropar getSMAPI utan parameter. Detta är grundläget. dvs. sortering i bokstavsordning.
	// nybörjarvänliga klubbars id får jämföras med övriga klubbars id. vid match skrivs den ut. 
	// övriga sorteringsknappar anropar en ny requestfunktion där method för sotering anropas

	requestSMAPI();
}
addListener(window,"load",init);
function requestSMAPI() {
	var request; // request for AJAX
	if (XMLHttpRequest) { request = new XMLHttpRequest(); } // Olika objekt (XMLHttpRequest eller ActiveXObject), beroende på webbläsare
	else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
	else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
	request.open("GET","https://cactuar.lnu.se/course/1me302/?key=reu|NdmV&controller=location&method=getByTags&tags=golf",true);
	request.send(null); // Skicka begäran till servern
	request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if ( (request.readyState == 4) && (request.status == 200) ) getSMAPI(request.responseText);
	};
} // end requestSMAPI

// placerar information i inforutan.
function getSMAPI(response) {

	var JSONobjects; // array med JSON-object
	var infoBox; // div-element för info
	var clubTitle; // h3-element
	var clubDesc; // klubbeskrivning.
	var rating; // p-element för betyg.
	var wrapElem; //div elem
	response = JSON.parse(response);
	JSONobjects = response.payload; 
	wrapElem = document.getElementById("wrap");
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
			// Beskrivning
			clubDesc = document.createTextNode(JSONobjects[i].description);
			var p = document.createElement("p");
			p.className = "clubDesc";
			p.appendChild(clubDesc);
			infoBox.appendChild(clubDesc);
			//betyg
			/*var r = document.createTextNode(JSONobjects[i].ratings);
			var pRate = document.createElement("p");
			pRate.className = "rating";
			pRate.appendChild(r);
			infoBox.appendChild(pRate);*/
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

			wrapElem.appendChild(infoBox); // lägger infoelementen i div-elementet med id wrap. 
		}
} // end getSMAPI