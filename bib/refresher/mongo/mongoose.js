const mongoose = require("mongoose");
const Product = require("./models/product");


const name = "tristan";
const password = "Nrcj9qeoYScpGfeY";
const database = "product";
const url = `mongodb+srv://${name}:${password}@cluster0.8vd2v.mongodb.net/${database}?retryWrites=true&w=majority`;
//this manages the entire connection to the database (no need to connect and close mongoclients anymore)
mongoose.connect(url).then(() => {
    console.log("Connected to database!");
}).catch(() => {
    console.log("Connection failed.")
});


const createProduct = async (req, res, next) => {
    const newProduct = new Product({
        name: req.body.name,
        price: req.body.price
    });

    //understand ObjectId
    //this id is created before actually adding it to the database
    console.log(typeof newProduct._id);
    console.log(typeof newProduct.id);

    //save adds the new data into the collection of the database (the collection is specified in the model definition (in product.js))
    //return of save is the saved product
    const result = await newProduct.save();

    res.json(result);
};


const getProducts = async (req, res, next) => {
    //mongoose find method already creates an array (so no toArray() necessary)
    //exec() turns it into a promise
    const products = await Product.find().exec();
    res.json(products);
};






exports.createProduct = createProduct;
exports.getProducts = getProducts;