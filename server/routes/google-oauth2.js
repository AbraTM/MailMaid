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
        const frontend_url = process.env.NODE_ENV === 'production' ? process.env.PROD_FRONTEND_URL : process.env.DEV_FRONTEND_URL
        res.redirect(`${frontend_url}/emails`);
    }
);

module.exports = router;