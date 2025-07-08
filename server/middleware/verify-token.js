const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const verifyToken = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            res.json({msg : "Didn't receive a token."});
        }
        const userInfo = jwt.verify(token, process.env.JWT_SECRET);
        const currUser = await User.findOne({_id: userInfo.id});
        if(!currUser){
            console.error("Can't find the user.");
            res.json({msg: "User doesn't exists."})
        }
        req.user = currUser;
        next();
    } catch (error) {
        console.error("Error identifying the user.\nError : ", error);
        res.json({msg: "Error identifying the user"});
    }
}

module.exports = {
    verifyToken
}

