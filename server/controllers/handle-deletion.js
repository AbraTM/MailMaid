const { google } = require("googleapis");
const { getOAuth2Client } = require("../utils/google-client.js");
const ClassifiedMapping = require("../models/classifiedMapping.js");

const handleDeletion = async(req, res) => {
    const { categories } = req.body;
    const user = req.user;
    if(!user || !user.refreshToken){
        return res.status(401).send("<h1>Can't delete emails.</h1>");
    }
    const auth = getOAuth2Client(user);
    const gmail = google.gmail({ version: "v1", auth});
    
    // Get emails of the selected categories
    const selectedEmails = await ClassifiedMapping.find({
        predictedLabel: { $in: categories },
        userID: user._id
    })

    if(selectedEmails.length === 0){
        return res.status(401).send("<h1>No emails doung in the selected categories.</h1>");
    }
    const messageIDs = selectedEmails.map((email) => email.messageID)

    for (const id of messageIDs) {
      await gmail.users.messages.trash({
        userId: "me",
        id: id,
      });
    }
    res.json({ msg: "All emails moved to trash successfully.", count: messageIDs.length });
}

module.exports = {
    handleDeletion
}