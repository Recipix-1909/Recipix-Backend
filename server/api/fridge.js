const router = require('express').Router()
const {Fridge} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const allFridges = await Fridge.findAll()
    res.send(allFridges)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const singleFridge = await Fridge.findByPk(req.params.id)
    res.send(singleFridge)
  } catch (error) {
    next(error)
  }
})

router.post('/:id/add', async (req, res, next) => {
  try {
    const addItem = await Fridge.findOrCreate(req.body)
  } catch (error) {
    next(error)
  }
})
