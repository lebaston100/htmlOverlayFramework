var ip = "127.0.0.1"; //Modify this to point to the ip address where your server is running on
var port = "8000";

///////////////////////////////////////////////////////////////////////////


window.addEventListener("load", init, false);
var socketisOpen = 0;
var intervalID = 0;
var closedByUser = 0;

function getInput(id) {
	return document.getElementById(id).value;
}

function sendCommand(p1, p2) {
	if (socketisOpen) {
		var jsonOBJ = {"message-id": p1, "data": p2};
		websocket.send(JSON.stringify(jsonOBJ));
	} else {
		writeToScreen('Fail: Not connected\n');
	}
}

function init() {
	document.getElementById("ip").value = ip;
	document.getElementById("port").value = port;
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
	writeToScreen("\nInfo: Connection opened");
	document.getElementById("btt_connect").disabled = true;
	document.getElementById("btt_disconnect").disabled = false;
	clearInterval(intervalID);
	intervalID = 0;
}

function onClose(evt) {
	socketisOpen = 0;
	if (!intervalID && !closedByUser) {
		intervalID = setInterval(doConnect, 5000);
	} else if (closedByUser) {
		closedByUser = 0;
	}
	writeToScreen("\nInfo: Connection closed");
	document.getElementById("btt_connect").disabled = false;
	document.getElementById("btt_disconnect").disabled = true;
}

function onMessage(evt) {
	var jsonOBJ = JSON.parse(evt.data);
	writeToScreen('\n' + evt.data);
}

function onError(evt) {
	writeToScreen('\nConnection failed, is the Server running?');
	socketisOpen = 0;
	document.getElementById("btt_connect").disabled = false;
	document.getElementById("btt_disconnect").disabled = true;
	if (!intervalID) {
		intervalID = setInterval(doConnect, 5000);
	}
}

function writeToScreen(message) {
	document.getElementById("outputtext").value += message;
	document.getElementById("outputtext").scrollTop = document
			.getElementById("outputtext").scrollHeight;

}

function doDisconnect() {
	socketisOpen = 0;
	closedByUser = 1;
	websocket.close();
}