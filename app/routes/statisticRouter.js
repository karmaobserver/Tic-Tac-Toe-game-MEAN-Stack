var express = require('express');
var router = express.Router();

var userCtrl = require('../controllers/user');
var statisticCtrl = require('../controllers/statistic');

var passport = require('passport');	//passport.authenticate

router.get("/userStatistic/:userId", passport.authenticate('jwt', {session: false}), statisticCtrl.getStatisticByUserId);
router.get("/statistic", passport.authenticate('jwt', {session: false}), statisticCtrl.getStatistic);
router.put("/saveScore", passport.authenticate('jwt', {session: false}), statisticCtrl.saveScore);



module.exports = router;