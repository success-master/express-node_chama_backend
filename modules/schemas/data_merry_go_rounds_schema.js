var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var roundsSchema = new Schema({
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
  accept_status: {
    type: String,
    default: 'pending',     // waiting, accept
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
},{
  usePushEach : true
});

roundsSchema.plugin(autoIncrement.plugin, 'data_merry_go_rounds');
roundsSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('data_merry_go_rounds', roundsSchema);