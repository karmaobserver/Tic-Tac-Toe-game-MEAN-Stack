var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema = new Schema( {	
	player1: String,
	player2: String,
	whoStarts: String,
	xMoves: Array,
	oMoves: Array,
	movesDone: Number
});

module.exports = mongoose.model('Game', GameSchema);