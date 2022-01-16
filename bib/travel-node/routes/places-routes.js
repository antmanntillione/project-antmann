const express = require("express");
const { check } = require("express-validator");

const placesController = require("../controllers/places-controller");

//has similair functionalities as const app = express(), but better to export (?) for routing outsourcing
const router = express.Router();

//Show all places
router.get("/show", placesController.showPlaces);




//use dynamic url segments :example
router.get("/:pid", placesController.getPlaceByPlaceId);

// route /user/ will trigger the first middleware (middleware order matters!)
// router /user/u1 will not triggter the first middleware, since it is more specific
router.get("/user/:uid", placesController.getPlacesByUserId);

//multiple middleware functions in one middleware
//check is a middleware function which checks body input (body.title, body.description, body.address, etc)
router.post(
    "/", 
    [
        check("title").not().isEmpty(),
        check("description").isLength({min: 5}),
        check("address").not().isEmpty()
    ], 
    placesController.createPlace
);

//Update place
router.patch(
    "/:pid", 
    [
        check("title").not().isEmpty(),
        check("description").isLength({min: 5})
    ],
    placesController.updatePlace);

//Delete place by placeid
router.delete("/:pid", placesController.deletePlace);



//export syntax in nodejs
module.exports = router;