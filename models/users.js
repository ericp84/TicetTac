var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    lastName: String,            
    firstName: String,
    email: String,
    password: String
   });


var userModel = mongoose.model('users', userSchema);

   module.exports = userModel;