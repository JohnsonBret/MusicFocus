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
var {Order} = require('./models/order');
var {Product} = require('./models/product');
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

app.get('/orders/:status', authenticate, async(req, res)=>{

    const status = req.params.status;

    try{

        let shippingStatus;
        let orderCancelStatus;

        if(status === "NotShipped")
        {
            shippingStatus = false;
            orderCancelStatus = false;
        }
        else if(status === "Shipped"){
            shippingStatus = true;
            orderCancelStatus = false;
        }
        else if(status === "Canceled"){
            orderCancelStatus = true;
        }
        else if(status === "Active"){
            orderCancelStatus = false;
        }

        console.log(`Got fetch request for Orders ${status}`);
        console.log(`Shipping Status ${shippingStatus} Order Status ${orderCancelStatus}`);

        
        if(orderCancelStatus === undefined && shippingStatus === undefined)
        {
            let selectedOrders = await Order.find({});

            return res.status(200).send(selectedOrders);
        }
        else if(orderCancelStatus === undefined)
        {
            let selectedOrders = await Order.find({
                shippingStatus: shippingStatus
            });

            console.log(selectedOrders);

            return res.status(200).send(selectedOrders);
        }
        else if(shippingStatus === undefined)
        {
            let selectedOrders = await Order.find({
                orderCancelStatus: orderCancelStatus
            });

            console.log(selectedOrders);

            return res.status(200).send(selectedOrders);
           
        }
        else{
            let selectedOrders = await Order.find({
                shippingStatus: shippingStatus,
                orderCancelStatus: orderCancelStatus
            });
           
            // console.log(selectedOrders);
            return res.status(200).send(selectedOrders);
        }
        

    }catch(e){
        console.log("Error Message", e);
        return res.status(400).send(e);
    }
    
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


//TODO clean up this abomination!
app.post('/charge', async (req, res)=>{

    // console.log("request body", req.body);

    // 1. Does the Email exist as a user?
    // Yes? 
    // 2. Do we have their address info? -> Save it
    // 3. Have they ordered before?
    //      Yes?
    // 4.         Don't create a Customer in stripe -> charge the existing stripe customer
    //      No
    // 5.         Create a stripe customer

    // 6. Save the order information -> Orders collection -> Save the object ID -> stripe charge ID

    try{

        const user = await User.find({email: req.body.stripeEmail})
        let searchUserAddress;
        if (user.length == 0) {
            const newUser = new User({email: req.body.stripeEmail, 
                password: "MF123456",
                name: req.body.stripeBillingName});

            const createdUser = await newUser.save();

            searchUserAddress = createdUser._id;
        }
        else
        {
            searchUserAddress = user[0]._id;
        }

        const address = await UserAddress.find({_userId: searchUserAddress })
        
        if (address.length == 0) {
            var addressBody = {
                email: req.body.stripeEmail,
                _userId: searchUserAddress,
                name: req.body.stripeBillingName,
                addressStreet: req.body.stripeBillingAddressLine1,
                addressCity: req.body.stripeBillingAddressCity,
                addressZip: req.body.stripeBillingAddressZip,
                addressState: req.body.stripeBillingAddressState,
                addressCountry: req.body.stripeBillingAddressCountry
            }

            var userSaveAddress = new UserAddress(addressBody);

            const savedAddress = await userSaveAddress.save();
        }

        const customerInfo = CustomerInfo.findOne({email: req.body.stripeEmail});

        const productInfo = Product.findOne({productId: req.body.productId});

        const info = await Promise.all([customerInfo, productInfo]);

        if(!info[1])
        {
            throw new Error(`Product Info not found for Product ID ${req.body.productId}`);
        }
        const amount = info[1].price;

        if(!info[0])
        {
            const customer = await stripe.customers.create({
                email: req.body.stripeEmail,
                source: req.body.stripeToken
            });

            var pickedNewCustomerInfo = _.pick(customer, ['email', 'created', 
                                                            'account_balance', 'delinquent', 'livemode']);
            
            pickedNewCustomerInfo._customerId = customer.id;

            if(searchUserAddress)
            {
                pickedNewCustomerInfo._userId = searchUserAddress;
            }

            var custInfo = new CustomerInfo(pickedNewCustomerInfo);

            const cust = await custInfo.save();

            const charge = await stripe.charges.create({
                amount: amount,
                description: info[1].description,
                currency: 'usd',
                customer: customer.id
            });

            //Save A order FOR THE NEW CUSTOMER ID - pickedNewCustomerInfo._customerId
            var newOrder = new Order({
                customerName: req.body.stripeBillingName,
                customerEmail: req.body.stripeEmail,
                _customerId: pickedNewCustomerInfo._customerId,
                _chargeId: charge.id,
                productId: req.body.productId,
                price: amount,
                created: Date.now(),
                billingAddress: {
                    addressStreet: req.body.stripeBillingAddressLine1,
                    addressCity: req.body.stripeBillingAddressCity,
                    addressZip: req.body.stripeBillingAddressZip,
                    addressState: req.body.stripeBillingAddressState,
                    addressCountry: req.body.stripeBillingAddressCountry
                    },
                shippingName: req.body.stripeShippingName,
                shippingAddress: {
                    addressStreet: req.body.stripeShippingAddressLine1,
                    addressCity: req.body.stripeShippingAddressCity,
                    addressZip: req.body.stripeShippingAddressZip,
                    addressState: req.body.stripeShippingAddressState,
                    addressCountry: req.body.stripeShippingAddressCountry
                }
            });

            const savedOrder = await newOrder.save();

            return res.status(200).render('purchase.hbs', {
                item: info[1].name,
                image: info[1].productImage,
                amount: amount
            });
        }

            //CREATE A CHARGE FOR THE EXISTING CUSTOMER ID
            const charge = await stripe.charges.create({
                amount: amount,
                description: info[1].description,
                currency: 'usd',
                customer: info[0]._customerId
            });

            //Save A order FOR THE EXISTING CUSTOMER ID - info[0]._customerId
            var newOrder = new Order({
                customerName: req.body.stripeBillingName,
                customerEmail: req.body.stripeEmail,
                _customerId: info[0]._customerId,
                _chargeId: charge.id,
                productId: req.body.productId,
                price: amount,
                created: Date.now(),
                billingAddress: {
                    addressStreet: req.body.stripeBillingAddressLine1,
                    addressCity: req.body.stripeBillingAddressCity,
                    addressZip: req.body.stripeBillingAddressZip,
                    addressState: req.body.stripeBillingAddressState,
                    addressCountry: req.body.stripeBillingAddressCountry
                    },
                shippingName: req.body.stripeShippingName,
                shippingAddress: {
                    addressStreet: req.body.stripeShippingAddressLine1,
                    addressCity: req.body.stripeShippingAddressCity,
                    addressZip: req.body.stripeShippingAddressZip,
                    addressState: req.body.stripeShippingAddressState,
                    addressCountry: req.body.stripeShippingAddressCountry
                }
            });

            const savedOrder = await newOrder.save();

            return res.status(200).render('purchase.hbs', {
                item: info[1].name,
                image: info[1].productImage,
                amount: `$${amount / 100}`
            });
        
    }catch (e){
        res.status(400).send({errorMsg: e});
    }

});

app.patch('/orders/shipped/:id/:value', authenticate, async (req,res)=>{
    const id = req.params.id;
    const updateValue = req.params.value;

    console.log(`Patch Request Id: ${id} and Value ${updateValue}`);

    try{
        const updatedOrder = await Order.findOneAndUpdate({_id: id}, {$set:{shippingStatus: updateValue}}, {new: true});
        res.status(200).send({message: "Success", order: updatedOrder});
    } catch(e){
        res.status(400).send(e);
    }

});

app.patch('/orders/cancel/:id/:value', authenticate, async (req,res)=>{
    const id = req.params.id;
    const updateValue = req.params.value;

    console.log(`Patch Request Id: ${id} and Value ${updateValue}`);

    try{
        const updatedOrder = await Order.findOneAndUpdate({_id: id}, {$set:{orderCancelStatus: updateValue}}, {new: true});
        res.status(200).send({message: `Canceled order ${id}`, order: updatedOrder});
    } catch(e){
        res.status(400).send(e);
    }

});

app.post('/product/create', authenticate, async (req, res)=>{

    try{
        var product = _.pick(req.body, ['name', 'productId', 'description', 'price', 'productImage', 'productType']);
        var newProduct = new Product(product);
        const prod = await newProduct.save();

        return res.status(200).send({
            message: "Successful Product Creation",
            product: product
        });

    }catch(e){
        res.status(400).send({errorMsg: e});
    }
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