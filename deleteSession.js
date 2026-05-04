const redis = require("./database")

async function run() {
  await redis.del("user_session")
  console.log("Session deleted")
}

run()
