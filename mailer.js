let nodemailer = require('nodemailer');
let config = require('./config/mailer');
let {google} = require('googleapis');
let OAuth2 = google.auth.OAuth2;

console.log(config);
exports.transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        type : 'OAuth2',
        user: config.user,
     
        clientId : config.clientId,
        clientSecret: config.clientSecret,
        accessToken: config.accessToken,
        refreshToken: config.refreshToken,
     


    }
});