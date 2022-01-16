const MongoClient = require("mongodb").MongoClient;

const name = "tristan";
const password = "Nrcj9qeoYScpGfeY";
const database = "product";
const url = `mongodb+srv://${name}:${password}@cluster0.8vd2v.mongodb.net/${database}?retryWrites=true&w=majority`;


const createProduct = async (req, res, next) => {
    const newProduct = {
        name: req.body.name,
        price: req.body.price
    };

    //not yet establishing the connection to the database
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });  

    try {
        //establishing connection here
        await client.connect(err => {
            if (err) {
                return res.json({message: "CreateProduct: client.connect error."});
            };

            const collection = client.db("testtest").collection("products"); //enter arguments to specify db and collection
            collection.insertOne(newProduct);
        });
        
        
    } catch (error) {
        return res.json({message: "CreateProduct: Try block failed."});
    };

    //remember to close the connection to the database
    client.close();

    res.json(newProduct);
};

const getProducts = async (req, res, next) => {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true }); 

    let products;

    try {
        await client.connect();
        const db = client.db("testtest");
        products = await db.collection("products").find().toArray();

    } catch(error) {
        return res.json({message: "GetProducts: Try block failed."});
    };

    client.close();
    res.json(products);
};

exports.createProduct = createProduct;
exports.getProducts = getProducts;