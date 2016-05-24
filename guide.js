// På sidan Min Guide sparas klubbar av intresse i en lista. Detta sker med hjälp av web storage.
var removeBtn;
var wrap
var savedClub; // sparat klubb-objekt
var infoBox;//
var clubList = [];
function init() {
	wrap = document.getElementById("wrap");
	addToClubList();
} // end init	

addListener(window,"load",init);

function addToClubList() {

	if (localStorage.savedClub != null) {

		clubList = JSON.parse(localStorage.savedClub);

		//for (var i = 0; i < clubList.length; i++) {

			infoBox = document.createElement("div");
			infoBox.className = "infoBox";
			var t = document.createTextNode(clubList.name);
			//titel - Element
			var h3 = document.createElement("h3");
			h3.className = "clubTitle";
			h3.appendChild(t);
			infoBox.appendChild(h3);
			//foto
			var clubPic = document.createElement("img");
			clubPic.src = "pics/klubbhus.jpg"; // ska bytas mot bild via JSON-fil.
			clubPic.className = "golfhouse";
			clubPic.alt = "växjö klubbhus"; //ändras till payload.title sen kanske?
			//länk till infosida
			var a = document.createElement("a");
			a.href = ("clubinfo.html");
			a.id = clubList.id;
			a.className = "infoLink";
			var linkBtn = document.createElement("img");
			linkBtn.style.width ="100px";
			linkBtn.src = "pics/merinfo.png";
			linkBtn.className = "infoBtn";
			a.appendChild(linkBtn);
			//ta bort-knapp
			var delImg = document.createElement("img");
			delImg.src = "pics/ta bort.png";
			delImg.style.width ="100px";
			var a2 = document.createElement("a");
			a2.href ="#";
			a2.id = "removeBtn";
			a2.appendChild(delImg);

			infoBox.appendChild(a);
			infoBox.appendChild(a2);
			infoBox.appendChild(clubPic);

			wrap.appendChild(infoBox); 

			removeBtn = document.getElementById("removeBtn");
			addListener(removeBtn,"click",removeClub);
		//}
	}
	else {
		alert("Du har inte sparat nån klubb än.")
	}
}

// tar bort vald klubb ur listan.
function removeClub() {


	wrap.removeChild(infoBox);
}