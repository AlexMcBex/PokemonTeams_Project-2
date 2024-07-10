////////////// Import Dependencies ////////////
const express = require('express')
const Pokemon = require('../models/pokemon')
const Team = require('../models/team')
const axios = require('axios')
require('dotenv').config()

////////////// Create router ////////////////////////
const router = express.Router()

////////////// Routes////////////////////////

// INDEX - Show created instances of pokemons 
router.get('/', async(req, res) => {
	const offset = req.query.offset
	let limit = req.query.limit
	const limitNum = Number(limit)
	const offNum = Number(offset)
	const pokemonNext = (offNum + limitNum)
	const firstlist = (offNum + 1)
	let pokemonPre = (offNum - limitNum)
	if (offset == 1269) {
		limit = 3
		pokemonPre = 1243
	}
	const pokemonInfo = await axios(`${process.env.POKEAPI_URL}/pokemon/?offset=${offset}&limit=${limit}`)
	const pokemonData = pokemonInfo.data.results
	// console.log(pokemonData)
	res.render('pokemon/Dex', { pokemonData, offNum, offNum, firstlist, pokemonNext, pokemonPre, ...req.session })
})

// // POKEDEX INDEX - Show all pokemons - GET
// router.get('/Dex/', async (req, res, pkmn) => {
	
// })

// POKEDEX SEARCH -> Search in Pokedex by name
router.get('/search', async (req, res, pkmn) => {
	const nameTBF = req.query.name
	const nameLow = nameTBF.toLowerCase()
	const pokemonInfo = await axios(`${process.env.POKEAPI_URL}/pokemon/?offset=0&limit=1500`)
	const pokemonData = pokemonInfo.data.results
	let filtered = []
	let indexes = []
	for (let i = 0; i < pokemonData.length; i++) {
		if (pokemonData[i].name.includes(nameLow)) {
			filtered.push(pokemonData[i])
			if ((pokemonData.indexOf(pokemonData[i]) + 1) > 1024) {
				indexes.push((pokemonData.indexOf(pokemonData[i]) + 8976))
			} else {
				indexes.push((pokemonData.indexOf(pokemonData[i]) + 1))
			}
		}
	}
	console.log(nameLow)
	res.render('pokemon/DexSearch', { nameTBF, nameLow, indexes, filtered, pokemonData, ...req.session })
})

// POKEDEX - Filter Pokemons by Type
router.get('/type/', async (req, res) => {
	const typeInfo = await axios(`${process.env.POKEAPI_URL}/type/`)
	const typeData = typeInfo.data.results
	res.render('pokemon/typeSelect', { typeData, ...req.session })
})


// POKEDEX - Index of filtered pokemons
router.get('/type/:typeName/', async (req, res) => {
	const typeName = req.params.typeName
	const offset = req.query.offset
	const offNum = Number(offset)
	const limit = req.query.limit
	const limitNum = Number(limit)
	const pokemonInfo = await axios(`${process.env.POKEAPI_URL}/type/${typeName}?offset=${offset}&limit=${limit}`)
	const pokemonData = pokemonInfo.data.pokemon
	const pokemonNext = (offNum + limitNum)
	const firstlist = (offNum + 1)
	const pokemonPre = (offNum - limitNum)
	res.render('pokemon/typeDex', { pokemonData, offNum, firstlist, pokemonNext, typeName, pokemonPre, ...req.session })
}
)

// POKEDEX - pick filter by region
router.get('/region/', (req, res) => {
	res.render('pokemon/regionSelect', { ...req.session })
})


//POKEDEX - Search by Name results
router.get('/:name', async (req, res) => {
	const pokemonName = req.params.name.toLowerCase()
	const pokemonInfo = await axios(`${process.env.POKEAPI_URL}/pokemon/${pokemonName}`)
	const pokemonData = pokemonInfo.data
	pokemonPre = pokemonData.id - 1
	pokemonNext = pokemonData.id + 1
	const { username, loggedIn, userId } = req.session
	res.render('pokemon/DexShow', { username, pokemonData, pokemonPre, pokemonNext, loggedIn, userId })
})


// POKEDEX SHOW - show info of a pokemon from pokeAPI
router.get('/:id', async (req, res) => {
	const pokemonId = req.params.name.toLowerCase()
	const pokemonInfo = await axios(`${process.env.POKEAPI_URL}/pokemon/${pokemonId}`)
	const pokemonData = pokemonInfo.data
	pokemonPre = pokemonData.id - 1
	pokemonNext = pokemonData.id + 1
	// console.log(pokemonData)
	const { username, loggedIn, userId } = req.session
	res.render('pokemon/DexShow', { username, pokemonData, pokemonPre, pokemonNext, loggedIn, userId })
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

// // edit route -> GET that takes us to the edit form view- OBSOLETE
// router.get('/:id/edit', (req, res) => {
// 	// we need to get the id
// 	const { username, userId, loggedIn } = req.session
// 	const pokemonId = req.params.id
// 	Pokemon.findById(pokemonId)
// 		.then(pokemon => {
// 			res.render('pokemon/edit', { pokemon, ...req.session })
// 		})
// 		.catch((error) => {
// 			res.redirect(`/error?error=${error}`)
// 		})
// })

// // update route
// router.put('/:id/edit', (req, res) => {
// 	const pokemonId = req.params.id
// 	Pokemon.findByIdAndUpdate(pokemonId, req.body, { new: true })
// 		.then(pokemon => {
// 			res.redirect(`/pokemon/${pokemonId}`)
// 		})
// 		.catch((error) => {
// 			res.redirect(`/error?error=${error}`)
// 		})
// })

// // new route -> GET route that renders our page with the form - OBSOLETE
// router.get('/new', (req, res) => {
// 	const { username, userId, loggedIn } = req.session
// 	res.render('pokemon/new', { username, loggedIn })
// })

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

// // GET request -> edit route - OBSOLETE
// router.get('/:id/edit', (req, res) => {
// 	const pokemonId = req.params.id
// 	Pokemon.findById(pokemonId)
// 		.then(pokemon => {
// 			res.render('pokemon/edit', { pokemon, ...req.session })
// 		})
// 		.catch(err => {
// 			res.redirect(`/error?error=${err}`)
// 		})
// })

// // PUT route -> edit route
// router.put('/:id', (req, res) => {
// 	const id = req.params.id
// 	Pokemon.findById(id)
// 		.then(pokemon => {
// 			if (pokemon.owner == req.session.userId) {
// 				return pokemon.updateOne(req.body)
// 			} else {
// 				res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20edit%20this%20Pokemon`)
// 			}
// 		})
// 		.then(() => {
// 			res.redirect(`/pokemon/${id}`)
// 		})
// 		.catch(err => {
// 			console.log(err)
// 			res.redirect(`/error?error=${err}`)
// 		})
// })


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
