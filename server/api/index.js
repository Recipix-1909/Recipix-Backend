const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/fridge', require('./fridge'))
router.use('/recipes', require('./recipes'))
router.use('/item', require('./item'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
