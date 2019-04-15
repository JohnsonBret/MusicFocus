//https://maialinonyc.com/
//https://www.americarestaurant.ca/
require('./config/config');

const _ = require('lodash');
const express = require('express');
const stripe = require('stripe')('sk_test_zaDeitYTZGlzlNddFicamtrn00hz1X3IzS')
const fs = require('fs');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Booking} = require('./models/booking');
var {User} = require('./models/user');
var {UserAddress} = require('./models/userAddress');
var {CustomerInfo} = require('./models/customerInfo');
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

app.post('/charge', (req, res)=>{

    console.log(req.body);

    // 1. Does the Email exist as a user?
    // Yes? 
    // 2. Do we have their address info? -> Save it
    // 3. Have they ordered before?
    //      Yes?
    // 4.         Don't create a Customer in stripe -> charge the existing stripe customer
    //      No
    // 5.         Create a stripe customer

    // 6. Save the order information -> Orders collection -> Save the object ID -> stripe charge ID


    // 1. Does the Email exist as a user?
    User.find({email: req.body.stripeEmail}).then((user)=>{
        if (user.length == 0) {
            return Promise.reject();
        }

        // 2. Do we have their address info? -> Save it
        UserAddress.find({_userId: user[0]._id}).then((address)=>{
            if (address.length == 0) {
                var addressBody = {
                    email: req.body.stripeEmail,
                    _userId: user[0]._id,
                    name: req.body.stripeBillingName,
                    addressStreet: req.body.stripeBillingAddressLine1,
                    addressCity: req.body.stripeBillingAddressCity,
                    addressZip: req.body.stripeBillingAddressZip,
                    addressState: req.body.stripeBillingAddressState,
                    addressCountry: req.body.stripeBillingAddressCountry
                }

                console.log("User not address not found - saving address");

                var userSaveAddress = new UserAddress(addressBody);
 
                userSaveAddress.save().then((savedAddress)=>{

                console.log("User Address saved!");

                
                }).catch((e)=>{
                    return Promise.reject(e);
                });
            }

            console.log("User was in the Database");
            console.log(JSON.stringify(user,undefined,2));
            console.log(JSON.stringify(address,undefined,2));

        }).catch((e)=>{
            return Promise.reject(e);
            // res.status(400).send({errorMsg: e});
        });

        CustomerInfo.findOne({email: req.body.stripeEmail}).then((customerInfo)=>{

            if(!customerInfo)
            {
                stripe.customers.create({
                    email: req.body.stripeEmail,
                    source: req.body.stripeToken
                }).then((customer)=>{

                    var pickedNewCustomerInfo = _.pick(customer, ['email', 'created', 
                                                                    'account_balance', 'delinquent', 'livemode']);
                    
                    pickedNewCustomerInfo._customerId = customer.id;

                    if(user[0]._id)
                    {
                        pickedNewCustomerInfo._userId = user[0]._id;
                    }

                    console.log("Picked Customer Info", JSON.stringify(pickedNewCustomerInfo, undefined,2));
        
                    var custInfo = new CustomerInfo(pickedNewCustomerInfo);
        
                    custInfo.save().then((cust)=>{
                        console.log("New customer info saved", JSON.stringify(cust,undefined,2));
                    }).catch((e)=>{
                        return Promise.reject(e);
                        // res.status(400).send({errorMsg: e});
                    });

                    stripe.charges.create({
                        amount: amount,
                        description: "Picture Tube CD",
                        currency: 'usd',
                        customer: customer.id
                    }).then((charge)=>{
                    res.status(200).render('purchase.hbs', {
                        item: "Picture Tube CD",
                        amount: amount
                        })
                    });
                
                
                });
            }
    
            console.log(JSON.stringify(customerInfo, undefined, 2));

            //CREATE A CHARGE FOR THE EXISTING CUSTOMER ID
    
            // res.status(200).send({
            //     user: user,
            //     address: savedAddress
            //     });
    
        }).catch((e)=>{
            res.status(400).send({errorMsg: e});
        });

    }).catch((e)=>{
        return Promise.reject(e);
        // res.status(400).send({errorMsg: e});
    });

    


    //Confirm charge amount -> Products Collection
    const amount = 2000;

    // stripe.customers.create({
    //     email: req.body.stripeEmail,
    //     source: req.body.stripeToken
    // }).then((customer)=>{
    //     stripe.charges.create({
    //         amount: amount,
    //         description: "Picture Tube CD",
    //         currency: 'usd',
    //         customer: customer.id
    //     })
    // }).then((charge)=>{
    //     res.status(200).render('purchase.hbs', {
    //         item: "Picture Tube CD",
    //         amount: amount
    //     })
    // })    
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