var express = require('express');
var router = express.Router();
var session = require('express-session')
const mongoose = require('mongoose');
var userModel = require('../models/users')

// useNewUrlParser ;)
var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true
 };

// --------------------- BDD -----------------------------------------------------
mongoose.connect('mongodb+srv://admin:azerty16@cluster0.306p7.mongodb.net/Ticketac?retryWrites=true&w=majority',
   options,
   function(err) {
    if (err) {
      console.log(`error, failed to connect to the database because --> ${err}`);
    } else {
      console.info('*** Database Ticketac connection : Success ***');
    }
   }
);

var journeySchema = mongoose.Schema({
  departure: String,
  arrival: String,
  date: Date,
  departureTime: String,
  price: Number,
});

var journeyModel = mongoose.model('trips', journeySchema);

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Express' });
});

router.post('/signup', async function(req, res, next) {
  var signup = new userModel ({
    lastName: req.body.uplastname,            
    firstName: req.body.upfirstname,
    email: req.body.upmail,
    password: req.body.uppas,
  })
  await signup.save();
  req.session.signup = {
    name: signup.email,
    id: signup.id
  }
  console.log('REQ UP', req.session.signup)
  res.redirect('/home')
})

router.post('/signin', async function(req, res, next) {
  var signin = await userModel.findOne({
    email: req.body.inmail,
    password: req.body.inpas,
  })
  // console.log("SIGNIN", req.body.inmail)
  // console.log("SIGNIN", req.body.inpas)
  req.session.signin = {
    name: signin.email,
    id: signin.id
  }
  console.log("req//", req.session.signin)
  if(signin == null) {
    res.redirect('/')
  } else {
     res.redirect('/home')
  }
  
 
})

router.get('/home', function(req, res, next) {

  res.render('home', { title: 'Express' });
});

// router.get('/error', function(req, res, next) {
//   res.redirect('/home');
// });

router.post('/results', async function(req, res, next) {
  var desti = await journeyModel.find({
    departure: req.body.from,
    arrival: req.body.to,
    date: req.body.on,
  })
  console.log("dest//", desti)
  console.log("dest", req.body.from)
  console.log("dest", req.body.to)
  console.log("dest", req.body.on)
  res.render('results', {desti});
});

router.get('/trips', async function(req, res, next) {
  var trip = await journeyModel.findOne({
    _id: req.query.id
  })
  req.session.order = []
  req.session.order.push(trip)
  console.log("TRIP//", req.session.order)
  res.render('trips', {bills: req.session.order});
});

// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newUser = new journeyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       
       await newUser.save();

    }

  }
  res.render('index', { title: 'Express' });
});


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/result', function(req, res, next) {

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    journeyModel.find( 
      { departure: city[i] } , //filtre
  
      function (err, journey) {

          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )

  }

  res.render('index', { title: 'Express' });
});

module.exports = router;
