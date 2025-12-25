//
// 24/12/25
//

// ============================= Utils ============================= //
function copyTxtButton(textAreaName, buttonName) {
	var copyText = document.getElementById(textAreaName);
	copyText.select();
	copyText.setSelectionRange(0, 99999)
	document.execCommand("copy");
	document.getElementById(buttonName).innerHTML = "COPIÉ !"
}

function switchPage(actualPage, newPage) {
	hideDiv(actualPage);
	displayDiv(newPage);
}

function displayDiv(name) {
	document.getElementById(name).style.display = 'block';
}

function hideDiv(name) {
	document.getElementById(name).style.display = 'none';
}

async function displayTextToDiv(name, text) {
	document.getElementById(name).value = JSON.stringify(text);
}

async function createPeerConnObj(server) {
	console.log("peer connection created");
	return new RTCPeerConnection({ iceServers: [{ urls: server }] });
}

async function generateOffer(peerConnexion) {
	console.info("offer created");
	return (await peerConnexion.createOffer());
};

async function savePersonalOffer(peerConnexion, offer) {
	await peerConnexion.setLocalDescription(offer);
	console.log("local description set");
};

async function saveRemoteCandidates(peerConnexion, candidates) {
	for (let i = 0; i < candidates.length; i++) { 
		await peerConnexion.addIceCandidate(candidates[i]);
		console.info("remote candidate saved");
	}
}

async function saveRemoteOffer(peerConnexion, offer) {
	peerConnexion.setRemoteDescription(offer);
}
//================================================================== //
