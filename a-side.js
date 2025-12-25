// ============================ local generate ============================= //
const A_SIDE = "a_side";

let Aside_dataChannel = null;
let Aside_stunServer = null;
let Aside_offer = null;
let Aside_candidates = [];
let Aside_peerConnexion = null;
let Aside_BsideOffer = null;

function Aside_displayOffer(name) {
	switchPage('main_page', 'Aside_offer');

	const mainMessage = {Aside_offer, Aside_candidates, Aside_stunServer};

	displayTextToDiv(name, mainMessage);
	displayDiv(name)
}

function waitCandidatesAndDisplayOffer(peerConnexion) {
	peerConnexion.onicecandidate = (event) => {
		if (event.candidate) {
			console.log("aside: new candidate");
			Aside_candidates.push(event.candidate);
		} else {
			Aside_displayOffer("Aside_copyOfferTxtArea");
			console.log("aside: all candidates founds");
		}
	};
}

// aside save peer offer //
//document.getElementById("Aside_saveRemoteOfferBtn").addEventListener('click', async function(event) {
//	try {
//		const txt = document.getElementById("Aside_peerOfferTxtArea").value;
//		if (!txt) {
//			// display error
//			throw ("empty text area");
//		}
//		Aside_peerConnexion.setRemoteDescription(await JSON.parse(txt.offer));
//		console.log("aside: remote description saved");
//	} catch (error) {
//		console.error("aside: error on saving remote offer: ", error);
//	}
//});

function createChannel(peerConnexion) {
	return peerConnexion.createDataChannel("OGchan");
}

function retreiveServer(server) {
	Aside_stunServer = server;
	console.info("aside: STUN server: ", server);
}

async function Aside_connection(server) {

	retreiveServer(server);
	Aside_peerConnexion = await createPeerConnObj(server);

	Aside_dataChannel = createChannel(Aside_peerConnexion);

	Aside_offer = await generateOffer(Aside_peerConnexion);
	await savePersonalOffer(Aside_peerConnexion, Aside_offer);

	waitCandidatesAndDisplayOffer(Aside_peerConnexion);
}

// Automatic STUN -- init all stuff 
document.getElementById('autoIP').addEventListener('click', async function autoSTUN(event) {
	event.preventDefault();

	try {
		await Aside_connection("stun:stun.l.google.com:19302");
	} catch (error) {
		console.error("await error on A side: ", error);
		// return a screen errror 
	}
});

async function saveBsideAnswer() {
	Aside_BsideOffer = await JSON.parse(document.getElementById("Aside_peerOfferTxtArea").value);
	saveRemoteOffer(Aside_peerConnexion, Aside_BsideOffer.Bside_answer);
}

document.getElementById("Aside_saveRemoteOfferBtn").addEventListener('click', async function(event) {
	try {
		await saveBsideAnswer();
		await saveRemoteCandidates(Aside_peerConnexion, Aside_BsideOffer.Bside_candidates);
	} catch (error) {
		console.error("aside: error: ", error);
	}
});
