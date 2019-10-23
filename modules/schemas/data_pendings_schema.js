var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var pendingSchema = new Schema({
  _id: Number,
  phone: {
    type: String,
    required: true
  },
  chama_code: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'KES'
  },
  type: String,
  duration: String,
  chairperson_approved: {
    type: Boolean,
    default: false,
  },
  secretary_approved: {
    type: Boolean,
    default: false,
  },
  treasure_approved: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
},{
  usePushEach : true
});

pendingSchema.plugin(autoIncrement.plugin, 'data_pendings');
pendingSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('data_pendings', pendingSchema);