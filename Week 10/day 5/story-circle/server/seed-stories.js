const { randomBytes } = require('node:crypto')
const { hashPassword } = require('./auth')
const { pool } = require('./db')

const writers = [
  { name: 'Maya Chen', email: 'maya@storycircle.demo' },
  { name: 'Jonah Brooks', email: 'jonah@storycircle.demo' },
  { name: 'Amina Okafor', email: 'amina@storycircle.demo' },
  { name: 'Leo Martins', email: 'leo@storycircle.demo' },
  { name: 'Priya Nair', email: 'priya@storycircle.demo' },
  { name: 'Noah Williams', email: 'noah@storycircle.demo' },
]

const sampleStories = [
  ['The Bookshop at the End of the Rain', 'Fiction', 'Maya Chen', 'Every time it rained, a bookshop appeared at the end of Wren Street. On Thursday, June found a note in the window with her own handwriting: You are right on time.'],
  ['A Map of Small Goodbyes', 'Fiction', 'Maya Chen', 'Elian kept a map of places where he had said goodbye. The last pin waited in the drawer until the day someone asked him where he had learned to stay.'],
  ['The Quiet Between Stations', 'Mystery', 'Maya Chen', 'The night train made one extra stop every Tuesday. Nobody got off there, until a conductor found a fresh cup of tea waiting on the empty platform.'],
  ['Instructions for Borrowing the Moon', 'Fantasy', 'Maya Chen', 'The moon could be borrowed for one evening, provided you returned it before dawn and left a story in its place.'],
  ['The Last Radio on Orchard Hill', 'Science fiction', 'Jonah Brooks', 'At 2:17 every morning, the radio picked up a weather report from a town that had not been built yet. This time, the forecast included Jonah’s name.'],
  ['A Small Manual for Lost Things', 'Fiction', 'Jonah Brooks', 'The lost-and-found clerk knew where everything went: mittens, keys, courage. Then someone handed him a feeling he had misplaced as a child.'],
  ['When the Garden Learned to Listen', 'Fantasy', 'Jonah Brooks', 'The garden grew a new flower each time the neighbors told the truth. By midsummer, the whole block was bright with things they had never said aloud.'],
  ['Postcards from a Future Shore', 'Science fiction', 'Jonah Brooks', 'The postcards arrived with no return address, only photographs of the coastline fifty years from now and a message on the back: We saved the lighthouse.'],
  ['The Museum of Unfinished Days', 'Fiction', 'Amina Okafor', 'In the museum, every unfinished day had its own room. Nia came to find the Tuesday she had spent waiting for an apology.'],
  ['Three Minutes of Starlight', 'Science fiction', 'Amina Okafor', 'For three minutes, the city went dark and the stars appeared between the rooftops. The children made a wish together, and the sky answered in a language of light.'],
  ['The House That Kept Your Secrets', 'Mystery', 'Amina Okafor', 'The old house remembered every secret ever whispered in its rooms. When the new owner arrived, the floorboards began telling a story no one had heard.'],
  ['An Atlas of Imaginary Birds', 'Fiction', 'Amina Okafor', 'Her grandmother drew birds that had never existed: one carried forgotten songs, another nested in the pockets of lonely people.'],
  ['The Lighthouse Keeper’s Second Shadow', 'Mystery', 'Leo Martins', 'The keeper’s shadow started returning from its nightly rounds before he did. One stormy evening, it came back holding a lantern he had never seen.'],
  ['All the Colors We Left Behind', 'Fiction', 'Leo Martins', 'The city had forgotten the color blue. A muralist found it hiding beneath layers of old paint and brought it back one wall at a time.'],
  ['The Day the Clocks Took a Walk', 'Fantasy', 'Leo Martins', 'At noon, every clock in Bellweather stepped off its wall and went outside. The town had to learn what time felt like without being told.'],
  ['Room for One More Star', 'Science fiction', 'Leo Martins', 'A retired astronomer discovered a new star in the corner of an old photograph. It blinked when she spoke, as if it had been waiting for her to look up.'],
  ['Recipes for an Ordinary Miracle', 'Fiction', 'Priya Nair', 'The recipe called for one ripe peach, a quiet afternoon, and the name of someone you missed. By sunset, the kitchen smelled like summer at home.'],
  ['The Borrowed Umbrella Society', 'Fiction', 'Priya Nair', 'Nobody in the society ever returned an umbrella to the same person. They believed kindness traveled farther when it changed hands.'],
  ['Seven Doors in the Blue Hotel', 'Mystery', 'Priya Nair', 'The hotel had seven doors on the seventh floor. Guests were told not to open the one marked with their own room number.'],
  ['A Letter for the Sea', 'Fantasy', 'Priya Nair', 'Every spring, the tide carried a letter back to shore. This year, it was addressed to the sea itself, in handwriting the waves remembered.'],
  ['The Library of Borrowed Voices', 'Fantasy', 'Noah Williams', 'You could borrow a voice at the library, but you had to return it with a sentence you had never said before. Sam chose his grandmother’s.'],
  ['The Long Way Around the Sun', 'Science fiction', 'Noah Williams', 'The space station took a longer orbit every year so its crew could watch one extra sunrise together before coming home.'],
  ['Notes from the Night Gardener', 'Mystery', 'Noah Williams', 'Someone was planting tiny paper stars among the roses. The gardener followed them through the park and found a message meant for the whole city.'],
  ['The Village at the Bottom of the Teacup', 'Fantasy', 'Noah Williams', 'After the last sip, a whole village appeared in the cup. Its tiny mayor had been trying to send a message for a hundred years.'],
]

async function seedPublicStories() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const writerIds = new Map()
    for (const writer of writers) {
      let { rows } = await client.query('SELECT id FROM users WHERE email = $1', [writer.email])
      if (!rows[0]) {
        const passwordHash = await hashPassword(randomBytes(32).toString('base64url'))
        const inserted = await client.query(
          `INSERT INTO users (email, password_hash, display_name, bio)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (email) DO UPDATE SET display_name = EXCLUDED.display_name, bio = EXCLUDED.bio
           RETURNING id`,
          [writer.email, passwordHash, writer.name, 'A member of the Story Circle writing community.'],
        )
        rows = inserted.rows
      }
      writerIds.set(writer.name, Number(rows[0].id))
    }

    for (const [index, [title, category, writer, content]] of sampleStories.entries()) {
      const ownerId = writerIds.get(writer)
      const { rows } = await client.query(
        `INSERT INTO stories (owner_id, title, content, category, visibility, version, updated_at)
         SELECT $1, $2, $3, $4, 'public', 1, NOW() - ($5 * INTERVAL '1 hour')
         WHERE NOT EXISTS (SELECT 1 FROM stories WHERE owner_id = $1 AND title = $2)
         RETURNING id`,
        [ownerId, title, content, category, index],
      )
      if (rows[0]) {
        await client.query(
          'INSERT INTO story_versions (story_id, version, title, content, editor_id) VALUES ($1, 1, $2, $3, $4)',
          [rows[0].id, title, content, ownerId],
        )
      }
    }
    await client.query('COMMIT')
    console.log(`Loaded ${sampleStories.length} public sample stories from ${writers.length} community writers.`)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

module.exports = { seedPublicStories }
