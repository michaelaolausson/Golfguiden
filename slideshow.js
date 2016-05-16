// JavaScript Document
"use strict";
//globala variabler
var picArea;
var leftBtn;
var rightBtn;
var textElem;
var picNr;
var currentPicNr;


function init () {
	
	picArea = document.getElementById("bildruta");
	leftBtn = document.getElementById("bildknapp1");
	rightBtn = document.getElementById("bildknapp2");
	textElem = document.getElementById("bildkälla");
	
	currentPicNr = 1;
	
	requestPictures();
	
	addListener(leftBtn,"click",prevPic);
	addListener(rightBtn,"click",nextPic);


}

addListener(window,"load",init);



function loadDefaultPic() {
	var picUrl = "url(" + "bilder/" + picNr[0] + "/bild"+currentPicNr + ".jpg)" ;	
	picArea.style.backgroundImage = picUrl ;
}
	
function prevPic() {	
	
	currentPicNr = currentPicNr-1;
	if(currentPicNr<1) {currentPicNr = 3;}
	var picUrl = "url(" + "bilder/" + picNr[0] + "/bild"+currentPicNr + ".jpg)" ;	
	picArea.style.backgroundImage = picUrl ;
}

function nextPic() {
	
	currentPicNr = currentPicNr+1;
	if(currentPicNr>3) {currentPicNr = 1;}
	var picUrl = "url(" + "bilder/" + picNr[0] + "/bild"+currentPicNr + ".jpg)" ;	
	picArea.style.backgroundImage = picUrl ;
}
	

function requestPictures() {
	var request; // Object för Ajax-anropet
	if (XMLHttpRequest) { request = new XMLHttpRequest(); } 
	else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
	else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
	request.open("GET","golf_courses.json",true);
	request.send(null); 
	request.onreadystatechange = function () { 
		if ( (request.readyState == 4) && (request.status == 200) ) getPictures(request.responseText);	
		};
	} 

function getPictures(JSONtext) {
	var jsonList;		// JSON-objekt
	var i;				// Loopvariabel
	var HTMLcode;		// Textsträng med ny HTML-kod
	
		jsonList = JSON.parse(JSONtext);
		HTMLcode = "" ;
		picNr = [];
		
		for (i=0; i<1; i++) {
		HTMLcode = jsonList.courses[8].short;
		picNr.push(HTMLcode);
		}
		
		loadDefaultPic();
} 


