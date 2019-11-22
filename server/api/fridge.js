const router = require('express').Router()
const {Fridge, FridgeStock, User, Item} = require('../db/models')
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
    const user = await User.getFridgeId(req.params.id)

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
    res.send(fridgeItems)
  } catch (error) {
    next(error)
  }
})

router.post('/:id/add', async (req, res, next) => {
  try {
    const user = await User.getFridgeId(req.params.id)
    const fridge = await Fridge.findOrCreate(user.fridgeId)
    //maybe check this again
    const item = await item.findOrCreate(req.body)
  } catch (error) {
    next(error)
  }
})
