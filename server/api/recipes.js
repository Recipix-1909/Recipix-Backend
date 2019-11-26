const axios = require('axios')
const {Fridge, User, Item} = require('../db/models')
const {edamamRecipeAPIKEY, edamamRecipeAPIID} = require('../../secrets')
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
      searchString += currentItem + '+'
    })
    searchString = searchString.slice(0, -1)

    const {data} = await axios.get(
      `https://api.edamam.com/search?q=${searchString}&app_id=${edamamRecipeAPIID}&app_key=${edamamRecipeAPIKEY}&from=0&to=5`
    )

    res.json(data)

    // make API call to retrieve recipes from user's ingredients
  } catch (error) {
    next(error)
  }
})

module.exports = router
