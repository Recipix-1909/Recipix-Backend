const router = require('express').Router()
const {Fridge, FridgeStock, User, Item, Allergy} = require('../db/models')
const Sequelize = require('sequelize')
module.exports = router

// GET a specific user's allergies
router.get('/:userId', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId)
    const allergies = await user.getAllergies()
    res.send(allergies)
  } catch (error) {
    next(error)
  }
})

// POST a new allergy to a specific user
router.post('/:userId', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId)
    const newAllergy = await user.addAllergy(req.body.allergyId)
    // console.log(newAllergy)
    res.send(newAllergy)
  } catch (error) {
    next(error)
  }
})

// DELETE an allergy from a specific user
router.delete('/:userId', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId)
    const deletedAllergy = {allergyId: req.body.allergyId}
    await user.removeAllergy(req.body.allergyId)
    res.send(deletedAllergy)
  } catch (error) {
    next(error)
  }
})
