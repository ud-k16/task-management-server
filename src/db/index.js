const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGODB_CONNECTION_URL;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// const connectDB = async () => {
//   try {
//     // Connect the client to the server
//     await client.connect();
//     //ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     //  return db client
//     return client;
//   } finally {
//     //  close when  finish/error
//     await client.close();
//   }
// };

module.exports = { MongoDBClient: client };
