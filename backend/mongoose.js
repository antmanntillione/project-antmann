const mongoose = require("mongoose")
const Source = require("./models/source")

const name = "testione"
const password = "testmann"
const database = "Sources"
const url = `mongodb+srv://${name}:${password}@cluster0.vvctv.mongodb.net/${database}?retryWrites=true&w=majority`


//this manages the entire connection to the database (no need to connect and close mongoclients anymore)
mongoose.connect(url).then(() => {
    console.log("Connected to database!");
}).catch(() => {
    console.log("Connection failed.")
});


const writeSource = async (req, res, next) => {
    const newSource = new Source({
        id: req.body.id,
        who: req.body.who,
        when: req.body.when,
        what: req.body.what,
        where: req.body.where
    })


    const result = await newSource.save()

    res.json(result)
}


const getSources = async (req, res, next) => {
    const sources = await Source.find().exec()
    res.json(sources)
}


exports.writeSource = writeSource
exports.getSources = getSources