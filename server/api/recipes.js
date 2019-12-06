const axios = require('axios')
const {Fridge, User, Item} = require('../db/models')
const spoonacularAPIKEY = process.env.spoonacularAPIKEY

const router = require('express').Router()

const getRecipes = async itemsArray => {
  // const diets = await Diet.findByPk(req.body.userId)

  let searchString = ''
  itemsArray.forEach(currentItem => {
    currentItem = currentItem.name.split(' ').join('+')
    searchString += currentItem + ',+'
  })
  searchString = searchString.slice(0, -2)
  console.log(searchString)

  // let diet ='';

  // make API call to retrieve recipes from user's ingredients
  const {data} = await axios.get(
    `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${searchString}&number=5&apiKey=${spoonacularAPIKEY}`
  )
  return data
}

router.get('/singleRecipe/:recipeId', async (req, res, next) => {
  try {
    console.log('this is req.params ----------------->', req.params)
    const {data} = await axios.get(
      `https://api.spoonacular.com/recipes/${
        req.params.recipeId
      }/analyzedInstructions?apiKey=${spoonacularAPIKEY}`
    )
    res.send(data)
  } catch (error) {
    next(error)
  }
})

router.get('/:userId', async (req, res, next) => {
  try {
    console.log(req.user.id)
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
    console.log(req.user.id)
    const filteredItems = req.body
    let recipes = await getRecipes(filteredItems)
    res.send(recipes)
  } catch (error) {
    next(error)
  }
})

module.exports = router
