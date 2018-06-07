var ip = "127.0.0.1";
var port = "8000";

///////////////////////////////////////////////////////////////////////////

window.addEventListener("load", init, false);
var socketisOpen = 0;
var intervalID = 0;

function init() {
	doConnect();
	initAnimation();
}

function sendCommand(p1, p2) {
	if (socketisOpen) {
		var jsonOBJ = {"message-id": p1, "data": p2};
		websocket.send(JSON.stringify(jsonOBJ));
	} else {
		console.log('Fail: Not connected\n');
	}
}

function setMediaVolume(id, volume) {
	document.getElementById(id).volume = volume/100;
}

function playMedia(id) {
	document.getElementById(id).play();
}

function pauseMedia(id) {
	document.getElementById(id).pause();
}

function showContent(id) {
	document.getElementById(id).style.visibility = "visible";
}

function hideContent(id) {
	document.getElementById(id).style.visibility = "hidden";
}

function changeElementContent(id, newContent) {
	document.getElementById(id).innerHTML = newContent;
}

function doConnect() {
	websocket = new WebSocket("ws://" + ip + ":" + port + "/");
	websocket.onopen = function(evt) {
		onOpen(evt)
	};
	websocket.onclose = function(evt) {
		onClose(evt)
	};
	websocket.onmessage = function(evt) {
		onMessage(evt)
	};
	websocket.onerror = function(evt) {
		onError(evt)
	};
}

function onClose(evt) {
	socketisOpen = 0;
	if (!intervalID) {
		intervalID = setInterval(doConnect, 5000);
	}
}

function onOpen(evt) {
	socketisOpen = 1;
	clearInterval(intervalID);
	intervalID = 0;
}

function onMessage(evt) {
	var jsonOBJ = JSON.parse(evt.data);
	console.log(jsonOBJ);
	event(jsonOBJ["message-id"], jsonOBJ["data"]);
}

function onError(evt) {
	socketisOpen = 0;
	if (!intervalID) {
		intervalID = setInterval(doConnect, 5000);
	}
}

function doDisconnect() {
	socketisOpen = 0;
	websocket.close();
}