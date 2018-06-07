var ip = "127.0.0.1"; //Modify this to point to the ip adress where your server is running on
var port = "8000";

////////////////////////////Magic Line///////////////////////////////////////////////

window.addEventListener("load", init, false);
var socketisOpen = 0;
var intervalID = 0;

function sendCommand(p1, p2) {
	if (socketisOpen) {
		var jsonOBJ = {"message-id": p1, "data": p2};
		websocket.send(JSON.stringify(jsonOBJ));
	} else {
		console.log('Fail: Not connected\n');
	}
}

function init() {
	doConnect();
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
	console.log("Connection closed\n");
}

function onOpen(evt) {
	socketisOpen = 1;
	clearInterval(intervalID);
	intervalID = 0;
	console.log("Connection opened\n");
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

function changeElementContent(id, newContent) {
	document.getElementById(id).innerHTML = newContent;
}

function getInput(id) {
	return document.getElementById(id).value;
}