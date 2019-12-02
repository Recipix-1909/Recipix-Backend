const router = require('express').Router()
const {Item} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const singleItem = await Item.findOne({
      where: {
        serialNum: req.body.serialNum
      }
    })
    if (singleItem) res.send(true)
    else res.send(false)
  } catch (error) {
    next(error)
  }
})

router.post('/add', async (req, res, next) => {
  try {
    const item = await Item.findOrCreate({
      where: {
        name: req.body.name,
        imageUrl: req.body.imageUrl || null,
        serialNum: req.body.serialNum || null
      }
    })
    res.send(item)
  } catch (error) {
    next(error)
  }
})
