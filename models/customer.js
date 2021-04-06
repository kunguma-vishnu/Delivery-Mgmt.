const mongoose = require('mongoose')
const Schema = mongoose.Schema

const customerSchema = new Schema({
  name : {
    type : String,
    required : true,
  },
  city : {
    type : String,
    required : true
  }
},{ timestamps : true})

const customer = mongoose.model('Customer',customerSchema)
module.exports = customer
