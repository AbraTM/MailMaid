const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.get("/", 
    passport.authenticate("google", {
        scope: ["profile", "email", "https://www.googleapis.com/auth/gmail.modify"], 
        accessType: "offline",
        prompt: "consent"
    })
);
router.get("/callback", 
    passport.authenticate('google', {
        failureRedirect: "google-oauth-failed"
    }), (req, res) => {
        const data = {
            id: req.user._id,
            name: req.user.name
        }
        const token = jwt.sign(data, process.env.JWT_SECRET);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000 // 1 Day
        })
        console.log("Cookie Set!!");
        res.redirect(`${process.env.FRONTED_URL}/emails`);
    }
);

module.exports = router;