//   var url = "mongodb://127.0.0.1:27017/nodemongo";

  const { MongoClient } = require('mongodb');
const url = "mongodb://127.0.0.1:27017";

async function main() {
  const client = new MongoClient(url);
  await client.connect();
  console.log("Database created!");
  await client.close();
}
main().catch(console.error);