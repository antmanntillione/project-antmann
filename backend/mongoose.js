const mongoose = require("mongoose")
const Source = require("./models/source")

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