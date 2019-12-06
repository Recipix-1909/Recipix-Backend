const router = require('express').Router()
const {Fridge, FridgeStock, User, Item, Allergy} = require('../db/models')
const Sequelize = require('sequelize')
module.exports = router

// GET all allergies
router.get('/', async (req, res, next) => {
  try {
    const allAllergies = await Allergy.findAll()
    res.send(allAllergies)
  } catch (error) {
    next(error)
  }
})

// GET a specific user's allergies
router.get('/:userId', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId)
    const allergies = await user.getAllergies()
    console.log('allergies from get route===>', allergies)
    res.send(allergies)
  } catch (error) {
    next(error)
  }
})

// POST a new allergy to a specific user
router.post('/:userId', async (req, res, next) => {
  try {
    const allergy = await Allergy.findByPk(req.body.allergyId)
    if (!allergy) {
      res.status(404).send('Allergy does not exist')
    } else {
      const user = await User.findByPk(req.params.userId)
      console.log('allergy from post route====>', allergy)
      await user.addAllergy(allergy.id)
      res.send(allergy)
    }
  } catch (error) {
    next(error)
  }
})

// DELETE an allergy from a specific user
router.delete('/:userId/:allergyId', async (req, res, next) => {
  try {
    const deletedAllergy = await Allergy.findByPk(req.params.allergyId)
    if (!deletedAllergy) {
      res.status(404).send('Allergy does not exist')
    } else {
      const user = await User.findByPk(req.params.userId)
      await user.removeAllergy(deletedAllergy.id)
      res.send(deletedAllergy)
    }
  } catch (error) {
    next(error)
  }
})
