var mongoose = require('mongoose');
var User = mongoose.model('User');
var Statistic = mongoose.model('Statistic');


module.exports.saveScore = function(req, res) {
	winner = req.body.winner;
	loser = req.body.loser;

	//Logika za winnera
	User.findOne({
		userName: winner
	}, function(err, user) {
		if (err) throw err;
		Statistic.findOne({
			user: user._id
		}, function(err, statisticUsera) {
			if (err) throw err;

			if(!statisticUsera) {
				res.status(404).send({success: false, msg: 'StatisticUera not found, not possible!'});
			} else {
				console.log('Statistica usera: ', statisticUsera);
				statisticUsera.wins++;
				statisticUsera.games = statisticUsera.calculateGames(statisticUsera.wins, statisticUsera.loses);
				statisticUsera.winRatio = statisticUsera.calculateWinRatio(statisticUsera.wins, statisticUsera.games);
				
				
				

				statisticUsera.save(function(err, statisticUsera) {
					if (err) throw err;
					//res.json(statisticUsera);
				});
			}

		});
		});
	//logika za losera
	User.findOne({
		userName: loser
	}, function(err, user) {
		if (err) throw err;
		Statistic.findOne({
			user: user._id
		}, function(err, statisticUsera) {
			if (err) throw err;

			if(!statisticUsera) {
				res.status(404).send({success: false, msg: 'StatisticUera not found, not possible!'});
			} else {
				console.log('Statistica usera: ', statisticUsera);
				statisticUsera.loses++;
				statisticUsera.games = statisticUsera.calculateGames(statisticUsera.wins, statisticUsera.loses);
				statisticUsera.winRatio = statisticUsera.calculateWinRatio(statisticUsera.wins, statisticUsera.games);
				
				
				

				statisticUsera.save(function(err, statisticUsera) {
					if (err) throw err;
					res.json(statisticUsera);
				});
			}

		});
		});


};


module.exports.getStatisticByUserId = function(req, res) {
	console.log(req.params.userId);
	var userId = req.params.userId;


	Statistic.findOne({
    user: userId
  }, function(err, statistic) {
    	if (err) throw err;
    
    	if (!statistic) {
      		res.status(404).send({success: false, msg: 'Statistic not found, not possible!'});
		} else {
			res.json(statistic);
	}
	});

};

module.exports.getStatistic = function(req, res) {

	Statistic.find(function(err, statistic) {
		if (err) throw err;
		//ako hocu celog usera, a drugo ako hocu samo userName
		//Statistic.populate(statistic, {path: 'user'}, function(err, statistic) {
		Statistic.populate(statistic, {path: 'user', select: 'userName'}, function(err, statistic) {
			if (err) throw err;

	
		res.status(200).json(statistic);
		});
		
	});
};