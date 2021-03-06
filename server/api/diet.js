const router = require('express').Router()
const {Fridge, FridgeStock, User, Item, Diet} = require('../db/models')
const Sequelize = require('sequelize')
module.exports = router

// GET all diets
router.get('/', async (req, res, next) => {
  try {
    const allDiets = await Diet.findAll()
    res.send(allDiets)
  } catch (error) {
    next(error)
  }
})

// GET a specific user's diet
router.get('/:userId', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId)
    const diets = await user.getDiets()
    res.send(diets)
  } catch (error) {
    next(error)
  }
})

// POST a new diet to a specific user
router.post('/:userId', async (req, res, next) => {
  try {
    //maybe find by name instead of id
    const diet = await Diet.findByPk(req.body.dietId)
    if (!diet) {
      res.status(404).send('Diet does not exist')
    } else {
      const user = await User.findByPk(req.params.userId)
      await user.addDiet(diet.id)
      res.send(diet)
    }
  } catch (error) {
    next(error)
  }
})

// DELETE a diet from a specific user
router.delete('/:userId/:dietId', async (req, res, next) => {
  try {
    const deletedDiet = await Diet.findByPk(req.params.dietId)
    if (!deletedDiet) {
      res.status(404).send('Diet does not exist')
    } else {
      const user = await User.findByPk(req.params.userId)
      await user.removeDiet(deletedDiet.id)
      res.send(deletedDiet)
    }
  } catch (error) {
    next(error)
  }
})
