var express = require('express');
var app = express();
//server
var http = require('http').Server(app);
//io
var io = require('socket.io')(http);

//serve public folder
app.use(express.static('public'));
app.use(express.static('node_modules/boostrap'));

//routing
app.get('/', function(req, res){
  //serve index.html
  res.sendFile(__dirname + '/public/index.html');
});

//socket io

var userNames = {};
var numUsers = 0;

io.on('connection', function(socket){
  console.log('a user connected');
  //set flag to register user
  var addedUser = false;
  //disconnect log console msg
  socket.on('disconnect', function(){
    console.log('user disconected');
    //remove user from the global list
    if(addedUser){
      delete userName[socket.userName];
      --numUsers;

      //broadcase leave message
      socket.broadcast.emit('user_left', {
        userName: socket.userName,
        numUsers: numUsers
      });
    }
  });
  //chat new message event
  socket.on('chat_message', function(msg){
    io.broadcast.emit('chat_message', {
      userName: socket.userName,
      message:msg
    });
  });

  //adding user to chat room
  socket.on('add_user', function(userName){
    //store username
    socket.userName = userName;
    //store on global arr of user names
    userNames[userName] = userName;
    ++numUsers;
    //registered user
    addedUser = true;
    socket.emit('login',{
      numUsers: numUsers
    });
    //broadcast new user joined chat room
    socket.broadcast.emit('user_joined', {
      userName : socket.userName,
      numUsers : numUsers
    });

    //user typing message broadcast



  });



});

//listening event on port 3000
http.listen(3000, function(){
  console.log('listening on port 3000');
});
