//https://maialinonyc.com/
//https://www.americarestaurant.ca/
require('./config/config');

const _ = require('lodash');
const express = require('express');
const fs = require('fs');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Booking} = require('./models/booking');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');
var {bookingValidator} = require('./middleware/booking-validator');
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
    res.sendStatus(200);
});

app.get('/users', authenticate, (req, res)=> {
    User.find({}).sort({name: 'asc'}).then((users)=>{
        res.status(200).send({users});
    }, (e)=>{
        res.status(400).send(e);
    });
});

app.get('/bookings/:clientId', (req, res)=>{
    var bookeeId = req.params.clientId;

    Booking.find({
        _bookee: bookeeId,
    }).sort({from: 'asc'}).then((bookings)=>{

        var clientBookings = bookings.map((current)=>{
            var pickedCurrent = _.pick(current, ['_id','from', 'to', 'bookeeName']);
            
            return pickedCurrent;
        });

        res.status(200).send({clientBookings});
    }, (e)=>{
        res.status(400).send(e);
    });
});

app.get('/schedule/week/:weekNum/:location', (req, res) =>{

    var weekNum = req.params.weekNum;
    var locate = req.params.location;

    // console.log(`Week Number ${weekNum}`);

    //TODO: Needs to handle years - can only handle current year
    var displayWeek = DateTime.fromObject({weekNumber: weekNum, zone: 'America/Los_Angeles'});

    // console.log(`Display Week ${displayWeek}`);
    

    Booking.find({
        location: locate,
        from: {
            $gte: displayWeek.startOf("week").toJSDate(),
            $lte: displayWeek.endOf("week").toJSDate()
        }
    }).sort({from: 'asc'}).then((bookings)=>{

        var pickedBookings = bookings.map((current)=>{
            var pickedCurrent = _.pick(current, ['from', 'to', 'bookeeName']);
            
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
        res.status(400).send({errorMsg: e});
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
        res.status(400).send({errorMsg: e});
    });
});

app.post('/users/login', (req,res)=>{
    var body = _.pick(req.body,['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.status(200).header('x-auth', token).send(user);
        });
    }).catch((e)=>{
        res.status(400).send({errorMsg: e});
    });
});

var bookingMiddleware = [authenticate, bookingValidator]
app.post('/booking', bookingMiddleware, (req, res)=>{
    var token = req.header('x-auth');
    var body = _.pick(req.body, ['location', 'from', 'to', '_bookee', 'bookeeName']);

    body.slotsAvailable = 1;

    User.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject();
        }

        body._creator = user._id;
        var booking = new Booking(body);
 
        booking.save().then(()=>{
            res.status(200).send({
                booking: "successful"
            });
        }).catch((e)=>{
            res.status(400).send({errorMsg: e});
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

app.delete('/bookings/delete/:id', authenticate, (req,res) =>{
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Booking.findOneAndRemove({
        _id: id
    }).then((booking) =>{

        if(!booking){
            return res.status(404).send({errorMsg: "No Booking with that ID"});
        }

        var deletedBooking = _.pick(booking, ['_id','location', 'from', 'to', '_bookee', 'bookeeName']);

        res.status(200).send({deletedBooking});
    }).catch((e) =>{
        res.status(400).send();
    });
});

app.listen(port, ()=>{
    console.log(`Server up on Port ${port}`);
});

module.exports = {app};