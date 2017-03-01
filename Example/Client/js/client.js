var ip = "127.0.0.1";
var port = "8000";

///////////////////////////////////////////////////////////////////////////

window.addEventListener("load", init, false);
var socketisOpen = 0;

function init() {
	doConnect();
	var element = document.getElementById('retrigger');
	element.addEventListener('webkitAnimationEnd', function() {
		var element = document.getElementById('retrigger');
		element.style.visibility = 'hidden';
		element.style.removeProperty("-webkit-animation-name");
	}, false);
}

function sendCommand(p1, p2) {
	if (socketisOpen) {
		p1 = p1.substring(0, 4);
		websocket.send(p1 + ":" + p2);
	} else {
		console.log('Fail: Not connected\n');
	}
}

function changeElement(id, newContent) {
	document.getElementById(id).innerHTML = newContent
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
	doConnect();
}

function onOpen(evt) {
	socketisOpen = 1;
}

function onMessage(evt) {
	var cmdText = evt.data.substring(0, 4);
	var valueText = evt.data.substring(5);
	event(cmdText, valueText);
}

function onError(evt) {
	socketisOpen = 0;
	websocket.close();
	doConnect();
	console.log('Fail: ' + evt.data);
}

function doDisconnect() {
	socketisOpen = 0;
	websocket.close();
}