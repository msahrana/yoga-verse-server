const express = require("express");
const cors = require("cors");
const {MongoClient, ServerApiVersion, ObjectId} = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

const uri = `${process.env.MONGO_URI}`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const productsCollections = client.db("yogaDB").collection('products');
    // const blogsCollections = client.db("yogaDB").collection('blogs');
    // const usersCollections = client.db("yogaDB").collection('users');

    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productsCollections.insertOne(product);
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const result = await productsCollections.find().toArray();
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("YogaVerse server is running");
});

app.listen(port, () => {
  console.log(`YogaVerse server is running on port: ${port}`);
});
