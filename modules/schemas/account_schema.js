var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;
var jwt = require('jsonwebtoken');

autoIncrement.initialize(mongoose.connection);

var accountSchema = new Schema({
  _id: Number,
  user_name: String,
  email: { 
    type: String,
    required: true
  },
  password: {
    type: String,
    required : true
  },
  role: {
    type: String,
    default: "guest"
  },
  avatar: String,
  transaction_fee: {
    type: Number,
    default: 50
  },
  interest_rate: {
    type: Number,
    default: 18
  },
  status: {
    type: String,
    default: "online"
  },
},{
  usePushEach : true
});

accountSchema.plugin(autoIncrement.plugin, 'data_accounts');
accountSchema.plugin(passportLocalMongoose);

accountSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setHours(expiry.getHours() + 4);

  return jwt.sign({
    user_id: this._id,
    user_name: this.user_name,
    email: this.email,
    avatar : this.avatar,
    role: this.role,
    status: this.status,
    exp: parseInt(expiry.getTime() / 1000),
  }, "bAKVdqczerYAYKdMxsaBzbFUJU6ZvL2LwZuxhtpS");
};

module.exports = mongoose.model('data_accounts', accountSchema);