const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controller");

const router = express.Router();

router.get("/", usersController.getAllUsers);

router.post(
    "/signup", 
    [
        check("name").not().isEmpty(),
        check("email").normalizeEmail().isEmail(),
        check("password").isLength({min: 5})
    ],
    usersController.signupUser)

router.post("/login", usersController.loginUser);

router.post("/logout/:uid", usersController.logoutUser);

router.delete("/:uid", usersController.deleteUser);


module.exports = router;