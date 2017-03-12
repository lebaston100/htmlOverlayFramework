var ip = "127.0.0.1";
var port = "8000";

////////////////////////////Magic Line///////////////////////////////////////////////

window.addEventListener("load", init, false);
var socketisOpen = 0;

function sendCommand(p1, p2) {
	if (socketisOpen) {
		p1 = p1.substring(0, 4);
		websocket.send(p1 + ":" + p2);
	} else {
		console.log('\nFail: Not connected');
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

function onOpen(evt) {
	socketisOpen = 1;
	console.log("\nconnected");
}

function onClose(evt) {
	socketisOpen = 0;
	console.log("\ndisconnected");
}

function onMessage(evt) {
	console.log(evt.data);
	event(cmdText, valueText);
}

function onError(evt) {
	socketisOpen = 0;
	websocket.close();
	doConnect();
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