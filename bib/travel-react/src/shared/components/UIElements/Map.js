import React, { useEffect, useRef } from 'react';

import "./Map.css";
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = 'pk.eyJ1IjoiZG9ubnloYWkiLCJhIjoiY2twMWJidWpqMHk5OTJ2bXJsMTV2bG00eiJ9.kvGfK0VN4WKR7Wu-9aS2yA';


const Map = props => {
    const mapRef = useRef();

    const { center, zoom } = props;

    //default: useEffect(() => {}, []);
    //if one of the dependencies in [] changes, the function () => {} gets executed
    //useEffect gets executed AFTER JSX (first return <div> ... then useEffect. So mapRef is known in the div,
    //then new mapboxgl.Map(container: mapRef.current ...) knows where to put the map
    //propbably useEffect will anyway be executed initally after the first render of JSX (initial execution)
    useEffect(() => {
            new mapboxgl.Map({
                container: mapRef.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: center,
                zoom: zoom
            });
        }, 
        [center, zoom]
    );

    


    return (
        <div ref={mapRef} className={`map ${props.className}`} style={props.style}></div>
    );
}


export default Map;