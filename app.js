
var express = require('express');
var app = express();
var opener = require('opener');
var exit = require('exit');
var youtubeAuth = require('./auth.js');
var progressBar = require('progress');
var bar;
var user1Tokens,user2Tokens;

/** TODO fix the bad design; design can be improved with frontend buttons*/
var authURL = youtubeAuth.getAuthURL();

var persistentCounter=0;



/** Start getting Tokens for Users*/
opener(authURL);


//Callback for Youtube OAuth2 Flow
app.get('/oauth2/callback/',function(req,res){

    var auth_code=req.query.code;
    if(persistentCounter === 0){

        youtubeAuth.getTokens(auth_code,function(data){
            user1Tokens=data;
            persistentCounter+=1;
            res.redirect('https://accounts.google.com/Logout?hl=en');
            //Open second time for User2
            opener(authURL);
        })

    }
    else if(persistentCounter === 1){
        youtubeAuth.getTokens(auth_code,function(data){
            user2Tokens=data;
            persistentCounter+=1;
            res.redirect('https://accounts.google.com/Logout?hl=en');
            startMigration();
        });
    }

});

function startMigration(){

    var authObj = youtubeAuth.getAuthObject();

    authObj.setCredentials(user1Tokens);

    var resources ={part: "snippet", mine: "true",maxResults: "50"};

    youtubeAuth.getSubscriptions(resources,function(err,data){
        processSubscriptionData(data);
    });

}

function processSubscriptionData(subList) {

    var noOfSubscriptions = subList.pageInfo.totalResults;

    console.log(noOfSubscriptions + " Subscriptions found");

    //TODO unsure why Youtube API only returns n-3 subscriptions always.
    bar = new progressBar('Adding Subscriptions [:bar] :percent ', { total: noOfSubscriptions-3, width:20 ,callback:end });


    if (subList.hasOwnProperty('nextPageToken')){

        process(null,subList);
    }
    else{
        /*only one page*/
        putSubscription(subList);
    }

}

function end(){
    console.log("Complete. Bye Bye");
    exit(1);
}

function process(err,data){

    putSubscription(data);

    var authObj = youtubeAuth.getAuthObject();
    authObj.setCredentials(user1Tokens);

    if (err)
        console.log(err);

    var resources = {part: "snippet", mine: "true", maxResults: "50"};

    if (data.hasOwnProperty('nextPageToken')){
        resources.pageToken=data.nextPageToken;
        youtubeAuth.getSubscriptions(resources,process);
    }


}


function putSubscription(subList){


    var authObj2 = youtubeAuth.getAuthObject2();
    authObj2.setCredentials(user2Tokens);

    var length=subList.items.length;


    // Change to subList.items.length
    for (var i = 0; i <length; i++) {

        var resources = {
            snippet: {
                resourceId: {
                    kind: subList.items[i].snippet.resourceId.kind,
                    channelId: subList.items[i].snippet.resourceId.channelId
                }
            }
        };

        youtubeAuth.setSubscription(resources, function (err, data) {

            if (err) {
                console.log(err.errors[0].message);

            }
            bar.tick(1);
        });


    }

}


app.listen(8080,'127.0.0.1');
