import { createContext } from "react";

//createContext for app-wide information transfer management
//call this as a component with <AuthContext.Provider value={}></AuthContext.Provider>
//see more in App.js
export const AuthContext = createContext({
    isLoggedIn: false, 
    login: () => {},
    logout: () => {}
});