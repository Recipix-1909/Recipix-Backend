const axios = require('axios')
const {Fridge, User, Item} = require('../db/models')
const spoonacularAPIKEY = process.env.spoonacularAPIKEY

const router = require('express').Router()

const getRecipes = async (itemsArray, userId) => {
  const user = await User.findByPk(userId)
  const diets = await user.getDiets()
  const allergies = await user.getAllergies()

  let searchIngredientsString = ''
  itemsArray.forEach(currentItem => {
    currentItem = currentItem.name.split(' ').join('+')
    searchIngredientsString += currentItem + ','
  })
  searchIngredientsString = searchIngredientsString.slice(0, -1)

  let dietSearchString = ''
  diets.forEach(currentDiet => {
    currentDiet = currentDiet.name.split(' ').join('')
    dietSearchString += currentDiet + ',+'
  })
  dietSearchString = dietSearchString.slice(0, -2)

  let allergySearchString = ''
  allergies.forEach(currentAllergies => {
    currentAllergies = currentAllergies.name.split(' ').join('')
    allergySearchString += currentAllergies + ',+'
  })
  allergySearchString = allergySearchString.slice(0, -2)

  // make API call to retrieve recipes from user's ingredients
  const {data} = await axios.get(
    `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${searchIngredientsString}&diet=${dietSearchString}&intolerances=${allergySearchString}&number=5&apiKey=${spoonacularAPIKEY}`
  )
  // console.log(
  //   'HTTP STRING====>',
  //   `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${searchIngredientsString}&diet=${dietSearchString}&intolerances=${allergySearchString}&number=5&apiKey=${spoonacularAPIKEY}`
  // )
  return data
}

router.get('/singleRecipe/:recipeId', async (req, res, next) => {
  try {
    // console.log('this is req.params ----------------->', req.params)
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
    let recipes = await getRecipes(items, req.user.id)
    res.send(recipes)
  } catch (error) {
    next(error)
  }
})

// Updating list of recipes based off of user's filtered ingredients
router.put('/filtered', async (req, res, next) => {
  try {
    const filteredItems = req.body
    let recipes = await getRecipes(filteredItems, req.user.id)
    res.send(recipes)
  } catch (error) {
    next(error)
  }
})

module.exports = router
