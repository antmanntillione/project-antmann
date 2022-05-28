const express = require("express");
const bodyParser = require("body-parser");

const HttpError = require("./models/http-error");

//custom 
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

//erstellt server
app = express();

//"writes" data into req.body
app.use(bodyParser.json());

//move logic out of app.js like this
//see more at places-routes.js
app.use("/api/places", placesRoutes); //filter: /api/places/...

app.use("/api/users", usersRoutes);








//////////// Error Handling ////////////

//there are error handlers for errors inside of working routes. This error here gets thrown,
//if actually no middleware function got triggered because no valid route was entered
app.use((req, res, next) => {
    next(new HttpError("Could not find this route", 404))
});

//ERROR HANDLER
//all thrown (next(error)) errors should finally reach this middleware, where it will be responded as a status
//special middleware function, error handling middleware (express special)
app.use((error, req, res, next) => {
    
    //has a response already been sent?
    if (res.headerSent) {
        return next(error);
    };
    
    //if no res has been sent, send one now. 
    //convention: send a json object with a message object
    res.status(error.code || 500).json({message: error.message || "An unknown error occurred."});
})



app.listen(5000);