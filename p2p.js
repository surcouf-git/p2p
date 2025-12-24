//
// 24/12/25
//

// ===== global ===== //
let peerConnexion = null;
//===================//

// ============================ remote save ============================= //
let remoteOffer = null;
let remoteCandidates = [];
let remoteFullOffer = { remoteOffer, remoteCandidates };

function signalError(status) {
	let message = (status === "set" ? "CETTE BOX NE PEUT ETRE VIDE !" : "");
	document.getElementById("onError").innerHTML = message;
}

async function saveRemoteOffer() {
	await peerConnexion.setRemoteDescription(remoteOffer);
}

async function saveRemoteCandidates() {
	for (let i in remoteFullOffer.remoteCandidates.size()) {
		await peerConnexion.addIceCandidate(remoteFullOffer.remoteCandidates[i]);
		console.log('done saving candidate:', remoteFullOffer.remoteCandidates[i]);
	}
}

async function saveRemoteFullOffer() {
	remoteFullOffer = JSON.parse(document.getElementById("peerOfferTxtArea"));
	if (!remoteFullOffer) {
		signalError("set");
		console.log("box empty");
		return ;
	}
	
	console.log("box not empty");

	saveRemoteOffer();

	saveRemoteCandidates();
}

document.getElementById("saveButton").addEventListener('click', async function applyRemoteOffer(event) {
	//event.preventDefault();

	//await peerConnexion.setRemoteDescription(JSON.parse(remoteOffer.value));
	//const answer = await peerConnexion.createAnswer();
	//await peerConnexion.setLocalDescription(answer);
	//console.log("Answer: ", answer);
	//const giveAnswer = document.getElementById("answerTextArea");
	//giveAnswer.value = JSON.stringify(answer);
	//displayDiv("submitAnswer", "block");
});

// ============================ local generate ============================= //

let offer = null;
let candidates = [];
let fullOffer = { offer, candidates };

function copyTxtButton() {
	var copyText = document.getElementById("fullOfferTxtArea");
	copyText.select();
	copyText.setSelectionRange(0, 99999)
	document.execCommand("copy");
	document.getElementById("copyOffer").innerHTML = "COPIÉ !"
}

function switchPage() {
	document.getElementById('page1').style.display = 'none';
	document.getElementById('page2').style.display = 'block';
}

function displayDiv(name, status) {
	document.getElementById(name).style.display = status;
}

async function displayTextToDiv(name, text) {
	document.getElementById(name).value = JSON.stringify(text);
}

async function displayFullOfferToClient() {
	displayDiv("fullOfferTxtArea", "block");
	await displayTextToDiv("fullOfferTxtArea", fullOffer);
}

async function generateOffer() {
	fullOffer.offer = await peerConnexion.createOffer();
	console.log("Offer created");
};

async function saveLocalOffer() {
	await peerConnexion.setLocalDescription(offer);
	console.log("local description set");
}

function createObj(server) {
	console.log("create main obj called!");
	
	peerConnexion = new RTCPeerConnection({ iceServers: [{ urls: server }] });
}

function createChannel() {
	peerConnexion.createDataChannel("OGchan");
}

function collectCandidates() {
	peerConnexion.onicecandidate = (event) => {
		if (event.candidate) {
			console.log("new candidate: ", event.candidate.candidate);
			fullOffer.candidates.push(event.candidate);
		} else {
			displayFullOfferToClient();
			console.log("all candidates found");
		}
	};
}

async function initPeerConnection(server) {

	createObj(server);

	createChannel();

	await generateOffer();
	await saveLocalOffer();

	collectCandidates();

	console.log("init done, waiting for candidates");
}

// Automatic STUN -- init all stuff 
document.getElementById('autoIP').addEventListener('click', async function autoSTUN(event) {
	event.preventDefault();
	switchPage();
	//await initPeerConnection("stun:stun.services.mozilla.com:3478");
	await initPeerConnection("stun:stun.l.google.com:19302");
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