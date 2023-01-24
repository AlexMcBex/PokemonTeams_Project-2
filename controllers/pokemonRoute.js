// Import Dependencies
const express = require('express')
const Pokemon = require('../models/pokemon')
const axios = require('axios')
require('dotenv').config()

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
	Pokemon.find({})
		.then(pokemons => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			
			res.render('pokemon/index', { pokemons, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// index that shows only the user's pokemon
router.get('/mine', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	Pokemon.find({ owner: userId })
		.then(pokemons => {
			res.render('pokemon/index', { pokemons, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('pokemon/new', { username, loggedIn })
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	req.body.ready = req.body.ready === 'on' ? true : false
	req.body.owner = req.session.userId
	Pokemon.create(req.body)
		.then(pokemon => {
			console.log('this was returned from create', pokemon)
			res.redirect('/pokemon')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const { username, userId, loggedIn } = req.session
	const pokemonId = req.params.id
	Pokemon.findById(pokemonId)
		.then(pokemon => {
			res.render('pokemon/edit', { pokemon, ...req.session })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put('/:id/edit', (req, res) => {
	const pokemonId = req.params.id
	Pokemon.findByIdAndUpdate(pokemonId, req.body, { new: true })
		.then(pokemon => {
			res.redirect(`/pokemon/${pokemonId}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// show route
router.get('/:id', (req, res) => {
	const pokemonId = req.params.id
	Pokemon.findById(pokemonId)
		.then(pokemon => {
            const {username, loggedIn, userId} = req.session
			res.render('pokemon/show', { pokemon, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete route
router.delete('/:id', (req, res) => {
	const pokemonId = req.params.id
	Pokemon.findByIdAndRemove(pokemonId)
		.then(pokemon => {
			res.redirect('/pokemon')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router
