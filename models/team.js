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
		ready: { type: Boolean, required: true },
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
