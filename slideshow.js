// JavaScript Document
"use strict";
//globala variabler
var picArea;		//bildrutan till bildspelet
var leftBtn;		//byt bild vänster
var rightBtn;	//byt bild höger
var textElem;	
var picNr;		
var currentPicNr;

var square1;
var square2;
var square3;
var square4;
var square5;
var square6;

var eighteenholes;
var nineholes;
var range;
var paynplay;
var golfcar;
var restaurant;

var hotelBtn;
var clubBtn;
var activitiesBtn;
var foodBtn;

var weatherLink;
var weather;

var jsonList;		// JSON-objekt



var id = localStorage.clubID;

function init () {
	
	picArea = document.getElementById("bildruta");
	leftBtn = document.getElementById("bildknapp1");
	rightBtn = document.getElementById("bildknapp2");
	textElem = document.getElementById("bildkälla");
	
	square1 = document.getElementById("ruta1");
	square2 = document.getElementById("ruta2");
	square3 = document.getElementById("ruta3");
	square4 = document.getElementById("ruta4");
	square5 = document.getElementById("ruta5");
	square6 = document.getElementById("ruta6");
	
	hotelBtn = document.getElementById("hotelBtn");
	clubBtn = document.getElementById("clubBtn");
	activitiesBtn = document.getElementById("activitesBtn");
	foodBtn = document.getElementById("foodBtn");
	
	weather = document.getElementById("c_3ed58ccac01c24b23af7949c23655592");
	
	currentPicNr = 1;
	
	
	requestPictures();
	
	
	addListener(leftBtn,"click",prevPic);
	addListener(rightBtn,"click",nextPic);
	
	addListener(hotelBtn,"click",hotelBtnChange);
	addListener(clubBtn,"click",clubBtnChange);
	addListener(activitiesBtn,"click",activitiesBtnChange);
	addListener(foodBtn,"click",foodBtnChange);

}

addListener(window,"load",init);



function loadDefaultPic() {	
	var picUrl = "url(" + "bilder/" + picNr[0] + "/bild"+currentPicNr + ".jpg)" ;	
	picArea.style.backgroundImage = picUrl ;
	
	courseinfoPics();
}
	
function prevPic() {			//knappen till vänster i bildspelet
	
	currentPicNr = currentPicNr-1;
	if(currentPicNr<1) {currentPicNr = 3;}
	var picUrl = "url(" + "bilder/" + picNr[0] + "/bild"+currentPicNr + ".jpg)" ;	
	picArea.style.backgroundImage = picUrl ;
}

function nextPic() {			//knappen till höger i bildspelet
	
	currentPicNr = currentPicNr+1;
	if(currentPicNr>3) {currentPicNr = 1;}
	var picUrl = "url(" + "bilder/" + picNr[0] + "/bild"+currentPicNr + ".jpg)" ;	
	picArea.style.backgroundImage = picUrl ;
}


function placePics()			//placerar kryss eller bock i rutorna

		{
		if(eighteenholes == "yes") {
			square1.src = "pics/check.png";
			}
			
		if(nineholes == "yes") {
			square2.src = "pics/check.png";
			}
			
		if(range == "yes") {
			square3.src = "pics/check.png";
			}
			
		if(paynplay == "yes") {
			square4.src = "pics/check.png";
			}
			
		if(golfcar == "yes") {
			square5.src = "pics/check.png";
			}
			
		if(restaurant == "yes") {
			square6.src = "pics/check.png";
			}
			
			getWeatherLink();

		}
		
		
function hotelBtnChange(){
	if(hotelBtn.className === "hotelGreen") {
		hotelBtn.src = "pics/map_buttons/boende.png";
		hotelBtn.className = "hotelBlack";
		return;
		} 
	hotelBtn.src = "pics/map_buttons/boende_dolj.png";
	hotelBtn.className = "hotelGreen";	 
}

function clubBtnChange(){
	if(clubBtn.className === "clubGreen") {
		clubBtn.src = "pics/map_buttons/golfklubbar.png";
		clubBtn.className = "clubBlack";
		return;
		} 
	clubBtn.src = "pics/map_buttons/golfklubbar_dolj.png";
	clubBtn.className = "clubGreen";	 
}

function activitiesBtnChange(){
	if(activitiesBtn.className === "activitiesGreen") {
		activitiesBtn.src = "pics/map_buttons/sevardheter.png";
		activitiesBtn.className = "activitiesBlack";
		return;
		} 
	activitiesBtn.src = "pics/map_buttons/sevardheter_dolj.png";
	activitiesBtn.className = "activitiesGreen";	 
}

function foodBtnChange(){
	if(foodBtn.className === "foodGreen") {
		foodBtn.src = "pics/map_buttons/restauranger.png";
		foodBtn.className = "foodBlack";
		return;
		} 
	foodBtn.src = "pics/map_buttons/restauranger_dolj.png";
	foodBtn.className = "foodGreen";	 
}

	

function requestPictures() { 		//json anrop
	var request; 					// Object för Ajax-anropet
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
	
	var i;				// Loopvariabel
	var HTMLcode;		// Textsträng med ny HTML-kod
	
		jsonList = JSON.parse(JSONtext);
		HTMLcode = "" ;
		picNr = [];
		
		for (i=0; i<1; i++) {
		HTMLcode = jsonList.courses[id-1].short;
		picNr.push(HTMLcode);
		}
		
		loadDefaultPic();
} 




function courseinfoPics() {		//går igenom JSON-filen och ser om banan har 18 hål, golfbil, restaurang osv

	var j;				// Loopvariabel
	var HTMLcode;		// Textsträng med ny HTML-kod
	

		HTMLcode = "" ;
		eighteenholes = [];
		nineholes = [];
		range = [];
		paynplay = [];
		golfcar = [];
		restaurant = [];
		
		for (j=0; j<1; j++) {
			
		HTMLcode = jsonList.courses[id-1].eighteenholes;
		eighteenholes.push(HTMLcode);
		HTMLcode = "";
		
		HTMLcode = jsonList.courses[id-1].nineholes;
		nineholes.push(HTMLcode);
		HTMLcode = "";
		
		HTMLcode = jsonList.courses[id-1].range;
		range.push(HTMLcode);
		HTMLcode = "";
		
		HTMLcode = jsonList.courses[id-1].paynplay;
		paynplay.push(HTMLcode);
		HTMLcode = "";
		
		HTMLcode = jsonList.courses[id-1].golfcar;
		golfcar.push(HTMLcode);
		HTMLcode = "";
		
		HTMLcode = jsonList.courses[id-1].restaurant;
		restaurant.push(HTMLcode);
		HTMLcode = "";
		}
		
		placePics();			//anropa funktionen för att placera in rätt bilder (kryss eller bock)
}

	
function getWeatherLink() {
	var k;				// Loopvariabel
	var HTMLweather;		// Textsträng med ny HTML-kod
	
		
		HTMLweather = "" ;
		weatherLink = [];
		
		for (k=0; k<1; k++) {
		HTMLweather = jsonList.courses[id-1].weather;
		weatherLink.push(HTMLweather);
		
		}
		
	
	addWeather();
}


function addWeather(){
	
	
	weather.src = weatherLink;
	}


