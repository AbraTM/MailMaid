const { google } = require("googleapis");

const getOAuth2Client = (user) => {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "http://localhost:5000/api/v1/auth/google/callback"
    );

    oAuth2Client.setCredentials({
        refresh_token: user.refreshToken
    });
    
    return oAuth2Client;
}

module.exports = { getOAuth2Client }