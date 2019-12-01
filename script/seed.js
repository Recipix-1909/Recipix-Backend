'use strict'

const db = require('../server/db')
const {User, Fridge, Item, FridgeStock} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const fridges = await Promise.all([Fridge.create({}), Fridge.create({})])

  const users = await Promise.all([
    User.create({
      firstName: 'Cody',
      lastName: 'Pug',
      email: 'cody@email.com',
      password: '123',
      fridgeId: 1
    }),
    User.create({
      firstName: 'Lily',
      lastName: 'Moriarty',
      email: 'lilybmoriarty@gmail.com',
      password: 'password',
      fridgeId: 2
    })
  ])

  const items = await Promise.all([
    Item.create({
      name: 'Broccoli',
      serialNum: 123456
    }),
    Item.create({
      name: 'Arugula',
      serialNum: 11111,
      imageUrl:
        'https://static.openfoodfacts.org/images/products/078/970/772/0052/front_en.3.400.jpg'
    }),
    Item.create({
      name: 'Granny Smith Apple',
      serialNum: 22222,
      imageUrl:
        'https://static.openfoodfacts.org/images/products/003/582/608/6433/front_en.3.400.jpg'
    }),
    Item.create({
      name: 'Cilantro',
      serialNum: 33333,
      imageUrl:
        'https://static.openfoodfacts.org/images/products/842/309/800/0363/front_es.6.400.jpg'
    }),
    Item.create({
      name: 'Chicken',
      serialNum: 55555,
      imageUrl:
        'https://static.openfoodfacts.org/images/products/009/661/982/8616/front_en.3.400.jpg'
    }),
    Item.create({
      name: 'Beef',
      serialNum: 121212,
      imageUrl:
        'https://static.openfoodfacts.org/images/products/325/039/002/1001/front_fr.11.400.jpg'
    }),
    Item.create({
      name: 'Sriracha',
      serialNum: 1234567,
      imageUrl:
        'https://static.openfoodfacts.org/images/products/002/446/306/1163/front_en.9.400.jpg'
    })
  ])

  const fridgeStock = await Promise.all([
    FridgeStock.create({
      fridgeId: 1,
      itemId: 1
    }),
    FridgeStock.create({
      fridgeId: 1,
      itemId: 2
    }),
    FridgeStock.create({
      fridgeId: 2,
      itemId: 2
    }),
    FridgeStock.create({
      fridgeId: 2,
      itemId: 3
    }),
    FridgeStock.create({
      fridgeId: 2,
      itemId: 4,
      expirationDate: new Date(2019, 11, 31)
    }),
    FridgeStock.create({
      fridgeId: 2,
      itemId: 5,
      expirationDate: new Date(2019, 11, 31)
    }),
    FridgeStock.create({
      fridgeId: 2,
      itemId: 6,
      expirationDate: new Date(2019, 11, 31)
    }),
    FridgeStock.create({
      fridgeId: 2,
      itemId: 7,
      expirationDate: new Date(2019, 11, 30)
    })
  ])

  console.log(
    `seeded ${users.length} users, ${fridges.length} fridges, ${
      items.length
    } items, ${fridgeStock.length} items in fridge!`
  )
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
