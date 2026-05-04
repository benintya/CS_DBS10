const redis = require("./database")

async function run() {
  await redis.xadd("message_stream", "*", "name", "Benintya Farrel Armaya", "npm", "2406450346")
  const messages = await redis.xrange("message_stream", "-", "+")
  console.log(messages)
}

run()
