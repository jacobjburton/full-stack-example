require('dotenv').config();

const express = require('express'),
    session = require('express-session'),
    passport = require('passport'),
    Auth0Strategy = require('passport-auth0'),
    massive = require('massive');

const app = express();

const {
    SERVER_PORT,
    CONNECTION_STRING,
    SESSION_SECRET,
    DOMAIN,
    CLIENT_ID,
    CLIENT_SECRET,
    CALLBACK_URL
} = process.env;

massive(CONNECTION_STRING).then(db => 
{
    app.set('db', db);
});

app.use(session(
{
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(express.static(__dirname + '/../build'));

passport.use(new Auth0Strategy(
{
    domain: DOMAIN,
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    scope: 'openid profile'
}, function(accessToken, refreshToken, extraParams, profile, done)
{
    // db calls go here
    const db = app.get('db');
    const{id, displayName, picture} = profile;

    db.find_user([id]).then(users => 
    {
        if (users[0])
        {
            return done(null, users[0].id);
        }
        else
        {
            db.create_user([displayName, picture, id])
            .then(createdUser =>
            {
                return done(null, createdUser[0].id);
            });
        }
    });

    //return done(null, profile);
}));

passport.serializeUser(function(id, done)
{
    //this puts info in the session store
    return done(null, id);
});

passport.deserializeUser((id, done) =>
{
    //runs before any endpoints are hit
    //grabs info from session store
    //puts that info on the req.user object
    app.get('db').find_session_user([id]).then(user => 
    {
        done(null, user[0]);
    });
});

app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback', passport.authenticate('auth0', 
{
    successRedirect: 'http://localhost:3000/#/private',
    failureRedirect: 'http://localhost:3000'
}));

//if req.user is undefined - no one is logged in
app.get('/auth/me', (req, res) =>
{
    if (req.user)
    {
        res.status(200).send(req.user);
    }
    else
    {
        res.status(401).send('No one is logged in cheaterface');
    }
});
app.get('/logout', (req, res) =>
{
    req.logOut();
    res.redirect('http://localhost:3000');
});


app.listen(SERVER_PORT, () => 
{
    console.log(`Listeny McListenerson on port: ${SERVER_PORT}`);
});