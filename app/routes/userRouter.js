var express = require('express');
var router = express.Router();

var userCtrl = require('../controllers/user');

var passport = require('passport');	//passport.authenticate


router.get("/user",  passport.authenticate('jwt', { session: false}), userCtrl.listUsers);
router.post("/register",  userCtrl.registerUser);
router.post("/login", userCtrl.loginUser);
router.get("/home", passport.authenticate('jwt', { session: false, failureRedirect: '/login'}), function(req, res) {
	console.log(res);
});
router.get("/currentUser", passport.authenticate('jwt', {session: false}), userCtrl.getCurrentUser);
router.put("/modifyUser/:userId", passport.authenticate('jwt', {session: false}), userCtrl.modifyUser);
router.put("/saveChallengers/:userId", passport.authenticate('jwt', {session: false}), userCtrl.saveChallengers);
router.get("/updateCurrentUser/:userId", passport.authenticate('jwt', {session: false}), userCtrl.updateCurrentUser);
router.get("/getUserByUserName/:userName", passport.authenticate('jwt', {session: false}), userCtrl.getUserByUserName);



module.exports = router;