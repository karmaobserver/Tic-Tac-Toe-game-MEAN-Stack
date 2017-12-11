var mongoose = require('mongoose');

var User = mongoose.model('User');
var Statistic = mongoose.model('Statistic');
var jwt = require('jwt-simple');
var config = require('../../config/db');


module.exports.saveChallengers = function(req, res) {
	var userId = req.params.userId;
	console.log('    MODIFY USER BECK');
	User.findOne({
		_id: userId
	}, function (err, user) {
		if (err) throw err;
		console.log(user);
		if (!user) {
      		res.status(404).send({success: false, msg: 'User not found, not possible!'});
		} else {

			user.challengers = req.body.challengers;
			user.challenged = req.body.challenged;

			user.save(function(err, user) {
				if (err) throw err;
				res.status(200).json(user);
			});
	}

	});
};

module.exports.getUserByUserName = function(req, res) {
	var userName = req.params.userName;
	console.log('getUserByUserName BACK END');
	User.findOne({
		userName: userName
	}, function (err, user) {
		if (err) throw err;
		console.log(user);
		res.json(user);
	});

};

module.exports.updateCurrentUser = function(req, res) {
	var userId = req.params.userId;
	console.log('    Update USER BECK');
	User.findOne({
		_id: userId
	}, function (err, user) {
		if (err) throw err;
		console.log(user);
		
			res.json(user);
		
	});
	

};

module.exports.listUsers = function(req, res) {

	User.find(function(err, users) {
			console.log("Uhodzi rest ****Users***");
			//console.log(users);
			res.json(users);
		});

};

module.exports.modifyUser = function (req, res) {
	var userId = req.params.userId;
	console.log('    MODIFY USER BECK');
	console.log(userId);
	User.findOne({
		_id: userId
	}, function (err, user) {
		if (err) throw err;
		console.log(user);
		// var newUser = req.body;
		//if (err) next (err)   za middlwere za greske
		user.firstName = req.body.firstName;
		user.lastName = req.body.lastName;
		user.email = req.body.email;

		user.save(function(err, user) {
			if (err) throw err;
			res.json(user);
		});
	});
};

module.exports.registerUser = function (req, res) {
	if (!req.body.userName || !req.body.password) {
		res.status(400).send({success: false, msg: 'Please enter an username and password to register'});
	} else {
		var newUser = new User({
			userName: req.body.userName,
			password: req.body.password,
			email: req.body.email,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			challengers: [],
			challenged: []
		});	
		newUser.save(function(err) {
			if (err) {			
				return res.status(400).send({success: false, msg: 'That username already exists!'});
			}
			//inicijalizacija statistike za kreiranog korisnika
			var newStatistic = new Statistic({
				wins: 0,
				loses: 0,
				winRatio: 0,
				games: 0,
				user: newUser
			});
			newStatistic.save(function(err) {
				console.log('usao u stats');
				if (err) {			
					return res.status(400).send({success: false, msg: 'Greska u sacuvanju inicijalizovane statistike! Ne sme doci do koristina'});
				}

				var token = jwt.encode(newUser, config.secret);
				res.status(201).json({success: true, token: 'JWT ' + token, msg: 'Successfully created new user!'});
			});
			
		});
	}
};

//req je niz "credentials"(elementi su userName i password) 
module.exports.loginUser = function(req, res) {

	//var socketio = req.app.get('socketio');

	User.findOne({
		userName: req.body.userName
	}, function(err, user) {
		//bad for production
		
		if (err) throw err;
		
		if (!user) {
			res.status(400).send({success: false, msg: 'Login failed. User not found.'});
		} else {
			//proveravam sifru
			user.comparePassword(req.body.password, function(err, isMatch) {
				console.log('SIFRA JE: ' + req.body.password);
				if (isMatch && !err) {
					//ako je nadjen user i ako se poklapa sa passwordom
					//promeni da ne bude ceo user!!!!!
				
					var users = [];
					var token = jwt.encode(user, config.secret);
					
					
					
					//socketio.sockets.connect();
					//socketio.sockets.emit('addUser2', {userName : user.userName});
					//socketio.sockets.emit('addUser2', {userName : 'Pavel'});
					//socketio.emit('addUser2', {userName : 'Pavel'});
					res.status(200).json({success: true, token: 'JWT ' + token, msg: 'dobijen token'});
				} else {
					res.status(400).send({success: false, msg: 'Login failed. Passwords did not match.'});
				}
			});
		}
	});
};

//funkcija za izdvajanje tokena iz hedera
var getToken = function(headers) {
			//obrati paznju
			if (headers && headers.authorization) {
				var parted = headers.authorization.split(' ');
				if (parted.length === 2) {
					return parted[1];
				} else {
					return null;
				}
			} else {
				return null;
			}
};

module.exports.getCurrentUser = function(req, res) {
	var token = getToken(req.headers);
	//console.log('TOKEN SA BEKENDA: ' + token);
	if (token) {
		//dekodiram token, dobijem payload i posaljem (ako celog user-a enkodujem)
    	var decoded = jwt.decode(token, config.secret);
    	console.log('DECODED ' + decoded);
    	res.status(200).json({currentUser: decoded}); 
	} else {
		res.status(403).json({success: false, msg: 'No token provided'});
	}
	//var payload = jwtHelper.decodeToken(token);
	
};
