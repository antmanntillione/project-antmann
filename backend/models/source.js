const mongoose = require("mongoose")

const sourceSchema = mongoose.Schema({
    id: {type: Number, required: true},
    who: {type: String, required: true},
    when: {type: Number, required: true},
    what: {type: String, required: true},
    where: {type: String, required: true}
})

module.exports = mongoose.model("source", sourceSchema)