const router = require('express').Router()
const {Fridge, FridgeStock, User, Item} = require('../db/models')
const Sequelize = require('sequelize')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const allFridges = await Fridge.findAll()
    res.send(allFridges)
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
    res.send(fridgeItems)
  } catch (error) {
    next(error)
  }
})

router.post('/:userId/manual', async (req, res, next) => {
  try {
    const user = await User.getFridgeId(req.params.userId)
    const fridgeId = user.fridgeId

    const itemId = await Item.findOrCreate({
      where: {
        name: req.body.name
      }
    })
    const item = itemId[0]
    //consider addItem over findOrCreate
    let fridge = await FridgeStock.findOrCreate({
      where: {
        itemId: item.id,
        fridgeId: fridgeId
      }
    })

    const fridgeItem = fridge[0]
    if (req.body.expirationDate) {
      fridgeItem.expirationDate = req.body.expirationDate
      fridgeItem.save()
    }

    res.send({fridgeItem, item})
  } catch (error) {
    next(error)
  }
})

router.post('/:userId', async (req, res, next) => {
  // req.body should be like:
  /* {
      expirationDate: 01.01.1999,
      serialNum: 111111
    }

    */

  try {
    const user = await User.getFridgeId(req.params.userId)
    const fridgeId = user.fridgeId

    const item = await Item.getItem(req.body.serialNum)

    // expiration date needs to be in ISO formate, i.e. 30.04.2020 for 4/30/20

    // create as object ahead of time with logic to specify expiration date or not

    let fridgeItem = await FridgeStock.findOrCreate({
      where: {
        itemId: item.id,
        fridgeId: fridgeId
        // expirationDate: req.body.expirationDate
      }
    })
    fridgeItem = fridgeItem[0]

    if (req.body.expirationDate) {
      fridgeItem.expirationDate = req.body.expirationDate
      fridgeItem.save()
    }

    res.status(202).send({fridgeItem, item})
  } catch (error) {
    next(error)
  }
})

router.delete('/:userId/:itemId', async (req, res, next) => {
  try {
    const user = await User.getFridgeId(req.params.userId)
    const fridgeId = user.fridgeId
    const itemId = req.params.itemId
    await FridgeStock.destroy({
      where: {
        fridgeId: fridgeId,
        itemId: itemId
      }
    })

    res.send({itemId: itemId, fridgeId: fridgeId})
  } catch (error) {
    next(error)
  }
})
