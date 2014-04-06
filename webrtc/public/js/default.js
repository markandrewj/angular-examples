
function init() {

	if (!PeerConnection) {
		alert('Your browser is not supported or you have to turn on flags. In chrome you go to chrome://flags and turn on Enable PeerConnection remember to restart chrome');
		return;
	}

	rtc.createStream({ 'video': { 'mandatory': {}, 'optional': [] }, audio: true }, function(stream) {
		document.getElementById('you').src = URL.createObjectURL(stream);
		document.getElementById('you').play();
	});

	var room = 'ABCDEFG';

	rtc.connect('ws://' + window.location.href.substring(window.location.protocol.length) + '?room=' + room, room);

	rtc.on('add remote stream', function(stream, socketId) {
		var clone = cloneVideo('you', socketId);
		document.getElementById(clone.id).setAttribute('class', '');
		rtc.attachStream(stream, clone.id);
	});

	rtc.on('disconnect stream', function(data) {
		removeVideo(data);
	});
}

function cloneVideo(domId, socketId) {
	var video = document.getElementById(domId);
	var clone = video.cloneNode(false);
	clone.id = 'remote' + socketId;
	document.getElementById('videos').appendChild(clone);
	videos.push(clone);
	return clone;
}

function removeVideo(socketId) {
	var video = document.getElementById('remote' + socketId);
	if(!video)
		return;
	videos.splice(videos.indexOf(video), 1);
	video.parentNode.removeChild(video);
}