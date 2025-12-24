//
// 24/12/25
//

let peerConnexion = null;

function switchPage() {
	document.getElementById('page1').style.display = 'none';
	document.getElementById('page2').style.display = 'block';
}

function displayPage(name, status) {
	document.getElementById(name).style.display = status;
}

document.getElementById("generateOffer").addEventListener('click', async function generateOffer(event) {
	let offer;

	if (!peerConnexion.localDescription) {
		offer = await peerConnexion.createOffer();
		console.log("Very new offer generated:", offer);
		await peerConnexion.setLocalDescription(offer);
		displayPage("generateOfferTextArea", "block");
	} else {
		offer = peerConnexion.localDescription;
		console.log("Doesnt need a new offer");
	}
	const textArea = document.getElementById("generateOfferTextArea");
	textArea.value = await JSON.stringify(offer);
});

document.getElementById("submitOffer").addEventListener('click', async function applyRemoteOffer(event) {
	let remoteOffer;
	
	remoteOffer = document.getElementById("submitOfferTextArea");
	if (!remoteOffer) {
		//signal this is wrong
	}
	await peerConnexion.setRemoteDescription(JSON.parse(remoteOffer.value));
	const answer = await peerConnexion.createAnswer();
	await peerConnexion.setLocalDescription(answer);
	console.log("Answer: ", answer);
	const giveAnswer = document.getElementById("answerTextArea");
	giveAnswer.value = JSON.stringify(answer);
	displayPage("submitAnswer", "block");
});

async function createMainObj(server) {
	peerConnexion = new RTCPeerConnection({ iceServers: [{ urls: server }] });

	//peerConnexion.onicecandidate = (event) => {
	//	if (event.candidate) {
	//		console.log("✅ Serveur STUN fonctionne !");
	//		console.log("Candidat reçu:", event.candidate.candidate);
	//	} else {
	//		console.log("Failed to connect");
	//	}
	//};

	console.log('connexion state:',peerConnexion.connectionState, " -- offer: ", peerConnexion.offer);
}

// Automatic STUN
document.getElementById('autoIP').addEventListener('click', async function autoSTUN(event) {
	event.preventDefault();
	console.log("Automatique ! ");
	switchPage();
	await createMainObj("stun:stun.services.mozilla.com:3478");
	//stun:stun.l.google.com:19302
	// add more
});

// Manual STUN
document.getElementById('formIP').addEventListener('submit', function manualSTUN(event) {
	let isValidServer = false;
	const server = document.getElementById('customIP').value;
	event.preventDefault();

	console.log('server: ', server);
	sessionStorage.setItem('stun_server', server);
	if (isValidServer === false) { // set to true
		switchPage();
		launchPeerConnexion(server);
	} else {
		document.getElementById("onError").innerHTML = "serveur invalide !"
	}
});