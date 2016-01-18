var credentials = require('./credentials.json')

var CLIENT_ID= credentials.client_id;
var CLIENT_SECRET=credentials.client_secret;
var REDIRECT_URL=credentials.redirect_url;

var Youtube = require("youtube-api");

var scopes = [
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl',
    'https://www.googleapis.com/auth/youtubepartner',
];

youtubeAuth = function(){

    this.authObj = Youtube.authenticate({
        type: "oauth"
        , client_id: CLIENT_ID
        , client_secret: CLIENT_SECRET
        , redirect_url: REDIRECT_URL
    });

    this.authURL;


    this.getAuthObject = function(){

        return this.authObj;
    }


    this.getAuthURL = function(){

        this.authURL = this.authObj.generateAuthUrl({
            access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
            scope: scopes // If you only need one scope you can pass it as string
        });

        return this.authURL;
    }

    this.getTokens = function(auth_code,cb){
        this.authObj.getToken(auth_code,function(err,tokens){
            cb(tokens);
        });

    }


    this.getSubscriptions = function(resources,callback) {

        Youtube.subscriptions.list(resources,function (err, data) {
            callback(err,data);

        });

    }


    this.setSubscription = function(resources,callback){

        Youtube.subscriptions.insert({
            part : "snippet",
            resource : resources
        },function(err,data){
            callback(err,data);
        });


    }

};


module.exports = exports = new youtubeAuth();
