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
    console.log(req.body)
    const item = await Item.findOne({
      where: {
        serialNum: req.body.serialNum
      }
    })

    // console.log("ITEM@@@@@@@@@@@@@@",item)
    // expiration date needs to be in ISO formate, i.e. 30.04.2020 for 4/30/20
    let fridgeItem = await FridgeStock.findOrCreate({
      where: {
        itemId: item.id,
        fridgeId: fridgeId
        // expirationDate: req.body.expirationDate
      }
    })
    if (req.body.expirationDate) {
      console.log('hello')
      await FridgeStock.update(
        {
          expirationDate: req.body.expirationDate
        },
        {
          where: {
            itemId: item.id,
            fridgeId: fridgeId
          }
        }
      )
    }
    // should this be 201 or 202?
    res.status(202).send(fridgeItem)
  } catch (error) {
    next(error)
  }
})
