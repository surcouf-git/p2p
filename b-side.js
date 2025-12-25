let Bside_dataChannel = null;
let Bside_AsideOffer = null;
let Bside_answer = null;
let Bside_candidates = [];
let Bside_peerConnexion = null;
let Bside_stunServer = null;

function signalError(status) {
	let message = (status === "set" ? "CETTE BOX NE PEUT ETRE VIDE !" : "");
	document.getElementById("onError").innerHTML = message;
}

//function displayAnswer() {
//	displayDiv("Bside_offer");
//	displayTextToDiv("Bside_copyOfferTxtArea", Bside_answer);
//}

function Bside_displayOffer(name, divName) {
	const mainMessage = { Bside_answer, Bside_candidates };

	displayTextToDiv(name, mainMessage);
	displayDiv(divName)
}

function waitCandidatesAndDisplayAnswer(peerConnexion) {
	peerConnexion.onicecandidate = (event) => {
		if (event.candidate) {
			console.log("bside: new candidate");
			Bside_candidates.push(event.candidate);
		} else {
			Bside_displayOffer("Bside_copyOfferTxtArea", "Bside_offer");
			console.log("bside: all candidates founds");
		}
	};
}

async function Bside_saveASideOffer() {
	const txt = document.getElementById("Bside_remoteOfferTxtArea", "Bside_offer").value;
	if (!txt) {
		console.error("bside: remote offer box empty");
		throw ("remote offer box empty");
	}

	return await JSON.parse(txt);
}

async function initRTCPeerConnection() {
	console.info("bside: server received: ", Bside_AsideOffer.Aside_stunServer);
	return new RTCPeerConnection({ iceServers: [{ urls: Bside_AsideOffer.Aside_stunServer }] });
}

async function createAnswer(peerConnexion) {
	return (await peerConnexion.createAnswer());
}

function retreiveDataChannel(peerConnection) {
	peerConnection.ondatachannel = (event) => {
		Bside_dataChannel = event.channel;
		console.info("bside: channel found");
	};
}

async function Bside_connection() {

	Bside_AsideOffer = await Bside_saveASideOffer();

	Bside_peerConnexion = await initRTCPeerConnection();

	retreiveDataChannel(Bside_peerConnexion);

	await saveRemoteOffer(Bside_peerConnexion, Bside_AsideOffer.Aside_offer);

	await saveRemoteCandidates(Bside_peerConnexion, Bside_AsideOffer.Aside_candidates);

	Bside_answer = await createAnswer(Bside_peerConnexion);
	savePersonalOffer(Bside_peerConnexion, Bside_answer);

	waitCandidatesAndDisplayAnswer(Bside_peerConnexion);
}

function Bside_displayEntry() {
	hideDiv("main_page");
	displayDiv("Bside_entryDiv");
}

document.getElementById("Bside_AsideOfferBtn").addEventListener('click', async (event) => {
	try {
		Bside_connection();
	} catch (error) {
		console.error("bside: failed to init error: ", error);
	}
});

document.getElementById("Bside_entryBtn").addEventListener('click', async (event) => {
	Bside_displayEntry();
});