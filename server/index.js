require('dotenv').config();
const express = require('express'),
      session = require('express-session'),
      massive = require('massive'),
      authCtrl = require('./../controllers/authController'),
      treasureCtrl = require('./../controllers/treasureController.js'),
      auth = require('./middleware/authMiddleware.js'),
      {SESSION_SECRET, CONNECTION_STRING, SERVER_PORT} = process.env,
      app = express();

app.use(express.json());

app.use(
    session({
        resave: true,
        saveUninitialized: false,
        secret: SESSION_SECRET
    })
)

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    console.log('db connected')
})


app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)


const port = SERVER_PORT
app.listen(port, () => console.log(`Server listening on port: ${port}`));