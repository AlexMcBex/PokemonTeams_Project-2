// Import Dependencies
const express = require('express')
const Team = require('../models/team')
const axios = require('axios')
const Pokemon = require('../models/pokemon')

// Create router
const router = express.Router()

// Routes

// index ALL
router.get('/', (req, res) => {
	Team.find({})
	
	.populate('owner')
	.populate('owner.username', '-password')
			
	.populate('pokemons')
	.populate('pokemons.name')
		.then(teams => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			res.render('team/index', { teams, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})



///////////////////// Router Middleware//////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////

// index that shows only the user's team
router.get('/mine', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	Team.find({ owner: userId })
		.then(teams => {
			res.render('team/index', { teams, username, loggedIn })
			.catch(err =>{
				res.sendStatus(404)
				console.log(err)
			})
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('team/new', { ...req.session })
})

// show route
router.get('/:id', (req, res) => {
	const teamId = req.params.id
	Team.findById(teamId)
		.populate('pokemons')
		.populate('owner')
		.populate('owner.username', '-password')

		.then(team => {
			const {username, loggedIn, userId} = req.session
			res.render('team/show', { team, username, loggedIn, userId })
			// console.log(team.pokemons)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})



// GET - add pokemon to the team
router.get('/:id/addPokemon/', async (req, res) => {		
			const offset = req.query.offset
			const limit = req.query.limit
			const teamId = req.params.id
			const pokemonInfo = await axios(`${process.env.POKEAPI_URL}/pokemon/?offset=${offset}&limit=${limit}`)
			const pokemonData = pokemonInfo.data.results
			const limitNum = Number(limit)
			const offNum = Number(offset)
			const pokemonNext = ( offNum + limitNum)
			const firstlist = (offNum + 1)
			const pokemonPre = (offNum - limitNum)
			Team.findById(teamId)
			.then(team =>{
				res.render('team/addpkmn', { pokemonData, teamId, team, offNum, firstlist,  pokemonNext, pokemonPre,   ...req.session })
			}
			)
			.catch(err =>{
			res.redirect(`/error?error=${err}`)
			})
		})


		// GET - add pokemon to the team
		router.get('/:teamId/addPokemon/type/', async (req, res) => {		
			const teamId = req.params.teamId
			const typeInfo = await axios(`${process.env.POKEAPI_URL}/type/`)
			const typeData = typeInfo.data.results
			Team.findById(teamId)
			.then(team =>{
				res.render('team/typeSelect', { typeData, teamId, team, ...req.session })
			}
			)
			.catch(err =>{
			res.redirect(`/error?error=${err}`)
			})
		})
		

		// GET - add pokemon to the team
router.get('/:teamId/addPokemon/type/:typeName/', async (req, res) => {		
	const typeName = req.params.typeName
	const offset = req.query.offset
	const limit = req.query.limit
	const teamId = req.params.teamId
	const pokemonInfo = await axios(`${process.env.POKEAPI_URL}/type/${typeName}?offset=${offset}&limit=${limit}`)
	const pokemonData = pokemonInfo.data.pokemon
	const limitNum = Number(limit)
	const offNum = Number(offset)
	const pokemonNext = ( offNum + limitNum)
	const firstlist = (offNum + 1)
	const pokemonPre = (offNum - limitNum)
	Team.findById(teamId)
	.then(team =>{
		res.render('team/addByType', { pokemonData, teamId, team, offNum, firstlist,  pokemonNext, typeName, pokemonPre,   ...req.session })
	}
	)
	.catch(err =>{
	res.redirect(`/error?error=${err}`)
	})
})

// GET - Team, add pokemon, filter by region
router.get('/:teamId/region', (req, res) => {
	const teamId = req.params.teamId
	res.render('team/regionSelect', { teamId, ...req.session })
})

		//POST - update team with new pokemon
router.get('/:teamid/addPokemon/:pkmnname', async (req, res)=> {
	const pokemonName = req.params.pkmnname
	const pokemonInfo = await axios(`${process.env.POKEAPI_URL}/pokemon/${pokemonName}`)
	const pokemonData = pokemonInfo.data
	const teamId = req.params.teamid
	req.body.owner = req.session.userId
	req.body.name = pokemonName
	req.body.type1 = pokemonData.types[0].type.name
	if (pokemonData.types.length == 1){
		req.body.type2 = " "
	} else {
		req.body.type2 = pokemonData.types[1].type.name
	}
	req.body.sprite = pokemonData.sprites.front_default
	req.body.team = teamId
	const newPokemon = req.body
	Pokemon.create(newPokemon) 
	.then(pokemon =>{
		Team.findById(teamId)
		.populate('pokemons')
		.populate('pokemons.name')
		.then(team =>{
			team.pokemons.push(pokemon) 
			return team.save()
		})
		.then( team=>{
		res.redirect(`/team/${team.id}`) 
		})
	}
	)
	.catch(err =>{
		res.redirect(`/error?error=${err}`)
		})
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	req.body.owner = req.session.userId
	Team.create(req.body)
		.then(team => {
			console.log('this was returned from create', team)
			res.redirect(`/team/${team.id}`)
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const teamId = req.params.id
	Team.findById(teamId)
		.then(team => {
			res.render('team/edit', { team, ...req.session })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put('/:id', (req, res) => {
	const teamId = req.params.id
	Team.findByIdAndUpdate(teamId, req.body, { new: true })
		.then(team => {
			res.redirect(`/team/${team.id}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete route
router.delete('/:id', (req, res) => {
	const teamId = req.params.id
	Team.findByIdAndRemove(teamId)
		.then(team => {
			res.redirect('/profile')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router
