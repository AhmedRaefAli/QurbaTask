const path = require('path');
const fs =require('fs');

const express=require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const passport = require('passport');
const cookieSession = require('cookie-session');
require("dotenv").config();

const keys = require("./configs/configs");
const usersRoutes = require('./routes/users-routes');
const restaurantsRoutes = require('./routes/restaurantsRoutes');
require('./models/user');
require('./services/passport');

const app = express();
app.use(cors());
app.use(bodyParser.json()); 
app.use(helmet());
app.use(compression());

if (keys.nodeEnv === "development") {
    const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{
        flags:"a"
    });
    app.use(morgan('combined',{stream:accessLogStream}));  
}

console.log("We are on ",keys.nodeEnv, " Mode");

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

require('./routes/authRoutes')(app);
app.use('/user',usersRoutes);
app.use(restaurantsRoutes);


app.use((error, req, res, next) => {
    console.log(error.message);
    if (res.headerSent) {
        return next(error);
    }
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message|| 'An unknown error occurred!', data: data });
});


mongoose
    .connect(`mongodb://localhost:27017/${keys.DATABASENAME}`
    )
    .then(result => {
        app.listen(keys.PORT||5000);
        console.log('app listen to port 5000')
    })
    .catch(err => console.log(err));