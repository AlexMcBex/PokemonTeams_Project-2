// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const pokemonSchema = new Schema(
	{
		name: { type: String, required: true },
		type1: { type: String, required: true },
		type2: { type: String },
        level: { type: Number, required: true },
		canEvolve: { type: Boolean  },
		sprite: {type: String },
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		},
		team: {
			type: Schema.Types.ObjectID,
			ref: 'Team',
		}
	},
	{ timestamps: true }
)

const Pokemon = model('Pokemon', pokemonSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Pokemon
