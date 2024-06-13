const User = require("../models/user.js");

module.exports.signupUser = async(req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const regUser = await User.register(newUser, password);
        console.log(regUser);
        req.login(regUser, (err) => {
            if(err) {
                return next(err);
            }  
            req.flash("success", "Welcome to stayzz");
            res.redirect("/listings");
        });
        
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.signupForm = (req, res)=> {
    res.render("users/signup.ejs");
}

module.exports.loginForm = (req, res) => {
    res.render("users/login.ejs");
}
module.exports.loginUser = async (req, res) => {
    req.flash("success", "Welcome to stayZZ, you are logged in");
    let url = res.locals.redirectUrl || "/listings";
    res.redirect(url);
}


module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect("/listings");
    })
}