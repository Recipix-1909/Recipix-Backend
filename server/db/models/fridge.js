const db = require('../db')
const Sequelize = require('sequelize')

const Fridge = db.define('fridge', {
  // name: {
  //   type: Sequelize.STRING
  // }
})

module.exports = Fridge
