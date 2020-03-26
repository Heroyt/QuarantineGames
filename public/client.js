const socket = io();

let data = undefined;
if (window.localStorage.userId) {
	data = {
		currentSession: window.localStorage.userSocket,
		name: window.localStorage.userName,
		id: parseInt(window.localStorage.userId)
	}
}

socket.emit('login', data);

socket.on('updateUserData', userData => {
	window.localStorage.userId = userData.id;
	window.localStorage.userName = userData.name;
	window.localStorage.userSocket = userData.currentSession;

	if (user.name === "" || !window.localStorage.userName) {

	}
});

/**
 * Creates a new html modal with a given name
 */
function createModal(modalName) {

}
