import React, { useState, useContext } from "react";

import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_MIN, VALIDATOR_REQUIRE} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";

import { AuthContext } from "../../shared/context/auth-context";

import "./Auth.css";

const Auth = props => {
    const auth = useContext(AuthContext);

    const [registerState, setRegisterState] = useState(false);


    const [formState, inputHandler, setFormData]  = useForm(
        {
            email: {
                value: "",
                isValid: false
            },
            password: {
                value: "",
                isValid: false
            }
        },
        false
    );


    const authSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs);
        if (!auth.isLoggedIn) {
            auth.login();

        }
        
        //send to backend
    }


    const switchFormHandler = () => {

        if (!registerState) {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: "",
                        isValid: false
                    },
                    age: {
                        value: 0,
                        isValid: false
                    }
                },
                false
            );
        } else {
            setFormData(
                {
                    ...formState.inputs, 
                    name: undefined,
                    age: undefined
                },
                formState.inputs.email.isValid && formState.inputs.password.isValid
            );
        }
        
        setRegisterState(mode => !mode);
    };

    return (
        <Card className="authentication">
            <h2>
                {registerState ? "SIGNUP" : "LOGIN"}
            </h2>
            <hr />
            <form onSubmit={authSubmitHandler}>
                {registerState && <Input 
                    id="name"
                    element="input"
                    type="text"
                    label="Name"
                    validators={[VALIDATOR_REQUIRE()]}
                    placeholder="e.g. Chuck Norris"
                    onInput={inputHandler}
                    errorText="Please enter a name."
                />}
                {registerState && 
                <Input 
                    id="age"
                    element="input"
                    type="number"
                    label="Age"
                    validators={[VALIDATOR_MIN(18)]}
                    placeholder="e.g. 27"
                    onInput={inputHandler}
                    errorText="You have to be at least 18 years of age."
                />
                }
                <Input 
                    id="email"
                    element="input"
                    type="email"
                    label="E-mail"
                    validators={[VALIDATOR_EMAIL()]}
                    placeholder="for@example.com"
                    onInput={inputHandler}
                    errorText="Please enter a correct email address."
                />
                <Input 
                    id="password"
                    element="input"
                    label="Password"
                    type="password"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    placeholder="Password"
                    onInput={inputHandler}
                    errorText="Please enter the correct password with at least 5 characters."
                />
                <Button disabled={!formState.isValid} type="submit">
                    {registerState ? "SIGNUP" : "LOGIN"}
                </Button>
            </form>
            <Button inverse onClick={switchFormHandler}>
                Switch to {registerState ? "LOGIN" : "SIGNUP"} 
            </Button>
        </Card>
    );
};


export default Auth;