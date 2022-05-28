const axios = require("axios");
const HttpError = require("../models/http-error");

//import mapbox
//const mapboxgl = require("mapbox-gl");
//mapboxgl.accessToken = 'pk.eyJ1IjoiZG9ubnloYWkiLCJhIjoiY2twMWJidWpqMHk5OTJ2bXJsMTV2bG00eiJ9.kvGfK0VN4WKR7Wu-9aS2yA';
const accessToken = 'pk.eyJ1IjoiZG9ubnloYWkiLCJhIjoiY2twMWJidWpqMHk5OTJ2bXJsMTV2bG00eiJ9.kvGfK0VN4WKR7Wu-9aS2yA';

const getCoords = async (address) => {
    //add limit=1 to the link to get only one solution for the address
    const link = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${accessToken}&limit=1`;
    const response = await axios.get(link);

    const data = response.data;

    if (!data) {
        return next(new HttpError("Something went wrong with coords mapbox api.", 404));
    };

    const coordinates = data.features[0].geometry.coordinates; //returns [lng, lat] format

    return {lat: coordinates[1], lng: coordinates[0]};

};

module.exports = getCoords;

