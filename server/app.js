require("dotenv-flow").config();
require("express-async-errors");
require("./config/passport")
const express = require("express");
const connectDB = require("./db/connect");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const app = express();

// Setting up CORS to allow frontend to access backend
console.log(process.env.NODE_ENV);
console.log("Frontend URLs : ");
console.log(`  ${process.env.DEV_FRONTEND_URL}`);
console.log(`  ${process.env.PROD_FRONTEND_URL}\n\n`);
const corsOptions = {
    origin: [process.env.DEV_FRONTEND_URL, process.env.PROD_FRONTEND_URL],
    credentials: true
};
app.use(cors(corsOptions))

// Essential Middleware
app.use(cookieParser())
app.use(express.json()) // Parse JSON data in req.body

// Session set up
app.use(session({secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Dummy Helping Routes
const { verifyToken } = require("./middleware/verify-token.js");
app.get("/fc", verifyToken, (req, res) => {
    res.json({msg: "hello"});
})
app.post("/frontendCheck", verifyToken, (req, res) =>{
    console.log(req.user);
    console.log(req.body);
    res.json({msg: "Cokkie Success"});
});
app.get("/", (req, res) => {
    console.log("Req.User : " + req.user);
    res.send(`
        <h1>MailMaid</h1>
        <a href="/api/v1/auth/google">Login With Google</a>
        <h2>User : ${req?.user?.name}</h2> 
    `);
});
app.get("/api/v1/auth/google/google-oauth-success", (req, res) => {
    res.send('<h1>OAuth Success</h1>');
})
app.get("/api/v1/auth/google/google-oauth-failed", (req, res) => {
    res.send('<h1>OAuth Failed</h1>');
})
const ClassifiedMapping = require("./models/classifiedMapping.js");
app.get("/clear-mappings", async(req, res) => {
    await ClassifiedMapping.deleteMany({})
})

// Collect Emails Route
const emailsDataRouter = require("./routes/emails.js");
app.use("/api/v1/emails", emailsDataRouter)

// Google OAuth2.0 Route
const googleOAuthRouter = require("./routes/google-oauth2");
app.use("/api/v1/auth/google", googleOAuthRouter);

const port = process.env.PORT || 5000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`Server is listening on port ${port}...`));
    } catch (error) {
        console.log("Error : " + error);
        process.exit(-1);
    }
}
start();