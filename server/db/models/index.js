const User = require('./user')
const Item = require('./item')
const Fridge = require('./fridge')
const FridgeStock = require('./fridgeStock')
const Recipe = require('./recipes')
const Allergy = require('./allergy')
const Diet = require('./diet')

/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
User.belongsTo(Fridge)
// Fridge.hasOne(User)
User.belongsToMany(Recipe, {through: 'savedRecipe'})
Recipe.belongsToMany(User, {through: 'savedRecipe'})
Item.belongsToMany(Fridge, {through: FridgeStock})
Fridge.belongsToMany(Item, {through: FridgeStock})
User.belongsToMany(Allergy, {through: 'UserAllergy'})
Allergy.belongsToMany(User, {through: 'UserAllergy'})
User.belongsToMany(Diet, {through: 'UserDiet'})
Diet.belongsToMany(User, {through: 'UserDiet'})

module.exports = {
  User,
  Item,
  Fridge,
  FridgeStock,
  Allergy,
  Diet
}
