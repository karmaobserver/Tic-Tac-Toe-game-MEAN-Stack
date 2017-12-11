
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema( {	
	userName: {
		type: String,
		unique: true
	},
	password: String,
	email: String,
	firstName: String,
	lastName: String,
	challengers: Array,
	challenged: Array
});

UserSchema.pre('save', function(next) {
	var user = this;
	if (this.isModified('password') || this.isNew) {
		bcrypt.genSalt(5, function(err, salt) {
			if (err) {
				return next(err);
			}
			bcrypt.hash(user.password, salt, null, function(err, hash) {
				if (err) {
					return next(err);
				}
				user.password = hash;
				next();
			});
		});
	} else {
		return next();
	}
});

UserSchema.methods.comparePassword = function(password, cb) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
		if (err) {
			return cb(err);
		}
		cb(null,isMatch);
	});
};

//ako neko require
module.exports = mongoose.model('User', UserSchema);
