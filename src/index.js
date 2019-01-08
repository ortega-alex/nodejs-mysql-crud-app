const express = require("express");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require('path');
const flash = require("connect-flash");
const session = require("express-session");
const mysqlStore = require("express-mysql-session");
const { database } = require("./config/keys");
const passport = require('passport');

//initilizations
const app = express();
require('./lib/passport');

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    partialsDir: path.join(app.get('views'), 'partials'),
    layoutsDir: path.join(app.get('views'), 'layouts'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//middlewares
app.use(session({
    secret: "session" ,
    resave: false,
    saveUninitialized: false, 
    store: mysqlStore(database)
}))
app.use(flash());
app.use(morgan("dev"));
app.use(express.urlencoded({ 'extended': false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//global varibles
app.use((req, res, next) => {
    app.locals.success = req.flash("success");
    app.locals.message = req.flash("message");
    app.locals.user = req.user;
    next();
});

//routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));

//public 
app.use(express.static(path.join(__dirname, 'public')))

//starting the server
app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
});