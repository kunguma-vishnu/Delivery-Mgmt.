const mongoose = require('mongoose')
const Schema = mongoose.Schema

const vehicleSchema = new Schema({
  registration_number : {
    type : String,
    unique : true,
    $regex : '[a-zA-Z0-9]*'
  },
  vehicle_type : {
    type : String,
    enum : ['bike','truck'],
    required : true,
  },
  city : {
    type : String,
    required : true
  },
  active_order_count : {
    type : Number,
    required : true,
    min : 0,
    max : 2,
    default : 0
  }
},{ timestamps : true})

const vehicle = mongoose.model('Vehicle',vehicleSchema)
module.exports = vehicle
