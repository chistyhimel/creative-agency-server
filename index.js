const express = require("express");
require('dotenv').config();
const bodyParser = require("body-parser");
const cors = require("cors");
const { query } = require("express");
const ObjectId = require("mongodb").ObjectID;
const MongoClient = require("mongodb").MongoClient;
const uri =
  `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.7ntnx.mongodb.net:27017,cluster0-shard-00-01.7ntnx.mongodb.net:27017,cluster0-shard-00-02.7ntnx.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-87jhz3-shard-0&authSource=admin&retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

client.connect((err) => {
  const collection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION);
  app.post("/addOrder", (req, res) => {
    const order = req.body;
    console.log(order)
    collection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/userOrders", (req, res) => {
    const email = req.query.email;
    console.log(email)
    collection
      .find({email:email})
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  const commentCollection = client.db(process.env.DB_NAME).collection("reviews");
  app.post("/addReview", (req, res) => {
    const review = req.body;
    console.log(review)
    commentCollection.insertOne(review).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.get("/reviews", (req, res) => {
    commentCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  
});

app.listen(process.env.PORT || 5000);