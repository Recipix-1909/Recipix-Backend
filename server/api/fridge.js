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
    const fridgeId = user.fridgeId

    const item = await Item.findOrCreate({
      where: {
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        serialNum: req.body.serialNum
      }
    })

    // expiration date needs to be in ISO formate, i.e. 30.04.2020 for 4/30/20
    const fridgeItem = await FridgeStock.findOrCreate({
      where: {
        itemId: item[0].id,
        fridgeId: fridgeId,
        expirationDate: req.body.expirationDate
      }
    })

    // should this be 201 or 202?
    res.status(202).send({item, fridgeItem})
  } catch (error) {
    next(error)
  }
})
