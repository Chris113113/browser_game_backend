var express = require('express');
var redis = require('redis');
var client = redis.createClient();
var app = express();
//server
var http = require('http').Server(app);
//io
var io = require('socket.io')(http);

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//serve public folder
app.use(express.static('public'));
app.use(express.static('node_modules/boostrap'));

//routing
app.get('/', function(req, res){
  //serve index.html
  res.sendFile(__dirname + '/public/index.html');
});

// Store a new high score
app.post('/score', function(req, res){
  client.rpush(['scores', JSON.stringify(req.body)], function(err, reply) {
    if(err){
     console.log(err);
    }
    else {
      res.status(200).end();
    }
  });
});

app.get('/score', function(req, res) {
  client.lrange('scores', 0, -1, function(err, reply) {
    console.log(reply);
    res.status(200).json(reply).end();
  });
});

app.get('/flushDB', function(req, res) {
  client.flushall();
  client.keys('*', function(err, reply) {
    console.log(reply);
    res.status(200).json(reply);
  });
})

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
    console.log('Adding user: ' + socket.userName);
    //store on global arr of user names
    userNames[userName] = userName;
    ++numUsers;
    //registered user
    addedUser = true;
    //send the updated number of logged in users
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
