if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// console.log(process.env.CLOUDINARY_CLOUD_NAME)
// console.log(process.env.CLOUDINARY_KEY)
// console.log(process.env.CLOUDINARY_SECRET)

const express = require('express');
const path = require('path') ;
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash =  require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


const userRoutes = require('./routes/users')
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    //  useNewUrlParser : true, //<--no longer use
    //  useCreateIndex : true, // <--no longer use
    //  useUnifiedTopology : true //<--no longer use
    //  useFindAndModify: false // <--no longer use
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connectiion error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly : true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({email: 'coltttt@gmail.com', username: 'colttt'});
    const newUser = User.register(user, 'chicken');
    res.send(newUser);
})


app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)


app.get('/', (req, res) => {
    res.render('home')
});



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
} )

app.use ((err, req, res, next) => {
    const { statusCode = 500 }= err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err });
})


app.listen(3000, () => {
    console.log('Serving on port 3000')
})