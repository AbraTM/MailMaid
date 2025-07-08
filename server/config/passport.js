const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.js");

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/v1/auth/google/callback",
        passReqToCallback: true
    }, 
    async function(request, accessToken, refreshToken, profile, done) {
        try {
            console.log(profile.displayName);
            const existingUser = await User.findOne({googleID: profile.id});
            if(existingUser){
                // Update refreshToken if a new one is received
                if(refreshToken){
                    existingUser.refreshToken = refreshToken;
                    await existingUser.save();
                }
                return done(null, existingUser);
            }
            const newUser = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleID: profile.id,
                refreshToken: refreshToken
            });
            await newUser.save();
            done(null, newUser);
        } catch (error) {
            console.log(error);
            done(error, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findOne({_id: id});
        if(!user){
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error, null);
    }
})