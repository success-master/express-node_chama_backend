var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var userSchema = new Schema({
  _id: Number,
  user_name: String,
  phone: { 
    type: String,
    required: true
  },
  password: {
    type: String,
    required : true
  },
  role: {
    type: String,
    default: "Member"
  },
  avatar: {
    type: String,
    default: ""
  },
  account_status: {
    type: String,
    default: "Active"
  },
  chama_code: String,
  contribution_status: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
},{
  usePushEach : true
});

userSchema.plugin(autoIncrement.plugin, 'data_users');
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('data_users', userSchema);