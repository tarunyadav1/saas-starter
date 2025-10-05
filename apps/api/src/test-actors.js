const { db, schema } = require('./db/index.js')

async function testActors() {
  try {
    console.log('Testing database connection...')
    const actors = await db.select().from(schema.actorModels).limit(5)
    console.log('Found actors:', actors.length)
    console.log('First actor:', JSON.stringify(actors[0], null, 2))
    
    // Test image URLs
    if (actors[0]?.imageUrl) {
      console.log('Testing image URL:', actors[0].imageUrl)
    }
  } catch (error) {
    console.error('Database error:', error)
  }
  process.exit(0)
}

testActors()