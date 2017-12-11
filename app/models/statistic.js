var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StatisticSchema = new Schema( {	
	wins: Number,
	loses: Number,
	winRatio: Number,
	games: Number,
	user: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

StatisticSchema.methods.calculateWinRatio = function(wins, games) {
	winRatio = ((wins)/(games))*100;
	return winRatio;
};

StatisticSchema.methods.calculateGames = function(wins, loses) {
	return wins+loses;
};

module.exports = mongoose.model('Statistic', StatisticSchema);