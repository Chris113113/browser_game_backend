$(function(){

  //init variables
  var $window = $(window);
  var userName;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $message = $('#input');

  //initialize socket.io
  var socket = io();
  //if the user is not logged in, prompt for userName
  //input and log user on server
  if(!userName){
    ShowUserNamePrompt();
  }else{
    //send message
    $('#button').click(function(){
      sendMessage();
    });
  }

  //handle login
  function ShowUserNamePrompt(){
    //show login button
    $('#button').html('Login');
    //show login placeholder label
    $('#input').attr('placeholder', 'Enter Username...');
    //user clicks on login button
    $('#button').click(function(){
      AddUser();
    });

  };

  //hides login prompt and display chat text message labels and button
  function HideUserNamePrompt(){
    $('#input').val('');
    //rename button to 'send'
    $('#button').html('Send');
    //show send message placeholder label
    $('#input').attr('placeholder', 'Send a message...');
  };

  //handle adding of user to server
  function AddUser(){
    console.log('adding user');
    userName = $('#input').val();
    //send server the username
    socket.emit('add_user', userName);
    //hides login content
    HideUserNamePrompt();
  };

  function sendMessage(){

    console.log($message.val());
  }


});
