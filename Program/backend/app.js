const express = require("express")
const bodyParser = require("body-parser");
const mongoose = require("./mongoose");

const sourcesRoutes = require("./routes/sources-routes")

app = express();

app.use(bodyParser.json());

app.use("/api/sources", sourcesRoutes)











app.listen(5000);