const db = require('../db')
const Sequelize = require('sequelize')

const Allergy = db.define('allergy', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Allergy
