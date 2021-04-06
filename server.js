const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')


const item = require('./models/item')
const customer = require('./models/customer')
const vehicle = require('./models/vehicle')
const order = require('./models/order')

//Express Application
const app =  express()

const dbURI = 'mongodb+srv://xyz-controller:x1y2z3@cluster0.zfpij.mongodb.net/Syook?retryWrites=true&w=majority'
const PORT = 3000

//Log all requests
app.use(morgan('dev'))
app.use(express.json())

const secret = 'trewq'


mongoose.connect(dbURI,{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex : true})
  .then((result) => {
    app.listen(PORT, () => {
      console.log("Application end point: "+PORT)
    })
  })
  .catch((err) => console.log(err))

//Routes
app.get('/items',async (req,res) => {
  const items = await item.find().catch(err => console.log('Caught:', err.message))
  res.json(items)
})

app.get('/items/:name', async (req,res) => {
  const requested_item = await item.find({ name : req.params.name}).catch(err => console.log('Caught:', err.message))
  res.json(requested_item)
})

app.post('/items',async (req,res) => {
  const new_items = new item(req.body)
  await item.create(new_items).catch(err => console.log('Caught:', err.message))
  res.redirect('/items')
})

app.post('/items/:name', async (req,res) => {
  const query = { name : req.params.name }
  const update_item = await item.findOneAndUpdate(query,{$set :{ price : req.body}}).catch(err => console.log('Caught:', err.message))
  res.redirect('/items')
})

app.get('/vehicle',async (req,res) => {
  const vehicle = await vehicle.find().catch(err => console.log('Caught:', err.message))
  res.json(vehicle)
})

app.get('/vehicle/:registration_number', async (req,res) => {
  const requested_vehicle = await vehicle.find({registration_number : req.params.registration_number}).catch(err => console.log('Caught:', err.message))
  res.json(requested_vehicle)
})

app.post('/vehicle', async (req,res) => {
  const new_vehicles = new Vehicle(req.body)
  await vehicle.create(new_vehicles).catch(err => console.log('Caught:', err.message))
  res.redirect('/vehicles')
})

app.post('/vehicle/:registration_number', async (req,res) => {
  const query = {registration_number : req.params.registration_number}
  const update_vehicle = await vehicle.findOneAndUpdate(query,{$set:{city: req.body.city}}).catch(err => console.log('Caught:', err.message))
  res.redirect('/vehicles')
})

app.post('/order',async(req,res) => {
  const ordered_customer = await customer.find({_id : req.body.customer_id}).catch(err => console.log('Caught:', err.message))
  const assign_vehicle = await vehicle.findOne({city : ordered_customer.city},{active_order_count : {$lt : 2}}).catch(err => console.log('Caught:', err.message))
  if (assign_vehicle instanceof vehicle) {
    const place_order = new order(req.body)
    const update_vehicle = await vehicle.findOneAndUpdate({_id : assign_vehicle._id},{$inc:{active_order_count : +1}}).catch(err => console.log('Caught:', err.message))
    res.json({message: 'Order Success'})
  } else {
    res.json({message: 'Order Failed'})
  }
})

app.post('/delivered',async(req,res) => {
  const query = {order_number : req.body}
  const delivered_order = await order.findOneAndUpdate(query,{ is_delivered : true})
  const update_vehicle = await vehicle.findOneAndUpdate({_id : delivered_order.vehicle_id},{$inc:{active_order_count : -1}})
  res.json({message : 'Updated'})
})
