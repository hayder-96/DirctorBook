const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const passport = require('passport')
const session = require('express-session')


const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')
const reg=require('./routes/register');
const log=require('./routes/login');





app.set('view engine', 'ejs')
app.use(cookieParser());

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET' 
  }));

app.use(passport.initialize());
    app.use(passport.session()); 

    app.use(express.json());

 app.use(express.static('public'))

 app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))


const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:/Book', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)
app.use(reg);
app.use(log);







  

app.listen(process.env.PORT || 3000)

