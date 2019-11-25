const Sequelize = require('sequelize')
const db = require('../db')

// unsure how to initial expiration date here - it isn't required but we've been advised defaulting to null is bad practice

const FridgeStock = db.define('fridge_stock', {
  expirationDate: {
    type: Sequelize.DATE,
    allowNull: true,
    validation: {
      isDate: true,
      isAfter: new Date()
    }
  }
})

module.exports = FridgeStock
