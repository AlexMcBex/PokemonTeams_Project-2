# POKEMON TEAMS

## Overview
Pokemon Teams is a full-stack application Inspired by my love for pixel art and the Pokemon franchise. It allows the users to browse several informations on over 800 Pokemons (getting them from the [PokeAPI](https://pokeapi.co)) and, once logged in with their account, make their own teams using the informations they found.
The User should also be able to make lists of his favorite pokemons.

## Technologies used
- HTML5
- CSS
- Node JS
- Javascript
- Express
- Mongo DB
- Mongoose
- Bcryptjs
- Liquid Express Views
- Postman
- Axios

## Sources used
- [PokeAPI](https://pokeapi.co)
- [Bootstrap](https://getbootstrap.com/docs/5.3/getting-started/introduction/)

## Objectives
- [x] Made the app functional with all the routes correctly working
- [x] Allowed users to sign up, login and logout of the site
- [x] Incorporated [PokeAPI](https://pokeapi.co)
- [ ] Users can export their trainers cards out of the app
- [ ] Deploy the app online

## User Stories
- As a user I would like to be able to search for any pokemon 
- As a user I would like to filter the pokemons to visualize
- As a user I would like to choose what moves a pokemon should have
- As a user I would like to have a dynamic interface based on the different kinds of pokemon
- As a user I would like to make a card out of my trainer infos visible outside of the app too

## Routes Table

### Pokemons

| **URL** | **HTTP Verb** | **Action** |
|------|---------------|---------|
| /pokemon/ | GET | index   |
| /pokemon/:pokemonId |  GET | show   |
| /pokemon/Dex | GET | index   |
| /pokemon/Dex/:pokemonName |  GET | show   |
| /pokemon/Dex/:pokemonId |  GET | show   |
| /pokemon/ |  POST |  create |
| /pokemon/:pokemonId | DELETE  |  destroy |

### Trainers
| **URL** | **HTTP Verb** | **Action** |
|------|---------------|---------|
| /team | GET | index   |
| /team/:teamId |  GET | show   |
| /team/new|  GET |  new     |
| /team  |  POST |  create |
| /team/:teamId/edit | GET |  edit      |
| /team/:teamId/addPokemon/:pokemonId| PATCH/PUT |  update |
| /team/:teamId | DELETE  |  destroy |

### Profile
| **URL** | **HTTP Verb** | **Action** |
|------|---------------|---------|
| /profile | GET | index   |

### Users
| **URL**          | **HTTP Verb**|**Action**|
|------------------|--------------|----------|
| /auth/signup    | POST         | create  
| /auth/login     | POST         | create       
| /auth/logout    | DELETE       | destroy  


## Entity Relationship Diagram
![entityRelationshipDiagram](/img/ERD.png)

## Wireframe
INDEX- Pokemon
![HomePage](/img/home.png)

Profile Page
![Profile](/img/profile.png)

Pokedex
![Pokedex](/img/pokedex.png)

Show - Pokemon
![ShowPokemon](/img/show.png)

Show - Team
![ShowTeam](/img/showteam.png)

Index teams
![teams](/img/teams.png)
