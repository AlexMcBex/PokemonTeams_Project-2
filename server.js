////////////////////
//  Dependencies  //
////////////////////
require("dotenv").config() // make env variables available
const express = require("express")
const middleware = require('./utils/middleware')
const UserRouter = require('./controllers/user')
const User = require("./models/user")
const TeamRouter = require('./controllers/teamRoute')
const Team = require('./models/team')
const PokemonRouter = require('./controllers/pokemonRoute')
const ProfileRouter = require('./controllers/profileRoute')
const Pokemon = require('./models/pokemon')
// SEE MORE DEPENDENCIES IN ./utils/middleware.js
// user and resource routes linked in ./utils/middleware.js

//////////////////////////////
// Middleware + App Object  //
//////////////////////////////
const app = require("liquid-express-views")(express())

middleware(app)

////////////////////
//    Routes      //
////////////////////

app.use('/auth', UserRouter)
app.use('/pokemon', PokemonRouter)
app.use('/team', TeamRouter)
app.use('/profile', ProfileRouter)

app.get('/health', (req, res) => {
	res.status(200).send('OK')
})



app.get('/', (req, res) => {
    const { username, userId, loggedIn } = req.session
	res.render('index.liquid', { loggedIn, username, userId })
})

app.get('/error', (req, res) => {
	const error = req.query.error || 'This Page Does Not Exist'
    const { username, loggedIn, userId } = req.session
	res.render('error.liquid', { error, username, loggedIn, userId })
})

// if page is not found, send to error page
app.all('*', (req, res) => {
	res.redirect('/error')
})



//////////////////////////////
//      App Listener        //
//////////////////////////////
app.listen(process.env.PORT, () => {
    console.log(`[listening to PORT: ${process.env.PORT}] \n< CTRL+C > TO CLOSE SERVER`)
})