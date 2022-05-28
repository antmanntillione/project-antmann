const {v4: uuid} = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

let DUMMY_USERS = [
    {
        id: "u1",
        name: "Tristan Barquin", 
        email: "test@test.com",
        password: "testtest",   
        loggedIn: false
    },
    {
        id: "u2",
        loggedIn: false
    }
];



const getAllUsers = (req, res, next) => {
    res.status(200).json({DUMMY_USERS});
};


const signupUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Signup: Invalid input.", 422))
    };

    const { name, email, password } = req.body;

    const hasUser = DUMMY_USERS.find(u => u.email === email);
    if (hasUser) {
        return next(new HttpError("Signup: Signup not possible, email already exists.", 422))
    }

    //directly logged in after signup
    const newUser = {
        id: uuid(),
        name, 
        email, 
        password,
        loggedIn: true
    }

    DUMMY_USERS.push(newUser);
    res.status(201).json({DUMMY_USERS});
};


const loginUser = (req, res, next) => {
    const {email, password} = req.body;

    const user = DUMMY_USERS.find(u => u.email === email);

    if (!user) {
        return next(new HttpError("Login: Couldnt find user by email.", 401)); //401 authentication failed
    }

    if (user.password != password) {
        return next(new HttpError("Login: Wrong password entered.", 401));
    }

    user.loggedIn = true;
    res.status(200).json({DUMMY_USERS});
};


const logoutUser = (req, res, next) => {
    const userId = req.params.uid;
    const user = DUMMY_USERS.find(u => u.id === userId);

    if (!user) {
        return next(new HttpError("Logout: Couldnt find user by user id.", 404));
    }

    user.loggedIn = false;
    res.status(200).json({DUMMY_USERS});
};

const deleteUser = (req, res, next) => {
    const userId = req.params.uid;
    const user = DUMMY_USERS.find(u => u.id === userId);

    if (!user) {
        return next(new HttpError("Delete: Couldnt find user by user id.", 404));
    }

    DUMMY_USERS = DUMMY_USERS.filter(u => u.id !== userId);
    res.status(200).json({DUMMY_USERS});    
};


exports.getAllUsers = getAllUsers;
exports.signupUser = signupUser;
exports.loginUser = loginUser;
exports.logoutUser = logoutUser;
exports.deleteUser = deleteUser;