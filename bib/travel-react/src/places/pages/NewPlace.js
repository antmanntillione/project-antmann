import React from "react";

import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import "./PlaceForm.css";

import { useForm } from "../../shared/hooks/form-hook";




const NewPlace = () => {

    const [formState, inputHandler] = useForm({
        title: {
            value: "",
            isValid: false
        },
        description: {
            value: "",
            isValid: false
        },
        address: {
            value: "",
            isValid: false
        }
    }, false);
    

    const placeSubmitHandler = event => {
        event.preventDefault();
        console.log(formState) 
        //send to backend
    }




    return <form className="place-form" onSubmit={placeSubmitHandler}>
        <Input 
            id="title"
            element="input" 
            type="text" 
            label="Title" 
            placeholder="e.g. Mannheim Wasserturm" 
            validators={[VALIDATOR_REQUIRE()]} 
            onInput={inputHandler}
            errorText="Please enter a valid title."
        />
        <Input
            id="description" 
            element="textarea" 
            label="Description" 
            placeholder="e.g. Mannheim is a nice place!" 
            validators={[VALIDATOR_MINLENGTH(5)]} 
            onInput={inputHandler}
            errorText="Please enter a valid description of at least 5 characters."
        />
        <Input
            id="address" 
            element="input" 
            label="Address" 
            placeholder="e.g. Friedrichsplatz" 
            validators={[VALIDATOR_REQUIRE()]} 
            onInput={inputHandler}
            errorText="Please enter a valid address."
        />
        <Button type="submit" disabled={!formState.isValid}>Add Place</Button>
    </form>
    

};

export default NewPlace;