$(function(){

  //init variables
  var $window = $(window);
  var userName;
  var connected;
  var typing;
  var lastTypingTime;

  //initialize socket.io
  var socket = io();
  if(!userName){
    ShowUserNamePrompt();
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

  //handle adding of user to chat room
  function AddUser(){
    console.log('adding user');
  };



});
