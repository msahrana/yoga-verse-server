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
    const productsCollections = client.db("yogaDB").collection("products");
    const blogsCollections = client.db("yogaDB").collection("blogs");
    const usersCollections = client.db("yogaDB").collection("users");

    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productsCollections.insertOne(product);
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const result = await productsCollections.find().toArray();
      res.send(result);
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({error: "Invalid product ID"});
      }
      const query = {_id: new ObjectId(id)};
      const result = await productsCollections.findOne(query);
      res.send(result);
    });

    app.post("/blogs", async (req, res) => {
      const blog = req.body;
      const result = await blogsCollections.insertOne(blog);
      res.send(result);
    });

    app.get("/blogs", async (req, res) => {
      const result = await blogsCollections.find().toArray();
      res.send(result);
    });

    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      // Validate the ID format
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({error: "Invalid blog ID"});
      }
      const query = {_id: new ObjectId(id)};
      const result = await blogsCollections.findOne(query);
      if (!result) {
        return res.status(404).send({error: "Blog not found"});
      }
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollections.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await usersCollections.find().toArray();
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
