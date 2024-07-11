////////////// Import Dependencies ////////////
const express = require('express')
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
	res.render('pokedex/index', { pokemonData, offNum, offNum, firstlist, pokemonNext, pokemonPre, ...req.session })
})

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
	res.render('pokedex/search', { nameTBF, nameLow, indexes, filtered, pokemonData, ...req.session })
})

// POKEDEX - Filter Pokemons by Type
router.get('/type/', async (req, res) => {
	const typeInfo = await axios(`${process.env.POKEAPI_URL}/type/`)
	const typeData = typeInfo.data.results
	res.render('pokedex/typeSelect', { typeData, ...req.session })
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
	res.render('pokedex/typeDex', { pokemonData, offNum, firstlist, pokemonNext, typeName, pokemonPre, ...req.session })
}
)

// POKEDEX - pick filter by region
router.get('/region/', (req, res) => {
	res.render('pokedex/regionSelect', { ...req.session })
})


//POKEDEX - Search by Name results
router.get('/:name', async (req, res) => {
	const pokemonName = req.params.name.toLowerCase()
	const pokemonInfo = await axios(`${process.env.POKEAPI_URL}/pokemon/${pokemonName}`)
	const pokemonData = pokemonInfo.data
	pokemonPre = pokemonData.id - 1
	pokemonNext = pokemonData.id + 1
	const { username, loggedIn, userId } = req.session
	res.render('pokedex/show', { username, pokemonData, pokemonPre, pokemonNext, loggedIn, userId })
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
	res.render('pokedex/show', { username, pokemonData, pokemonPre, pokemonNext, loggedIn, userId })
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


// Export the Router
module.exports = router
