const express = require("express");
const bodyParser = require("body-parser");

//already creates the server
const app = express();

//get, post are called http methods

//automatically calls next() to run next middleware
//automatically saves the corresponding (urlencoded) data in req.body
app.use(bodyParser.urlencoded({ extended: false }));

//post middleware only triggered on incoming POST requests
app.post("/user", (req, res, next) => {
    res.send('<h1>' + req.body.username + '</h1>');
});

//get only on get requests
app.get("/", (req, res, next) => {
    res.send('<form action="/user" method="POST"><input type="text" name="username"><button type="submit">Create User</button></input></form>')
});

//use gets triggered on all requests
app.use((req, res, next) => {

});

app.listen(5000);

//when starting the server (running npm start, or node app.js etc), this file gets executed once, that means
//all middlewares get executed and their functions saved as callback functions. Then these functions get called
//depending on the type of requests coming in. But this file itself is only run once!

