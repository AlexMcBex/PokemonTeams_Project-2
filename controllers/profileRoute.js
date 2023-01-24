// Import Dependencies
const express = require('express')
const Example = require('../models/example')
const Pokemon = require('../models/pokemon')
const Team = require('../models/team')
const TeamRouter = require('./teamRoute')
const PokemonRouter = require('./pokemonRoute')
const axios = require('axios')

// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
router.use((req, res, next) => {
	// checking the loggedIn boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/auth/login')
	}
})

// Routes

// index ALL
router.get('/', (req, res) => {
	Example.find({})
    const { username, userId, loggedIn } = req.session
	Pokemon.find({ owner: userId })
		.then(pokemons => {
			res.render('profile/profile', { pokemons, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router
