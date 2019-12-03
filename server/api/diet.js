const router = require('express').Router()
const {Fridge, FridgeStock, User, Item, Diet} = require('../db/models')
const Sequelize = require('sequelize')
module.exports = router

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
    const user = await User.findByPk(req.params.userId)
    const newDiet = await user.addDiet(req.body.dietId)
    // console.log(newDiet)
    res.send(newDiet)
  } catch (error) {
    next(error)
  }
})

// DELETE a diet from a specific user
router.delete('/:userId', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId)
    const deleteDiet = {dietId: req.body.dietId}
    await user.removeDiet(req.body.dietId)
    res.send(deleteDiet)
  } catch (error) {
    next(error)
  }
})
