const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const flash = require("connect-flash");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controller/user.js");
//sign up
router.get("/signup", userController.signupForm);  
router.post("/signup", wrapAsync (userController.signupUser))

//log in
router.get("/login", userController.loginForm)
router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
    }), userController.loginUser)

//logout
router.get("/logout", userController.logoutUser)


module.exports = router;