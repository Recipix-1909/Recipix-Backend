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

router.post('/:userId/', async (req, res, next) => {
  // req.body should be like:
  /* {
      expirationDate: 01.01.1999,
      serialNum: 111111
    }

    */

  try {
    const user = await User.getFridgeId(req.params.userId)
    const fridgeId = user.fridgeId

    // need to receive the serialNum somehow
    // req.body.serialNum

    // Item.class method to see if the item exists in the database
    // Item.includes(serialNum)

    console.log('this is req.body!!!!!!!!!!!!!!!', req.body)

    const item = await Item.getItem(req.body.serialNum)

    console.log('this is item!!!!!!!!!!!!!!!', item)

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
    // should this be 201 or 202?
    res.status(202).send({fridgeItem, item})
  } catch (error) {
    next(error)
  }
})
