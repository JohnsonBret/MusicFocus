//https://maialinonyc.com/
//https://www.americarestaurant.ca/
require('./config/config');

const _ = require('lodash');
const express = require('express');
const fs = require('fs');
const hbs = require('hbs');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Booking} = require('./models/booking');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials");
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;


hbs.registerHelper('getCurrentYear', ()=>{
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text)=>{
    return text.toUpperCase();
})

app.get('/', (req, res)=>{
    res.render('index.hbs', {
        pageTitle: "Alpine Garden",
        welcomeMessage: "Welcome to this homepage",
        company: "Music Focus"
    });
});

app.get('/login', (req, res)=>{
    res.render('login.hbs', {
        pageTitle: "Login",
        welcomeMessage: "Welcome to this homepage",
        company: "Music Focus"
    });
});

app.get('/history', (req, res)=>{
    res.render('history.hbs', {
        pageTitle: "History",
        company: "Music Focus"
    });
});

app.get('/owner', (req, res)=>{
    res.render('owner.hbs', {
        pageTitle: "Services",
        company: "Music Focus"
    });
});

app.get('/products', (req, res)=>{
    res.render('products.hbs', {
        pageTitle: "Products",
        company: "Music Focus"
    });
});

app.get('/rehearsal', (req, res)=>{
    res.render('rehearsal.hbs', {
        pageTitle: "Rehearsal",
        company: "Music Focus"
    });
});

app.get('/recording', (req, res)=>{
    res.render('recording.hbs', {
        pageTitle: "Recording",
        company: "Music Focus"
    });
});

app.get('/lessons', (req, res)=>{
    res.render('lessons.hbs', {
        pageTitle: "Lessons",
        company: "Music Focus"
    });
});

app.get('/songlist', (req, res)=>{
    res.render('songlist.hbs', {
        pageTitle: "Song List",
        company: "Music Focus"
    });
});

app.get('/contact', (req, res)=>{
    res.render('contact.hbs', {
        pageTitle: "Contact",
        company: "Music Focus"
    });
});

app.get('/bad', (req,res)=>{
    res.send({
        error : "Unable to handle Request"
    });
});

app.post('/users', (req, res)=>{
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token)=>{
        res.header('x-auth', token).send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

app.post('/users/login', (req,res)=>{
    var body = _.pick(req.body,['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.header('x-auth', token).send(user);
        });
    }).catch((e)=>{
        res.status(400).send();
    });
});

app.post('/submit', (req, res)=>{
    console.log(`Contact Name: ${req.body.contactName}
                Contact Email: ${req.body.contactEmail}
                Contact Number: ${req.body.contactNumber}
                Contact Street ${req.body.contactStreet}
                Contact City ${req.body.contactCity}
                Contact Questions: ${req.body.contactQuestions}`);

    res.render('contact.hbs', {
        pageTitle: "Contact",
        thanksMsg: "Thanks for contacting us!",
        company: "Alpine Garden"
    });
});

app.listen(port, ()=>{
    console.log(`Server up on Port ${port}`);
});

module.exports = {app};