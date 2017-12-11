var express = require('express');
var router = express.Router();
/*
var userCtrl = require('../controllers/user');
var statisticCtrl = require('../controllers/statistic');*/
var gameCtrl = require('../controllers/game');

var passport = require('passport');	//passport.authenticate

router.post("/createGame", passport.authenticate('jwt', {session: false}), gameCtrl.createGame);
router.get("/getGame/:userName", passport.authenticate('jwt', {session: false}), gameCtrl.getGame);
router.delete("/deleteActiveGame/:gameId", passport.authenticate('jwt', {session: false}), gameCtrl.deleteActiveGame);




module.exports = router;