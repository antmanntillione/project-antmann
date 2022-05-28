const mongoose = require("mongoose");

//USE MONGOOSE

//create schemas for data structures, like for example for products
const productSchema = mongoose.Schema({
    name: {type: String, required: true}, 
    price: {type: Number, required: true}
});

//create model and export it ("product" will be the name of the mongo collection)
module.exports = mongoose.model("product", productSchema);

