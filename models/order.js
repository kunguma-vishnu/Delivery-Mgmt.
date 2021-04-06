const mongoose = require('mongoose')
const dbURI = 'mongodb+srv://xyz-controller:x1y2z3@cluster0.zfpij.mongodb.net/Syook?retryWrites=true&w=majority'

mongoose.connect(dbURI,{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex : true})
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema

const orderSchema = new Schema({
  order_id : {
    type : Number
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
    default : false
  }
},{ timestamps : true})


orderSchema.plugin(AutoIncrement,{inc_field: 'order_id'})

const order = mongoose.model('Order',orderSchema)

module.exports = order
