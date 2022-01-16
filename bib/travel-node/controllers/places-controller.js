const { v4: uuid, validate } = require('uuid');
const { validationResult } = require("express-validator");
const https = require("https");
const utf8 = require("utf8");


const getCoords = require("../util/location");
const HttpError = require("../models/http-error");
const { networkInterfaces } = require('os');


let DUMMY_PLACES = [
    {
        id: "p1",
        title: "Wasserturm",
        description: "Monnema Denkmal",
        imageURL: "https://img.fotocommunity.com/mannheimer-wasserturm-8cdeb55e-0b15-4788-892f-c8352adf88ae.jpg?height=1080",
        address: "Friedrichsplatz, 68165 Mannheim",
        creatorId: "u1",
        location: {
            lat: 49.48378453358149,
            lng: 8.475827574986559
        }
    },
    {
        id: "p2",
        title: "Neckar",
        description: "Monnema Fluss",
        imageURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Neckar_Fernmeldeturm_Mannheim_2.JPG/800px-Neckar_Fernmeldeturm_Mannheim_2.JPG",
        address: "Mannheim",
        creatorId: "u1",
        location: {
            lat: 49.493946047425595,
            lng: 8.472541212146886
        }
    }
];


const getPlaceByPlaceId = (req, res, next) => {

    const placeId = req.params.pid; //req.params = {pid: "p1}
    const place = DUMMY_PLACES.find(p => {
        return p.id == placeId;
    })

    if (!place) {
        //asynchronous error througher (better)
        //next(error);
        //synchronous error througher
        //throw error;
        return next(new HttpError("Find: Could not find a place with that place id.", 404));
    };
    res.json({ place }) //{place} == {place: place}, short syntax in js

};


const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter(p => {
        return p.creatorId == userId;
    }); //find seems to only look for one, better use filter

    if (!places || places.length === 0) {
        return next(new HttpError("Find: Could not find a place with that user id.", 404));
    };
    res.json({ places });
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("CreatePlace: Invalid input data, please check your input.", 422));
    };

    //from bodyParser.json() in the first middleware in app.js app.use(...)
    //shortcut for: const title = req.body.title; ...
    const { title, description, address, creatorId } = req.body;

    let coordinates;
    //use try when working with await (await can only be used in async functions)
    try {
        coordinates = await getCoords(address);
    } catch(error) {
        return next(error);
    };

    const createdPlace = {
        id: uuid(),
        title,
        description,
        location: coordinates,
        address,
        creatorId
    };

    DUMMY_PLACES.push(createdPlace); //or unshift adds as the first element, push as the last
    res.status(201).json({ DUMMY_PLACES }); //201 standard for a successful data creation
};

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;

    const place = DUMMY_PLACES.find(p => {
        return p.id == placeId;
    });

    if (!place) {
        next(new HttpError("Delete: Could not find place by place Id", 404));
    };

    DUMMY_PLACES = DUMMY_PLACES.filter(p => {
        return p.id != placeId;
    });


    res.status(201).json({ DUMMY_PLACES });
};


const showPlaces = (req, res, next) => {
    res.status(200).json({ DUMMY_PLACES });
};


const updatePlace = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        return next(new HttpError("UpdatePlace: Invalid input data, please check your input.", 422));
    };

    const placeId = req.params.pid;
    const { title, description } = req.body;

    //const object_copy = {...object} creates a copy of object
    const updatedPlace = DUMMY_PLACES.find(p => p.id === placeId);
    const updatedPlace_copy = { ...updatedPlace };


    if (!updatedPlace) {
        return next(new HttpError("Update: Could not find place by place id.", 404));
    };

    updatedPlace_copy.title = title;
    updatedPlace_copy.description = description;

    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
    DUMMY_PLACES[placeIndex] = updatedPlace_copy;

    res.status(200).json({ DUMMY_PLACES });
};


//multiple exports
exports.getPlaceByPlaceId = getPlaceByPlaceId;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.deletePlace = deletePlace;
exports.showPlaces = showPlaces;
exports.updatePlace = updatePlace;

