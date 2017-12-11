var mongoose = require('mongoose');

var User = mongoose.model('User');

 //za Chat
var users = [];
var userChallenge = [];
var challengedByUsers = [];
var gameId = 0;
console.log('Ucitan FAJL');
 module.exports = function (io, socket) {

   //var socketio = req.app.get('socketio');

 var userName = '';
 var userNameChallenge = '';
  console.log('A User has Connected');
  console.log(users);

  socket.on('disconnect', function() {
    console.log(userName + ' has Disconnected');
    console.log(users);
    users.splice(users.indexOf(userName), 1);
    //userChallenge.splice(userChallenge.indexOf(userNameChallenge), 1);
    console.log(users);
    io.emit('removeUser', {userName: userName});
   // io.emit('removeUser3', {userName: userName});
        //socket.broadcast.emit('removeUser', {userName: userName});
  });

  //INDEX    CHAT
  socket.on('addUser2', function(data) { 
    console.log('SLUSA addUser2');
    
    //socket.broadcast.emit('addUser', {userName: data.userName});
      userName = data.userName;
      users.push(userName);
      io.emit('addUser2', {userName: data.userName});
      io.emit('addUser3', {userName: data.userName}); //za challangePlayer
      //socket.broadcast.emit('addUser2', {userName: data.userName});
    
  });

  socket.on('requestUsers2', function() {
    console.log("REQUEST POzvan 2!!!");
    socket.emit('users2', {users: users});
  
  });
  //CHALLENGE PLAYER DEO SAMO
  socket.on('requestUsers3', function() {
    console.log("REQUEST POzvan 3!!!");
    socket.emit('users3', {users: users});
    
  });

  socket.on('message2', function(data) {
    io.emit('message2', {userName: userName, message: data.message});
    //socket.broadcast.emit('message', {userName: userName, message: data.message});
  });

  //CHALLENGE PLAYER (fali jos ADD)
  socket.on('challenge', function(data) {
    console.log('CHallenge SLUSA SERVER');
    console.log(data.userChallenge);
    console.log(data.challengedUser);
    io.emit('challenged', {userChallenge: data.userChallenge, challengedUser: data.challengedUser} );
  });

  socket.on('addToChallengeList', function(data) {
    console.log('usao u ADD BACKEND');
    User.findOne({
       userName: data.challengedUser
    }, function (err, user) {
    if (err) throw err;
    console.log(user);
    
    user.challengers.push(data.userChallenge);
    console.log('Challengers: ');
    console.log(user.challengers);
    user.save(function(err, user) {
      if (err) throw err;
       console.log(user);
    socket.emit('currentUser', {user: user});
    });
      });

    

    /*//ovo radim, posto se mi pojave vise zahteva, ne znam zasto
    if (challengedByUsers.indexOf(data.challengedBy) === -1) {
    //challengedByUsers.push(data.challengedBy);
    io.emit('addChallenger', {challengedBy: data.challengedBy});
    console.log('Ulazim u petlju za dodavanje u niz');
    //console.log(challengedByUsers);
  }*/
  });

  //ACCEPT CHALLENGE
  socket.on('challegeAccepted', function(data) {
    console.log('izazvao: ');
    console.log(data.userChallenge);
    console.log('prihvatio: ');
    console.log(data.acceptedUser);
    io.emit('stepIntoGame', {userChallenge: data.userChallenge, acceptedUser: data.acceptedUser });
  });

  //DECLINE CHALLENGE
  socket.on('updateLocalStorage', function(data) {
    io.emit('updateLocalStorage', {user: data.user});
  });

  socket.on('refreshLocalStorage', function() {
    socket.emit('refreshLocalStorage', {});
  });

 /* socket.on('setupPlayers', function(data) {
    gameId++;
    io.emit('tableAssign', {userChallenge: data.userChallenge, acceptedUser: data.acceptedUser, gameId: gameId});
  });*/

  //GAME
  socket.on('playerMoved', function(data) {
    //io.sockets.in('pera').emit('new_msg', {msg: 'hello'});
    io.sockets.in(data.userNameChatRoom).emit('nextTurn', {cellId: data.cellId, playerMoved: data.playerMoved});
  });

  socket.on('rematch', function(data) {
    io.sockets.in(data.userNameChatRoom).emit('rematchAccepted', {user: data.user});
  });

  socket.on('playerLeftTable', function(data) {
     io.sockets.in(data.userNameChatRoom).emit('playerLeftTable', {playerLeft: data.playerLeft});

  });

  socket.on('join', function (data) {
    console.log('Joinova-o se room: ');
    console.log(data.userName);
    socket.join(data.userName); // We are using room of socket io
   // io.sockets.in(data.userName).emit('new_msg', {msg: 'hello'});

  });



};

/*k-posaljem s userName; s-postavim userName, dodam userName u Niz, posaljem svima userName; k-dodaje usera u listu usera i poruku za join;
 k-trazi usere; s-vraca niz usera; k-scope usere;
 disconnect-k-logout; s-izbaci iz niza usera i posalje svima userName tog  usera; k-izbaci iz scope niza usera i poruku za left*/