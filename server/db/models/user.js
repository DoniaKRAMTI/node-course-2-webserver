const mongoose = require ('mongoose');
const validator = require ('validator');
const jwt = require ('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require ('bcryptjs');
// {
//   email:'donia.kramti@gmail.com',
//   password :'donia@2018',
//   tokens: [{ 
//     access: 'auth',
//     token: '09980478D'

//   }]
// }
var UserSchema =mongoose.Schema( {
    email: {
  type: String,
  required: true,
  trim :true,
  minlength:1,
  unique :true,
  validate:{
    validator: validator.isEmail,
    message: '{VALUE} is not a valid email'
  }
    },
    password:{
      type: String,
      require:true,
      minlength:6
    },
    tokens: [{
      access:{
      type : String,
      required:true
      },
     token:{
       type: String,
       required :true
     }
    }]
});
UserSchema.methods.toJSON = function(){
var user= this;
var userObject = user.toObject();

return_.pick(userObject, ['_id', 'email']);
};
UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sigh({_id: user._id.toHexString(), access}, 'abc123').toString();

user.tokens.push({access, token});
return user.save().then(() => {
  return token;
});
};
UserSchema.statics.findByToken = function(token) {
var User = this;
var decoded;

try{
decoded = jwt.verify(token, 'abc123');
} catch(e) {
// return new Promise((resolve,reject) =>{
//  reject();
// });
return Promise.reject();
}

return User.findOne({
'_id': decoded._id,
'tokens.token': token,
'tokens.access' :'auth'
});
};
UserSchema.pre('save', function (next) {
var user = this;
if (user.isModified('password')){
bcrypt.genSalt(10, (err,salt) => {
  bcrypt.hash(user.password, salt, (err,hash) => {
    user.password = hash;
    next();
  })
})

} else {
  next();
}
});

var User = mongoose.model('User', UserSchema);
module.exports = {User};