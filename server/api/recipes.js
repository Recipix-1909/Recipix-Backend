const axios = require('axios')
const {Fridge, User, Item} = require('../db/models')
const {
  edamamRecipeAPIKEY,
  edamamRecipeAPIID,
  spoonacularAPIKEY
} = require('../../secrets')
const router = require('express').Router()

router.get('/:userId', async (req, res, next) => {
  try {
    const user = await User.getFridgeId(req.params.userId)
    const fridgeItems = await Fridge.findOne({
      where: {
        id: user.fridgeId
      },
      include: [
        {
          model: Item
        }
      ]
    })
    const items = fridgeItems.items
    let searchString = ''
    items.forEach(currentItem => {
      currentItem = currentItem.name.split(' ').join('+')
      searchString += currentItem + ',+'
    })
    searchString = searchString.slice(0, -2)
    console.log(searchString)

    const {data} = await axios.get(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${searchString}&number=5&apiKey=${spoonacularAPIKEY}`
    )
    res.send(data)

    // make API call to retrieve recipes from user's ingredients
  } catch (error) {
    next(error)
  }
})

module.exports = router
