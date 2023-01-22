#POKEMON TEAMS

##Overview
Pokemon Teams is a full-stack application Inspired by my love for pixel art and the Pokemon franchise. It allows the users to browse several informations on over 800 Pokemons (getting them from the PokeAPI) and, once logged in with their account, make their own teams using the informations they found.
The User should also be able to make lists of his favorite pokemons and select his avatar from a list of trainers avatars (choosing it from the trainer sprites avaiable on [bulbagarden.net](https://archives.bulbagarden.net))

##Technologies used
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

##Sources used
- [PokeAPI](https://pokeapi.co)
- [Bulbagarden Archives](https://archives.bulbagarden.net/wiki/Category:Generation_III_Trainer_sprites)

##Objectives
- [ ] Made the app functional with all the routes correctly working
- [ ] Allowed users to sign up, login and logout of the site
- [ ] Incorporated [PokeAPI](https://pokeapi.co)
- [ ] Users can export their trainers cards out of the app
- [ ] Deploy the app online

##User Stories
- As a user I would like to be able to search for any pokemon 
- As a user I would like to filter the pokemons to visualize
- As a user I would like to choose what moves a pokemon should have
- As a user I would like to have a dynamic interface based on the different kinds of pokemon
- As a user I would like to make a card out of my trainer infos visible outsidde of the app too

##Routes Table

###Pokemons

| **URL** | **HTTP Verb** | **Action** |
|------|---------------|---------|
| URL | GET | index   |
| URL |  GET | show   |
| URL |  GET |  new     |
| URL |  POST |  create |
| URL | GET |  edit      |
| URL | PATCH/PUT |  update |
| URL | DELETE  |  destroy |

###Trainers

###Users
| **URL**          | **HTTP Verb**|**Action**|
|------------------|--------------|----------|
| /users/signup    | POST         | create  
| /users/login     | POST         | create       
| /users/logout    | DELETE       | destroy  


##Entity Relationship Diagram
![entityRelationshipDiagram](/img/ERD.png)

##Wireframe
INDEX- Pokemon
![indexPokemon](/img/index-pkmn.jpg)

Show - Pokemon
![ShowPokemon](/img/show-pkmn.jpg)

Index - Teams
![IndexTeams](/img/index-teams.jpg)

Show - Teams
![ShowTeams](/img//show-team.jpg)

