var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
//var UserModel = require('../app/models/userModel');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var config = require('../config/db');

//trebao bi jos da napravim proveru sifre
module.exports = function(passport) {
	var opts = {};
	//check auth headers for jwt
	opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
	opts.secretOrKey = config.secret;
	//opts.passReqToCallback = true;
	//payload of our token
	//this will be called when user will access our protected root
	passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
		User.findOne({id: jwt_payload.id}, function(err, user) {
			if (err) {
				return done(err, false);
			}
			if (user) {
				done(null, user);
			} else {
				done(null, false);
			}
		});
	}));
};

