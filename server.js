const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Classes
const User = require('./server_modules/User');

// Currently playing users
const Users = new Map();
let id = 0;

// Handeling http requests
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

// Handeling static data (css, js)
app.use(express.static('public'));

// Socket
io.on('connection', socket => {
	console.log('a user connected');

	// Connect user on page load
	socket.on('login', userData => {
		let newPlayer = false;
		if (!userData || !Users.has(userData.id)) { // New user
			newPlayer = true;
			userData = {
				currentSession: socket.id,
				name: "",
				id
			};
			id++;
			const user = new User(userData);
			Users.set(userData.id, user);
			console.log('New player logs in', user.id);
		}
		else { // Existing user
			userData.currentSession = socket.id;
			const user = Users.get(userData.id);
			console.log('Existing player logs in', user.id);
		}

		socket.emit('updateUserData', userData);

	});

	// Log player out
	socket.on('logout', id => {
		users.delete(id);
		console.log(`User (${id}) logged out`);
	});

	// Update player
	socket.on('updateUserData', (id, key, value) => {
		const user = Users.get(id);
		user[key] = value;
	});

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

// Server listening on port 3000
http.listen(3000, () => {
	console.log('listening on *:3000');
});
