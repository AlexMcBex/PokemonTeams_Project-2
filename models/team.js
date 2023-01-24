// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const teamSchema = new Schema(
	{
		name: { type: String, required: true },
		sprite: { type: String },
		pokemon1: {type: String, required: true},
		pokemon2: {type: String},
		pokemon3: {type: String},
		pokemon4: {type: String},
		pokemon5: {type: String},
		pokemon6: {type: String},
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		},
        // pokemons: [pokemonSchema],
	},
	{ timestamps: true }
)

const Team = model('Team', teamSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Team
