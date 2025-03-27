const { google } = require("googleapis");
const express = require('express');
const session = require('express-session');
require('dotenv').config(); 
const crypto = require('crypto');

const redis = require('redis');
const connectRedis = require('connect-redis');

/**
 * Everything redis
 */

const RedisStore = connectRedis(session);

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
})
redisClient.on('error', function(err){
    console.log('Could not establish a connection with redis. ' + err);
})

redisClient.on('error', function(){
    console.log('Connected succesfully with redis.');
})

async function main() {
    const app = express();
    const PORT = process.env.OAUTH_PORT || 8080;
    
    app.use(express.json());

    /**
     * Redis and session below
     */
    
    const secret = crypto.randomBytes(32).toString('hex');

    app.use(session({
        store: new RedisStore({client: redisClient}),
        secret: secret,
        resave: false,
        saveUninitialized: true,
    }));

    /**
     * All things OAuth begins from down here
     */

    const oauth2Client = new google.auth.OAuth2(
        process.env.OAUTH_CLIENT_ID,
        process.env.OAUTH_CLIENT_SECRET,
        process.env.OAUTH_REDIRECT_URL    
    );

    const scopes = [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube.readonly',
    ]


    app.get('/', async (req, res) => {
        const state = crypto.randomBytes(32).toString('hex');
        console.log(state);
        
        req.session.state = state;

        const authorizationUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true,
            state: state
        });
        
        res.redirect(authorizationUrl)
    })

   


    app.listen(PORT, () => {
        console.log(`Server be running on http://localhost:${PORT}`);
    });
}

main().catch(console.error);