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
var {DateTime} = require('luxon');

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
        pageTitle: "Music Focus | Home",
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

app.get('/dashboard', (req,res)=>{
    res.render('dashboard.hbs', {
        pageTitle: "Dashboard",
        welcomeMessage: "Welcome to the Dashboard",
        company: "Music Focus"
    });
});

app.get('/dashboard/auth', authenticate, (req,res)=>{
    res.send(200);
});

app.get('/users', authenticate, (req, res)=> {
    User.find({}).then((users)=>{
        res.status(200).send({users});
    }, (e)=>{
        res.status(400).send(e);
    });
});

app.get('/schedule/week', (req, res) =>{
    Booking.find({
        from: {
            $gte: DateTime.local().startOf("week").toJSDate(),
            $lte: DateTime.local().endOf("week").toJSDate()
        }
    }).then((bookings)=>{

        var pickedBookings = bookings.map((current)=>{
            var pickedCurrent = _.pick(current, ['from', 'to', 'bookeeName']);
            
            var fromUTCTime = DateTime.fromJSDate(pickedCurrent.from);
            var fromLATime = fromUTCTime.setZone('America/Los_Angeles');
            pickedCurrent.from = fromLATime;

            var toUTCTime = DateTime.fromJSDate(pickedCurrent.to);
            var toLATime = toUTCTime.setZone('America/Los_Angeles');
            pickedCurrent.to = toLATime;

            return pickedCurrent;
        });

        res.status(200).send({pickedBookings});
    }, (e)=>{
        res.status(400).send(e);
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
    var body = _.pick(req.body, ['email', 'password', 'name']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token)=>{
        res.header('x-auth', token).send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

app.post('/users/admin/create', (req, res)=>{

    var body = _.pick(req.body, ['email', 'password', 'name']);
    var user = new User(body);

    user.save().then(()=>{
        res.status(200).send({
            status: "successfully created user",
            username: body.name,
            email: body.email
        });
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

app.post('/booking', authenticate, (req, res)=>{
    var token = req.header('x-auth');
    var body = _.pick(req.body, ['location', 'from', 'to', '_bookee', 'bookeeName']);

    body.slotsAvailable = 1;

    User.findByToken(token).then((user)=>{
        if(!user){
            console.log("Failed to find by Token Server.js line 182");
            return Promise.reject();
        }

        body._creator = user._id;
        var booking = new Booking(body);
 
        booking.save().then(()=>{
            res.status(200).send({
                booking: "successful"
            });
        }).catch((e)=>{
            res.status(400).send(e);
        });

    }).catch((e)=>{
        res.status(401).send(e);
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
        company: "Music Focus"
    });
});

app.delete('/users/me/token', authenticate, (req, res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    }, () =>{
        res.status(400).send();
    });
});

app.listen(port, ()=>{
    console.log(`Server up on Port ${port}`);
});

module.exports = {app};