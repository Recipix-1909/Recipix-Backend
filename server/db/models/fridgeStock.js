const Sequelize = require('sequelize')
const db = require('../db')

const FridgeStock = db.define({
  expirationDate: {
    type: Sequelize.DATE,
    validation: {
      isDate: true,
      isAfter: new Date()
    }
  }
})

module.exports = FridgeStock
