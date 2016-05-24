//projekt vt16 -- golfguiden
//globala variabler
//HTML-elems
var wrapElem;
var description;
var extrainfo;
var saveBtn; // knapp för att spara.
// klubb-objekt
var choosenClub;
function init () {
	// HTML-elems
	wrapElem = document.getElementById("wrap");
	description = document.getElementById("coursetext");//HTML-element för description.
	extrainfo = document.getElementById("extrainfo");
	saveBtn = document.getElementById("saveBtn");

	addListener(saveBtn,"click",saveClub);
	var picBox = document.getElementById("bildruta");
	//addListener(picBox,"mouseover",saveClub);

	getClub();
	disqus(); // lägger till kommentarsfält
} // end init

addListener(window,"load",init);
// hämtar objekt från localStorage.
function getClub() {
	choosenClub = JSON.parse(localStorage.thisClub); 
} // end getClub
//hämtar info från SMAPI och lägger i passande div.
function addClubInfo() {
	var open = choosenClub.opening_time.slice(0,5);
	var closed = choosenClub.closing_time.slice(0,5);

	coursetext.innerHTML = "<h2>" + choosenClub.name + "</h2>" + "<p>" + choosenClub.description + "</p>" ;

	extrainfo.innerHTML += "<p><b>Postadress</b><br>" + choosenClub.address + "<br>" + choosenClub.zip_code + " " + choosenClub.city + "<br>" + "<b>Öppetider</b><br>" + open + " - " + closed + "</p>";
	if (choosenClub.phone_number == "null"){
		extrainfo.innerHTML += "<br><b>Telefon</b>" + choosenClub.phone_number;
	} 

}// end addClubInfo
// sparar objectet choosenClub i web storage, används sedan i min guide.
function saveClub() {

	var clubList = [];
	var count = 0; // flagga för att räkna dubletter


	//if (localStorage.savedClub == null) {
	
		localStorage.savedClub = JSON.stringify(choosenClub);
	//}
	/*else {
		clubList = JSON.parse(localStorage.savedClub);
		clubList.push(choosenClub); 
		localStorage.savedClub = clubList;
	}*/
} // end saveClub
// lägger till kommentarsfält
function disqus() {

	var id = localStorage.clubID; //id för kommentarsfält.
	var disqus = document.getElementById("disqus");
    var disqus_config = function () {
        this.page.url = "http://1me205.lnu.se/course/1me302/vt16/group4/clubinfo.html"; // vet inte om denna stämmer. Det får vi se.
        this.page.identifier = id; //
    };
    (function() {  // DON'T EDIT BELOW THIS LINE
        var d = document, s = d.createElement('script');
        
        s.src = '//golfguidensmalandoland.disqus.com/embed.js';
        
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.disqus).appendChild(s);
    })();
} // end disqus
