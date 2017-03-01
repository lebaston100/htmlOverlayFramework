var ip = "127.0.0.1";
var port = "8000";

///////////////////////////////////////////////////////////////////////////


window.addEventListener("load", init, false);
var socketisOpen = 0;

function getInput(id) {
	return document.getElementById(id).value;
}

function sendCommand(p1, p2) {
	if (socketisOpen) {
		p1 = p1.substring(0, 4);
		websocket.send(p1 + ":" + p2);
	} else {
		writeToScreen('\nFail: Not connected');
	}
}

function init() {
	document.getElementById("url").value = "ws://localhost:8000/"
	document.getElementById("inputtext").value = "info:hi"
	document.getElementById("btt_disconnect").disabled = true;
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
	writeToScreen("\ninfo:connected");
	document.getElementById("btt_connect").disabled = true;
	document.getElementById("btt_disconnect").disabled = false;
}

function onClose(evt) {
	socketisOpen = 0;
	writeToScreen("\ninfo:disconnected");
	document.getElementById("btt_connect").disabled = false;
	document.getElementById("btt_disconnect").disabled = true;
}

function onMessage(evt) {
	writeToScreen('\n' + evt.data);
}

function onError(evt) {
	writeToScreen('\nerror: ' + evt.data);
	socketisOpen = 0;
	websocket.close();
	document.getElementById("btt_connect").disabled = false;
	document.getElementById("btt_disconnect").disabled = true;
	doConnect();
}

function writeToScreen(message) {
	document.getElementById("outputtext").value += message
	document.getElementById("outputtext").scrollTop = document
			.getElementById("outputtext").scrollHeight;

}

function doDisconnect() {
	socketisOpen = 0;
	websocket.close();
}