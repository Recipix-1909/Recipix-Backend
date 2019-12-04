const db = require('../db')
const Sequelize = require('sequelize')

const Diet = db.define('diet', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Diet
