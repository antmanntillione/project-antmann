import React, { useReducer, useEffect } from "react";


import { validate } from "../../util/validators";
import "./Input.css";


const inputReducer = (state, action) => {
    switch (action.type) {
        case "CHANGE":
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            };
        case "TOUCH":
            return {
                ...state,
                isTouched: true
            };
        default:
            return state;
    }
};


const Input = props => {

    //useReducer for more complex state handling
    const [inputState, dispatch] = useReducer(inputReducer, {value: props.initialValue || "", isTouched: false, isValid: props.initialValid || false});
    //object destructuring
    const {id, onInput} = props;
    const {value, isValid} = inputState;

    useEffect(() => {
        onInput(id, value, isValid)
    }, [id, value, isValid, onInput]);


    const changeHandler = event => {
        //format/syntax: dispatch(action)
        dispatch({type: "CHANGE", val: event.target.value, validators: props.validators});
    };

    const touchHandler = () => {
        dispatch({type: "TOUCH"});
    };

    //onBlur means, that the mouse is in the field at this moment
    const element = props.element === "input" ? (
            <input 
                id={props.id} 
                type={props.type} 
                placeholder={props.placeholder}
                onChange={changeHandler}
                value={inputState.value}
                onBlur={touchHandler}
            />
        ) : (
            <textarea 
                id={props.id}
                rows={props.rows || 3}
                placeholder={props.placeholder}
                onChange={changeHandler}
                value={inputState.value}
                onBlur={touchHandler}
            />
        )


    return <div className={`form-control ${!inputState.isValid && inputState.isTouched && "form-control--invalid"}`}>
        <label htmlFor={props.id}>{props.label}</label>
        {element}
        {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>

}




export default Input;
