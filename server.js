// - - - - = = = = Configurations = = = = - - - -

// Express
const express = require('express');
const app = express();

//use sessions for tracking logins
const session=require('express-session');
app.use(session({
  secret: 'storeAppSecret',
  resave: true,
  saveUninitialized: false
}));

//for storing images
const fs = require('fs');
const multer = require('multer');

// Path
const path = require('path');

// CORS
const cors = require('cors');
app.use(cors());

// Static Directory
app.use(express.static(__dirname + '/storeApp/dist'));

// Body Parser
const parser = require('body-parser');
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

//bcrypt for password hashing
const bcrypt=require('bcrypt-nodejs')

// Morgan (optional)
let morgan = require("morgan");
app.use(morgan('dev'));




// - - - - = = = = Model = = = = - - - -
const uniqueValidator = require('mongoose-unique-validator');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bikeTwo-api');
mongoose.connection.on('connected', () => console.log('connected to MongoDB'));
mongoose.Promise = global.Promise;
const { Schema } = mongoose;
const bikeSchema = new Schema({
  title:{
    type: String,
    trim: true,
    required: [true, 'description is required'],
    minlength: [2, 'bike name must be atleast 2 characters']
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'description is required'],
    minlength: [5, 'description must be atleast 5 characters']
  },
  price:{type:Number,
    required:[true,'please enter a price']
  },
  location:{
    city:String,
    state:String
  },
  image:{data:Buffer,contentType:String},

  _owner:{type:Schema.Types.ObjectId, ref:'user'}
},
 {
  timestamps: true
});

const userSchema = new Schema({
  firstName:{type:String,required: [true, 'first name is required'],
  minlength: [2, 'names must be atleast 2 characters']},

  lastName:{type:String,required: [true, 'last name is required'],
  minlength: [2, 'names must be atleast 2 characters']},

  email:{type:String, unique:[true,'email already registered'], required: [true, 'email is required']},

  password:{type:String, required:[true,'password is required']},

  bikesOwned:[{type:Schema.Types.ObjectId, ref:'bike'}]
},{timestamps:true, usePushEach:true})


const User = mongoose.model('user', userSchema);
const Bike = mongoose.model('bike', bikeSchema);

// - - - - = = = = Controller = = = = - - - -

const userController = {
  index: (request, response) => {

    User.find({})
      .then(users => response.json(users))
      .catch(error => console.log(error));
  },

  create: (request, response) => {
    request.body.password=bcrypt.hashSync(request.body.password)
    console.log("creating new user", request.body)
    User.create(request.body)
      .then(user=> {
        console.log("new user id is",user._id)
            request.session.userID=user._id;
            console.log("added user successfuly ,setting cookie and logging in")
              return response.json(request.session)
            })
      .catch(err => {console.log("transmitting error",err)
                      response.status(500).json(err)
            })
      },

  login: (request,response)=>{
    console.log("attempting login of: ", request.body.email, request.body.password)
    User.findOne({email:request.body.email}).exec(
      function(err,user){
        if (err || user==null || !user){return response.status(400).json(err)}
        //process if user email found
        else if (user){
          let pwGood=bcrypt.compareSync(request.body.password,user.password)
  //if passwords match
          if (pwGood){
            console.log("passwords Match")
            request.session.userID=user._id
            console.log("logon successful, session id is: ",request.session.userID)
            return response.json(request.session)
          }
//if password don't match
          else{
            console.log("No passwords nooo Match")
            return response.status(400).json({"err":"Password Incorrect"})
              }

          }// end outer else if
        }//end function
    )
  },//end login

  populateBikes:(request,response)=>{
    if (request.body.id!=request.session.userID){console.log("unauthorized user possible, transmitting error")
            return  response.status(401).json({"err":"User not Logged In"})
          }
    if (request.body.id==request.session.userID){console.log("user and session IDs match!!")}
    User.find({_id:request.body.id},{password:0}).populate('bikesOwned').exec(function(err,data){

    if(err){console.log("transmitting error",err)
            return      response.status(500).json(err)
          }
    if(data){
            //    console.log(data)
        return response.json(data)}
        } )//end exec
  }

} // end user Controller

const bikeController = {
  index: (request, response) => {

    Bike.find({}).populate('_owner','_id firstName lastName email bikesOwned').exec(function(err,data){
      if(err){console.log("transmitting error",err)
              return      response.status(500).json(err)
            }
      if(data){
                //  console.log(data)
          return response.json(data)}

    })//end exec
  },
  create: (request, response) => {
    console.log("creating new bike in db: ",request.body)
    User.findOne({_id:request.body._owner},{password:0},function(err,user){
      if(user){
        console.log("creating bike for user: ",user.id)
        Bike.create(request.body).then(bike =>
          { user.bikesOwned.push(bike)
            user.save()
             response.json(bike)
           })
          .catch(error => console.log(error));
      }//end if
      else {return response.status(500).json(err)}
    })
  },//end create

  updateBike:(request,response)=>{
    console.log("updating bike to ", request.body)
    Bike.update({_id:request.body._id},request.body).then(
      data=>response.status(200).json(data))
    .catch(err=> response.status(400).json(errs))
  },

  deleteBike:(request,response)=>{
    console.log("deleting bike ",request.body)
    Bike.findByIdAndRemove(request.body._id).then(
      data=>response.status(200).json(data))
    .catch(err=> response.status(400).json(errs))
  }

};

const sessionController = {
  getSession(request,response){
    if (request.session.userID==null|request.session.userID==undefined){return response.status(401).json(err)  }
    else if (request.session.userID){
      console.log("session returning: ", request.session.userID)
      return response.json({sessionUserID:request.session.userID})}

  },

  destroySession (request,response){
    console.log("destroying session")
    if(request.session){
      request.session.destroy()
      return response.status(200)
    }

    console.log(request.session.userID)
    return response.status(400)
  }

};


// - - - - = = = = Routes = = = = - - - -
app

.get('/users', userController.index)
.post('/users', userController.create)
.post('/login',userController.login)
.post('/userbikes',userController.populateBikes)

.get('/logout',sessionController.destroySession)
.get('/getsession', sessionController.getSession)

.get('/bikes', bikeController.index)
.post('/bikes', bikeController.create)
.post('/updateBike',bikeController.updateBike)
.post('/deleteBike',bikeController.deleteBike)
//.all("*", (req,res,next) => {
//  res.sendFile(path.resolve("./public/dist/index.html"))
//});

.all('*', function(request, response) {
  response.sendfile(path.join(__dirname, './storeApp/dist/index.html'));
})
// - - - - = = = ALTERNATIVE ROUTES = = = - - - -
//app.get('/tasks', (request, response) => { /*…*/ })
//app.post('/tasks', (request, response) => { /*…*/ })
//app.post('/tasks', )
//app.all("**", (request, response) => { response.sendFile(path.resolve("./public/dist/index.html")) });
/* remember that you'll need to require path for this to work! */

// - - - - = = = = ALTERNATE FOR: Routes+Controllers = = = = - - - -
// app
// .get('/tasks', (request, response) => {

//   Task.find({})
//     .then(tasks => response.json(tasks))
//     .catch(error => console.log(error));

// })
// .post('/tasks', (request, response) => {

//   Task.create(request.body)
//     .then(task => response.json(task))
//     .catch(error => console.log(error));

// })



// - - - - = = = = Server Listener = = = = - - - -
const port = 5000;
app.listen(port, ()=> console.log(`Express server listening on port ${port}`));
