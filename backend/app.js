const express = require("express")
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const sourcesRoutes = require("./routes/sources-routes")

// Start application
app = express();

// Define routes
app.use(bodyParser.json());
app.use("/sources", sourcesRoutes)

// Connect to mongodb database:
const name = "testione"
const password = "testmann"
const database = "Sources"
const url = `mongodb://${name}:${password}@cluster0-shard-00-00.vvctv.mongodb.net:27017,cluster0-shard-00-01.vvctv.mongodb.net:27017,cluster0-shard-00-02.vvctv.mongodb.net:27017/${database}?ssl=true&replicaSet=atlas-10feh7-shard-0&authSource=admin&retryWrites=true&w=majority`
mongoose
  .connect(
    url
  )
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });