const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);



const Schema = mongoose.Schema

const orderSchema = new Schema({
  order_number : {
    type : Number,
    required : true,
    unique : true
  },
  item_id : {
    type : Schema.Types.ObjectId,
    ref : 'Item',
    required : true
  },
  customer_id : {
    type : Schema.Types.ObjectId,
    ref : 'Customer',
    required : true
  },
  vehicle_id : {
    type : Schema.Types.ObjectId,
    ref : 'Vehicle',
    required : true
  },
  is_delivered : {
    type : Boolean,
    required : false
  }
},{ timestamps : true})

const order = mongoose.model('Order',orderSchema)
orderSchema.plugin(AutoIncrement, {inc_field: 'order_number'});

module.exports = order
