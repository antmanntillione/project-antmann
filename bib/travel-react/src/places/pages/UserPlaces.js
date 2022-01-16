import React from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";

const DUMMY_PLACES = [
    {
        id: "p1",
        title: "Wasserturm",
        description: "Monnema Denkmal",
        imageURL: "https://img.fotocommunity.com/mannheimer-wasserturm-8cdeb55e-0b15-4788-892f-c8352adf88ae.jpg?height=1080",
        adress: "Friedrichsplatz, 68165 Mannheim",
        creatorID: "u1",
        location: {
            lat: 49.48378453358149, 
            lng: 8.475827574986559
        }
    },
    {
        id: "p2",
        title: "Wasserturm",
        description: "Monnema Denkmal",
        imageURL: "https://img.fotocommunity.com/mannheimer-wasserturm-8cdeb55e-0b15-4788-892f-c8352adf88ae.jpg?height=1080",
        adress: "Friedrichsplatz, 68165 Mannheim",
        creatorID: "u2",
        location: {
            lat: 49.48378453358149, 
            lng: 8.475827574986559
        }
    }
];

const UserPlaces = props => {
    const userId = useParams().userId;
    const loadedPlaces = DUMMY_PLACES.filter(place => place.creatorID === userId);
    return <PlaceList items={loadedPlaces}/>;
};

export default UserPlaces; 