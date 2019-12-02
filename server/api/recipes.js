const axios = require('axios')
const {Fridge, User, Item} = require('../db/models')
const {
  edamamRecipeAPIKEY,
  edamamRecipeAPIID,
  spoonacularAPIKEY
} = require('../../secrets')
const router = require('express').Router()

const getRecipes = async itemsArray => {
  let searchString = ''
  itemsArray.forEach(currentItem => {
    currentItem = currentItem.name.split(' ').join('+')
    searchString += currentItem + ',+'
  })
  searchString = searchString.slice(0, -2)
  console.log(searchString)

  // make API call to retrieve recipes from user's ingredients
  const {data} = await axios.get(
    `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${searchString}&number=5&apiKey=${spoonacularAPIKEY}`
  )

  // `https://api.edamam.com/search?q=${searchString}&app_id=${edamamRecipeAPIID}&app_key=${edamamRecipeAPIKEY}&from=0&to=5`
  // console.log('DATA RETURNED FROM SPOONACULAR ====>', data)
  return data
}

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
    let recipes = await getRecipes(items)
    res.send(recipes)
  } catch (error) {
    next(error)
  }
})

// Updating list of recipes based off of user's filtered ingredients
router.put('/filtered', async (req, res, next) => {
  try {
    const filteredItems = req.body
    let recipes = await getRecipes(filteredItems)
    res.send(recipes)
  } catch (error) {
    next(error)
  }
})

module.exports = router
