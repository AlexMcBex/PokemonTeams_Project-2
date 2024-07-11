////////////// Import Dependencies ////////////
const express = require('express')
const Pokemon = require('../models/pokemon')
const Team = require('../models/team')
const axios = require('axios')
require('dotenv').config()

////////////// Create router ////////////////////////
const router = express.Router()

////////////// Routes////////////////////////

// INDEX - Show created instances of pokemons - GET  - OBSOLETE?
router.get('/', (req, res) => {
	Pokemon.find({})
		.then(async pokemons => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			res.render('pokemon/index', { pokemons, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})


//////////////////////////// Authorization middleware///////////////////////////////////
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
// ROUTES BELOW HERE REQUIRE LOGGEDIN////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////


// INDEX - MINE - shows pokemon instances created by user
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

// GET PICK TEAM - choose what user's team add the pokemon({:pokemonName}) to
router.get('/addToTeam/:pokemonName', async (req, res) => {
	const pokemonName = req.params.pokemonName.toLowerCase()
	const pokemonInfo = await axios(`${process.env.POKEAPI_URL}/pokemon/${pokemonName}`)
	const pokemonData = pokemonInfo.data
	const { username, loggedIn, userId } = req.session
	Team.find({ owner: userId })
		.populate('pokemons')
		.populate('pokemons.name')
		.populate('owner')
		.populate('owner.username', '-password')
		.then(teams => {
			res.render('pokemon/addToTeam', { username, pokemonData, pokemonName, loggedIn, userId, teams })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// SHOW - Show pokemon instance in a team - OBSOLETE?
router.get('/:teamId/:id', async (req, res) => {
	const teamId = req.params.teamId
	const pokemonId = req.params.id
	Pokemon.findById(pokemonId)
		.populate('owner')
		.populate('owner.username', '-password')
		.then(async pokemon => {
			const pokemonName = pokemon.name.toLowerCase()
			const pokemonInfo = await axios(`${process.env.POKEAPI_URL}/pokemon/${pokemonName}`)
			const pokemonData = pokemonInfo.data
			const { username, loggedIn, userId } = req.session
			res.render('pokemon/show', { pokemon, username, pokemonData, loggedIn, userId, teamId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
			console.log(error)
		})
})

// SHOW - show pokemon instance
router.get('/:id', async (req, res) => {
	const pokemonId = req.params.id
	Pokemon.findById(pokemonId)
		.populate('owner')
		.populate('owner.username', '-password')
		.then(async pokemon => {
			const pokemonName = pokemon.name.toLowerCase()
			const pokemonInfo = await axios(`${process.env.POKEAPI_URL}/pokemon/${pokemonName}`)
			const pokemonData = pokemonInfo.data
			const { username, loggedIn, userId } = req.session
			res.render('pokemon/show', { pokemon, username, pokemonData, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
			console.log(error)
		})
})

// POST - Create a new instance of a pokemon
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

// delete route
router.delete('/:id', (req, res) => {
	const pokemonId = req.params.id
	Pokemon.findByIdAndRemove(pokemonId)
		.then(pokemon => {
			res.redirect('/pokemon/mine')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete in team route
router.delete('/:team/:id', (req, res) => {
	const teamId = req.params.team
	const pokemonId = req.params.id
	Pokemon.findByIdAndRemove(pokemonId)
		.then(pokemon => {
			res.redirect(`/team/${teamId}`)
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router
