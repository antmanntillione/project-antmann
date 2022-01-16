import { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
    switch (action.type) {
        case "INPUT_CHANGE":
            let formIsValid = true;

            for (const inputId in state.inputs) {
                
                //are there undefined values?
                if (!state.inputs[inputId]) {
                    continue
                }

                if (inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid;
                } else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid;
                }
            }
            
            //[action.inputId] is dynamic, calls dynamically the corresponding key in the array
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: {value: action.value, isValid: action.isValid}
                },
                isValid: formIsValid
            };

        case "SET_DATA":
            return {
                inputs: action.inputs,
                isValid: action.isValid
            };
        default:
            return state;

    }

};

//über hooks: they cannot be inside functions like for if etc and they cannot be run contionally (eg a possible return before)
//hooks have to be able to be executed everytime the component gets executed, unconditionally


export const useForm = (initialInputs, initialFormValidity) => {


    const [formState, dispatch] = useReducer(formReducer,
        {
            inputs: initialInputs,
            isValid: initialFormValidity
        }
    );


    //achtung: If inputHandler gets executed and leads to this function getting created new 
    //(for example if the component NewPlace gets rerendered again), then onInput changes down in 
    //in the Input props, and then inside the Input components useEffect gets triggered, leading to execute inputHandler again
    //therefore achtung
    //Solution: useCallback. After rerendering NewPlace the fct inputHandler gets reused, not newly created
    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({type: "INPUT_CHANGE", inputId: id, value: value, isValid: isValid})
    }, []);


    const setFormData = useCallback((inputs, formValidity) => {
        dispatch({
            type: "SET_DATA",
            inputs: inputs,
            isValid: formValidity
        });
    }, []);


    return [formState, inputHandler, setFormData]


};