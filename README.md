# sailspassport
## a Sails application with Passport authentication

### General

Remember to define `hostname` in `config/local.js`, e.g.:

    hostname: 'http://hetty.local:1337'

### Facebook

* Create a Facebook app at <http://developers.facebook.com>
* Enable `email` permission in Facebook app
* Set `facebookAppId` and `facebookAppSecret` in `config/local.js`

### Twitter

* Create a Twitter app at <http://dev.twitter.com>
* Set a callback URL and check 'Allow this application to be used to Sign in with Twitter'
* Set `twitterConsumerKey` and `twitterConsumerSecret` in `config/local.js`
