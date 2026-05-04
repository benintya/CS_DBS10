
const redis = require("./database")

async function run() {
  await redis.set("user_session", "Benintya Farrel Armaya", "EX", 30)
  const session = await redis.get("user_session")
  console.log(session)
}

run()
