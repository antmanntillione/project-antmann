const express = require("express");

//already creates the server
const app = express();

app.use((req, res, next) => {
    let body = "";

    //action after all data has arrived to the backend
    req.on("end", () => {
        const userName = body.split("=")[1];
        if (userName) {
            req.body = {name: userName};
        }
        next();
    });

    //receive data
    req.on("data", chunk => {
        body += chunk;
    });
});



app.use((req, res, next) => {
    if (req.body) {
        res.send("<h1>" + req.body.name + "</h1>");
        return;
    }
    res.send('<form method="POST"><input type="text" name="username"><button type="submit">Create User</button></input></form>')
});


app.listen(5000);

