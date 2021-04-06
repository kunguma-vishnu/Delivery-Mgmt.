const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


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
app.use(bodyParser.urlencoded({ extended: false }))


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
  //console.log(req.body);
  const new_items = new item(req.body)
  await item.create(new_items).catch(err => console.log('Caught:', err.message))
  res.redirect('/items')
})

app.post('/items/:name', async (req,res) => {
  const query = { name : req.params.name }
  const update_item = await item.updateOne(query,{$set :{ price : req.body.price}}).catch(err => console.log('Caught:', err.message))
  res.redirect('/items')
})

app.get('/customers', async (req,res) => {
  const customers = await customer.find().catch(err => console.log('Caught:', err.message))
  res.json(customers)
})

app.get('/customers/:customer_id',async (req,res) => {
  const target_customer = await customer.findOne({_id : req.params.customer_id}).catch(err => console.log('Caught:', err.message))
  res.json(target_customer)
})

app.post('/customers', async (req,res) => {
  const new_customers = new customer(req.body)
  await customer.create(new_customers).catch(err => console.log('Caught:', err.message))
  res.redirect('/customers')
})

app.post('/customers/:customer_id', async(req,res) => {
  const query = {_id : req.params.customer_id}
  const updated_customer_details = await customer.updateOne(query,{$set:{name: req.body.name, city: req.body.city}}).catch(err => console.log('Caught:', err.message))
  res.redirect('/customers')
})

app.get('/vehicles',async (req,res) => {
  const vehicles = await vehicle.find().catch(err => console.log('Caught:', err.message))
  res.json(vehicles)
})

app.get('/vehicles/:registration_number', async (req,res) => {
  const requested_vehicle = await vehicle.find({registration_number : req.params.registration_number}).catch(err => console.log('Caught:', err.message))
  res.json(requested_vehicle)
})

app.post('/vehicles', (req,res) => {
  const new_vehicles = new vehicle(req.body)
  vehicle.create(new_vehicles).catch(err => console.log('Caught:', err.message))
  res.redirect('/vehicles')
})

app.post('/vehicles/:registration_number', async (req,res) => {
  const query = {registration_number : req.params.registration_number}
  const update_vehicle = await vehicle.updateOne(query,{$set:{city: req.body.city}}).catch(err => console.log('Caught:', err.message))
  res.redirect('/vehicles')
})

app.get('/order',async(req,res) => {
  const all_orders = await order.find().catch(err => console.log('Caught:', err.message))
  res.json(all_orders)
})

app.post('/order',async(req,res) => {
  const ordered_customer = await customer.findOne({_id : req.body.customer_id}).catch(err => console.log('Caught:', err.message))
  //console.log(ordered_customer);
  const assign_vehicle = await vehicle.findOne({city : ordered_customer.city,active_order_count : {$lt : 2}}).catch(err => console.log('Caught:', err.message))
  //console.log(await vehicle.findOne({_id: assign_vehicle._id}));
  if (assign_vehicle instanceof vehicle) {
    const place_order = new order({
      item_id : req.body.item_id,
      customer_id : req.body.customer_id,
      vehicle_id : assign_vehicle._id
    })
    await order.create(place_order).catch(err => console.log('Caught:', err.message))
    const update_vehicle = await vehicle.updateOne({_id : assign_vehicle._id},{$inc:{active_order_count : +1}}).catch(err => console.log('Caught:', err.message))
    res.json({message: 'Order Success'})
  } else {
    res.json({message: 'Order Failed'})
  }
})

app.post('/order/:order_id',async(req,res) => {
  const query = {order_id : req.params.order_id}
  //console.log(query);
  const update_delivery = await order.updateOne(query,{ is_delivered : true}).catch(err => console.log('Caught:', err.message))
  //console.log(delivered_order);
  const delivered_order = await order.findOne(query).catch(err => console.log('Caught:', err.message))
  const update_vehicle = await vehicle.updateOne({_id : delivered_order.vehicle_id},{$inc:{active_order_count : -1}}).catch(err => console.log('Caught:', err.message))
  res.json({message : 'Updated'})
})
