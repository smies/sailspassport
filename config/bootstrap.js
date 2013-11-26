/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

var processProfile = function (profile, done) {
    User.findOneByEmail(profile.emails[0].value).done(function(err, user) {
      if (err) { 
        done(err, user);
      } else if (!user) { // not found, so create new user
      	User.create({
      	  givenName: profile.name.givenName,
      	  familyName: profile.name.familyName,
      	  email: profile.emails[0].value
      	}).done(function (err, user) {
      		done(err, user);
      	});
      } else {
        done(err, user); // otherwise, just return user
      }
    });
};

module.exports.bootstrap = function (cb) {
	
	var passport = require('passport')
	  , GoogleStrategy = require('passport-google').Strategy
	  , FacebookStrategy = require('passport-facebook').Strategy;
	
	// Passport session setup.
	// To support persistent login sessions, Passport needs to be able to
	// serialize users into and deserialize users out of the session. Typically,
	// this will be as simple as storing the user ID when serializing, and finding
	// the user by ID when deserializing.
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	
	passport.deserializeUser(function(id, done) {
		User.findOne(id).done(function (err, user) {
			done(err, user);
		});
	});
	
	
	// Use the LocalStrategy within Passport.
	// Strategies in passport require a `verify` function, which accept
	// credentials (in this case, a username and password), and invoke a callback
	// with a user object. In the real world, this would query a database;
	// however, in this example we are using a baked-in set of users.
	/*passport.use(new LocalStrategy(
		function(username, password, done) {
		
			// Find the user by username. If there is no user with the given
			// username, or the password is not correct, set the user to `false` to
			// indicate failure and set a flash message. Otherwise, return the
			// authenticated `user`.
			User.findByUsername(username, function(err, user) {
				if (err) { return done(err); }
				if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
				if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
				return done(null, user);
			});
		}
	));*/

    passport.use(new FacebookStrategy({
        clientID: sails.config.facebookAppId,
        clientSecret: sails.config.facebookAppSecret,
        callbackURL: sails.config.hostname + '/auth/facebook/return'
      },
      function(accessToken, refreshToken, profile, done) {
        processProfile(profile, done);
      }
    ));

    passport.use(new GoogleStrategy({
        returnURL: sails.config.hostname + '/auth/google/return',
        realm: sails.config.hostname + '/'
      },
      function(identifier, profile, done) {
        processProfile(profile, done);
      }
    ));
 
	// It's very important to trigger this callack method when you are finished
	// with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
	cb();
};
