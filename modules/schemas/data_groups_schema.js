var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var groupSchema = new Schema({
  _id: Number,
  chama_name: {
    type: String,
    required: true,
  },
  user_name: {
    type: String,
    required: true
  },
  phone: { 
    type: String,
    required: true
  },
  password: {
    type: String,
    required : true
  },
  created_at: {
    type: Date,
    default: Date.now()
  },
  avatar: {
    type: String,
    default: ""
  },
  max_members: Number,
  last_contribution: {
    type: Date,
    default: Date.now()
  },
  contribution: Number,
  contribution_cycle: String,
  emergency_fund: Number,
  my_saving: Number,
  merry_go_round: Number,
  contribution_status: {
    type: Boolean,
    default: false
  },
  chama_code: String,
  account_status: String
},{
  usePushEach : true
});

groupSchema.plugin(autoIncrement.plugin, 'data_groups');
groupSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('data_groups', groupSchema);