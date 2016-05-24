// JavaScript Document

var ratingsBtn;
var beginnerBtn;
var priceBtn;
var abcBtn;

function init() {
	
	ratingsBtn = document.getElementById("ratingsBtn");
	beginnerBtn = document.getElementById("beginnerBtn");
	priceBtn = document.getElementById("priceBtn");
	abcBtn = document.getElementById("abcBtn");
	
	addListener(ratingsBtn,"click",ratingsClick);
	addListener(beginnerBtn,"click",beginnerClick);
	addListener(priceBtn,"click",priceClick);
	addListener(abcBtn,"click",abcClick);
	
	}
	
	addListener(window,"load",init);
	
	function ratingsClick() {
		resetButtons();
		ratingsBtn.src = "pics/klubbar_sortering/betyg_aktiv.png";	
	}
	
	function beginnerClick() {
		resetButtons();
		beginnerBtn.src = "pics/klubbar_sortering/beginner_aktiv.png";	
	}
	
	function priceClick() {
		resetButtons();
		priceBtn.src = "pics/klubbar_sortering/pris_aktiv.png";	
	}
	
	function abcClick() {
		resetButtons();
		abcBtn.src = "pics/klubbar_sortering/bokstavsordning_aktiv.png";	
	}
	
	
	function resetButtons() {
		ratingsBtn.src = "pics/klubbar_sortering/betyg.png";
		beginnerBtn.src = "pics/klubbar_sortering/beginner.png";
		priceBtn.src = "pics/klubbar_sortering/pris.png";
		abcBtn.src = "pics/klubbar_sortering/bokstavsordning.png";
	}