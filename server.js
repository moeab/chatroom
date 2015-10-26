var express = require('express');
var app = express();

app.use(express.static(__dirname + '/static'));


var server = app.listen(9898);

var io = require('socket.io').listen(server);

var users = [];

io.sockets.on('connection', function(socket){
	socket.on('new_user', function(data){
		users.push({name :  data.name , id : socket.id});
		io.emit('user_list', {users : users});
		io.emit('update_msg', { msg : '<p>' + data.name + ' has joined this chat</p>' });
	})

	socket.on('new_msg', function(data){
		msg = '<p>' + data.name + ': ' + data.msg + '</p>';
		io.emit('update_msg', { msg : msg});
	})
	socket.on('disconnect', function(){
		for(idx in users){
			if(users[idx].id == socket.id){
				io.emit('update_msg', { msg : '<p>' + users[idx].name + ' has left this chat</p>' })
				users.splice(idx, 1);
				io.emit('user_list', {users : users});
			}
		}
	})
})