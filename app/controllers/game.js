var mongoose = require('mongoose');
var Game = mongoose.model('Game');



module.exports.createGame = function(req, res) {
	
	var player1 = req.body.user1;
	var player2 = req.body.user2;

	var players = [];
	players.push(player1);
	players.push(player2);
	var randomIndex = Math.floor(Math.random() * players.length);
	var randomPlayer = players[randomIndex]; 

	var newGame = new Game({
			player1: player1,
			player2: player2,
			whoStarts: randomPlayer,
			xMoves: [],
			oMoves: [],
			movesDone: 0
			
		});


		newGame.save(function(err) {
			if (err) {			
				return res.status(400).send({success: false, msg: 'Game did not SAVED'});
			}
		});

		res.status(201).json({success: true, msg: 'Successfully created new Game!'});
	

};

module.exports.getGame = function(req, res) {
	console.log('usao u backend getGame');
	var userName = req.params.userName;
	
	console.log(userName);

	Game.findOne({
		$or:[{player1: userName}, {player2: userName}]
    	
    }, function(err, game) {
    	if (err) throw err;
    
    	if (!game) {
      		res.status(404).send({success: false, msg: 'Game not found, not possible!'});
		} else {
			res.status(201).json(game);
	}
	});


};

module.exports.deleteActiveGame = function(req, res) {
	var gameId = req.params.gameId;
	console.log('usao u backend delete', gameId);
	/*Game.findOne({
		_id : gameId
	}, function(err, game) {
		if (err) throw err;

		res.status(200);
	});*/
	Game.findOneAndRemove({'_id' : gameId}, function (err, game){
		if (err) throw err;
		res.status(200).json({success: true,  msg: 'Successfully removed game!'});
	});

};