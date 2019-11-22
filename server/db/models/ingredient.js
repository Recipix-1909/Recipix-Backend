const Sequelize = require('sequelize')
const db = require('../db')

const Ingredient = db.define('ingredient', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  imageUrl: {
    type: Sequelize.STRING,
    defaultValue:
      'https://www.pinclipart.com/picdir/middle/382-3829338_cauliflower-broccoli-vegetable-broccoli-cartoon-png-clipart.png'
  },
  serialNum: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
})

module.exports = Ingredient
