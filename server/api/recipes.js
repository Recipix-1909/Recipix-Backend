const axios = require('axios')
const {Fridge, User, Item} = require('../db/models')
const {edamamRecipeAPIKEY, edamamRecipeAPIID} = require('../../secrets')
const router = require('express').Router()

router.get('/:userId', async (req, res, next) => {
  try {
    console.log('WE ARE INSIDE OF THE ROUTE PART 1')
    const user = await User.getFridgeId(req.params.userId)
    // get user's ingredients
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

    console.log('WE ARE INSIDE OF THE ROUTE PART 2')
    const items = fridgeItems.items
    let searchString = ''
    items.forEach(currentItem => {
      currentItem = currentItem.name.split(' ').join('+')
      searchString += currentItem + '+'
    })
    searchString = searchString.slice(0, -1)
    console.log('WE ARE INSIDE OF THE ROUTE PART 3')
    const {data} = await axios.get(
      `https://api.edamam.com/search?q=${searchString}&app_id=${edamamRecipeAPIID}&app_key=${edamamRecipeAPIKEY}&from=0&to=5`
    )
    // console.log(searchString)
    console.log('THIS IS DATA ROUTE', data)

    res.send(data.hits)

    // make API call to retrieve recipes from user's ingredients
  } catch (error) {
    next(error)
  }
})

module.exports = router
