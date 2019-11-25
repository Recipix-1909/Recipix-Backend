const Sequelize = require('sequelize')
const db = require('../db')
// NEED TO REMOVE OR YOU'RE FIRED
const edamamFoodAPIID = '37b35021'
const edamamFoodAPIKEY = '9e2da62ea38257ecb31bcc95678117ff'
const axios = require('axios')

const Item = db.define('item', {
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
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
})

Item.getItem = async function(serialNum) {
  console.log('this is serialNum!!!!!!!!!!!!!!!', serialNum)
  let item = await Item.findOne({
    where: {
      serialNum: serialNum
    }
  })

  if (item) return item
  else {
    // API call to Edamam
    const {data} = await axios.get(
      `https://api.edamam.com/api/food-database/parser?upc=${serialNum}&app_id=${edamamFoodAPIID}&app_key=${edamamFoodAPIKEY}`
    )
    console.log('this is data!!!!!!!!!!!!!!!!!!!', data)
    const edamamItem = {
      name: data.hints[0].food.label,
      serialNum: data.text.slice(4),
      imageUrl: data.hints[0].food.image
    }
    let newItem = await Item.create(edamamItem)
    return newItem
  }
}

module.exports = Item
