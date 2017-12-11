var express = require('express');
var app = express();
var morgan = require('morgan');	//za terminal vise informacije za request i putanju
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/db');	//uzimam konfiguraciju (ako je neka druga ekstenzija,treba je navesti)
var jwt = require('jwt-simple');
var passport = require('passport');
var fs = require('fs');	//file system, koristio sam za ucitavanje modela
var http = require('http').Server(app); //za io
//var server = require('http').Server(app);
var io = require('socket.io')(http);
/*var flash = require('connect-flash'); //za flash
var cookieParser = require('cookie-parser');
var session = require('express-session');
*/
app.set('socketio', io); 
app.set('http', http);
//var socket = require('./app/routes/socket.js');

//Load models
//require('./app/models/WinLoseModel');
//require('./app/models/UserModel');
//bolji nacin, da ne bi morao rucno za svaki model ubacivati, i promena imena fajla nece uticati https://nodejs.org/api/fs.html#fs_file_system
var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(function (file) {
	console.log(models_path+'/'+file);
  require(models_path+'/'+file);
});

//Load routes files
//var routes = require('./app/routes/index');
var userRouter = require('./app/routes/userRouter');
var statisticRouter = require('./app/routes/statisticRouter');
var gameRouter = require('./app/routes/gameRouter');



//initialze passport for use
app.use(passport.initialize());

//connect to db
mongoose.connect(config.database);

//bring in passport strategy we just defined (passport prenosimo)
require('./config/passport')(passport);

//var WinLoseModel = mongoose.model("WinLoseModel");
//var stat1 = new WinLoseModel({name: "kluk", wins: 4, loses: 2, winRatio: 0})
//var stat1 = new WinLoseModel({name: "kluk", wins: 4, loses: 2, winRatio: 0});
//var stat2 = new WinLoseModel({name: "stat2", wins: 7, loses: 1, winRatio: 0});
//stat1.save();
//stat2.save();
/*var User = mongoose.model('User');
var user1 = new User({username: "Peterke", password: "petar", email: "petar@gmail.com", firstName: "Petar", lastName: "Petrovic"});
var user2 = new User({username: "Mirtit", password: "miric", email: "miric@gmail.com", firstName: "Mitar", lastName: "Mitrovic"});
user1.save();
user2.save();*/
/*var Statistic = mongoose.model('Statistic');
Statistic.findByIdAndUpdate('575d9806c4cfdaf803c4a377', {$set:{wins:2}}, function (err, entry) {       
});
Statistic.findByIdAndUpdate('575d9cee7d5e3e5415b4e76f', {$set:{wins:3}}, function (err, entry) {
});*/
    


app.use(express.static(__dirname + '/public'));
//app.use(express.static(__dirname + '/public/views'));

/*app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('public/index.html', { root: __dirname });
});*/

app.use(bodyParser.json()); //for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

app.use(morgan('dev'));

/*app.use(cookieParser('keyboard cat'));  //za flash
app.use(session({
    
    cookie: { maxAge: 60000 },
    saveUninitialized: true,
    resave: true
}));

app.use(flash());*/
//Prvo zovem sa korenom ZBOG PRIORITETA
//config routes
//app.use('/', routes);

// Socket.io Communication
io.on('connection', function(socket) {
  //reconnection = true;
  console.log("Client(socket) connected to socket!");
   console.log( 'THE SOCKET: ' + socket.toString());
    
  
  require('./app/routes/socket.js')(io, socket);
});
/*var users = [];
io.on('connection', function(socket) {

  var userName = '';
  console.log('A User has Connected');
  console.log(users);

  socket.on('requestUsers', function() {
    socket.emit('users', {users: users});
  });

  socket.on('message', function(data) {
    io.emit('message', {userName: userName, message: data.message});
  });

  socket.on('addUser', function(data) {
    if (users.indexOf(data.userName) === -1) {
      io.emit('addUser', {userName: data.userName});
      userName = data.userName;
      users.push(userName);
    } else {
      socket.emit('existUserName', {message: 'User Alrady Exists'});
    }
  });

  socket.on('disconnect', function() {
    console.log(userName + ' has Disconnected');
    users.splice(users.indexOf(userName), 1);
    io.emit('removeUser', {userName: userName});
  });
});*/



app.use('/api/', userRouter);
app.use('/api/', statisticRouter);
app.use('/api/', gameRouter);
	//BITNO ked tu dodam /user   i u proba route /user vec hljeda /user/user!!
//app.use('/rest/', userRouter); tipa zadam tak i vec u route ljem /user







/*// Global Vars za flash
app.use(function (req, res, next) {
  console.log('DAL ULAZI');
  console.log(req.flash('success_msg'));
  app.locals.success_msg = 'asdasdasd';
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});*/


//Koristim za refreshovanje ili gadjanje konkretnog URL-a (mora biti na kraju rutiranja)
app.use(function(req, res) {
	console.log(__dirname + '/public/index.html');
    res.sendfile(__dirname + '/public/index.html');
});



/*//na kraju dodajemo middleware za obradu gresaka
app.use(function(err, req, res, next) {
  var message = err.message;
  var error = err.error || err;
  var status = err.status || 500;

  res.status(status).json({
    message: message,
    error: error
  });
});*/

/*// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});*/

/*app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});*/

/*app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});

  }
});*/

app.get('http').listen(3000);
console.log("Server running on port 3000...");
// http.listen(3000);
// console.log("Server running on port 3000...");

