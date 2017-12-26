# YouMigrate
A NodeJS application to migrate Youtube subscriptions from one account to another.

##Usage:
`npm install`

`Fill in your Google Developer ClientID and Client Secret in the file "credentials.json" in root directory
The variables are 
client_id;
client_secret;
redirect_url;`

`node app.js`

Important Note : Make sure you are logged out of all your google account in default browser before starting the application.
##Process:

The browser is automatically opened when the app is run.
The First Google Login account is the producer of the Youtube Subscriptions.After authorization you are immediately redirected to the consumer Google account.

The progress and number of subscriptions are displayed in the console.

![ScreenShot](screenshot.png)
