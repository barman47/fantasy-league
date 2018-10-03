const express = require('express');
const exphbs = require('express-handlebars');
const favicon = require('express-favicon');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
const socketIO = require('socket.io');
const moment = require('moment');
const http = require('http');

const Post = require('./models/post');
const path = require('path');
const publicPath = path.join(__dirname, 'public');
const config = require('./config/database');
const port = process.env.PORT || 6700;
const users = require('./routes/users');
const admin = require('./routes/admin');

mongoose.connect(config.database, {
    useNewUrlParser: true
});

let conn = mongoose.connection;

conn.once('open', () => {
    console.log('Database Connection Established Successfully.');
});

conn.on('error', (err) => {
    console.log('Unable to Connect to Database. ' + err);
});

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(favicon(publicPath + '/img/favicon.png'));
app.use(express.static(publicPath));
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    partialsDir: 'views/partials'
}));
app.set('view engine', '.hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser('keybaord cat'));
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
});
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        let namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return{
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.success_message = req.flash('success');
    res.locals.failure_message = req.flash('failure');
    next();
});

app.use('/users', users);
app.use('/admins', admin);

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('info', (data) => {
        let time = moment();
        console.log(data);
        io.emit('newInfo', {
            info: data.text,
            category: data.category,
            //time: time.format('h:mm a').fromNow(),
            time: time.startOf("minute").fromNow()
        });

        let post = new Post({
            category: data.category,
            text: data.text,
            time: time.format('dddd, Do MMMM YYYY - h:mm a')
        });
        post.save()
        .then(() => {
            console.log('post saved ', post);
        })
        .catch((err) => {
            return console.log(err);
        });
    });

    socket.on('disconnect', () => console.log('User disconnected'));
});

app.get('/', (req, res) => {
    res.render('index.hbs', {
        title: 'Title',
        style: 'index.css'
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
