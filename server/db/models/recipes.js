const Sequelize = require('sequelize')
const db = require('../db')

const Recipe = db.define('recipe', {
  name:{
    type: Sequelize.STRING,
    allowNull: false
  },
  ingredients:{
    type: Sequelize.JSON
  },
  image:{
    type: Sequelize.STRING
  },
  data:{
    type: Sequelize.JSON
  }
})


module.exports = Recipe
