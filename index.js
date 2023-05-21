const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.q6zwl04.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const categoryCollection = client.db("zooZest").collection("shopCategory");
    const toyCollection = client.db("zooZest").collection("toys");

    app.get("/category/teddy", async (req, res) => {
      const query = { category: "teddy" };
      const cursor = categoryCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/category/horse", async (req, res) => {
      const query = { category: "horse" };
      const cursor = categoryCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/category/dinosaur", async (req, res) => {
      const query = { category: "dinosaur" };
      const cursor = categoryCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/toys", async (req, res) => {
      let query = {};
      if (req.query?.sellerEmail) {
        query = { sellerEmail: req.query.sellerEmail };
      }
      const cursor = toyCollection.find(query).limit(20);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query);
      res.send(result);
    });

    app.post("/toys", async (req, res) => {
      const newToy = req.body;
      const result = await toyCollection.insertOne(newToy);
      res.send(result);
    });

    app.put("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateToy = req.body;
      const toys = {
        $set: {
          price: updateToy.price,
          quantity: updateToy.quantity,
          description: updateToy.description,
        },
      };
      const result = await toyCollection.updateOne(filter, toys, option);
      res.send(result);
    });

    app.delete("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
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
  res.send("Zoo Zest server is running...");
});

app.listen(port, () => {
  console.log(`Zoo Zest server is running on port:${port}`);
});
