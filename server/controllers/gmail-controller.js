const { google } = require("googleapis");
const { getOAuth2Client } = require("../utils/google-client.js");
const ClassifiedMapping = require("../models/classifiedMapping.js");

const fetchEmails  = async (req, res) => {
    const { date, emailCount } = req.body;
    const user = req.user;
    if(!user || !user.refreshToken){
        return res.status(401).send("<h1>Can't get emails.</h1>");
    }
    const auth = getOAuth2Client(user);
    const gmail = google.gmail({ version: "v1", auth});
    const formattedDate = date.replace("/-/g", "/");
    const queryDate = `before:${formattedDate};`

    const resList = await gmail.users.messages.list({
        userId: "me",
        maxResults: emailCount,
        q: queryDate,
    });

    const messageIDs = resList.data.messages || []
    const emails = await Promise.all(
        messageIDs.map(async(msg) => {
            const email = await gmail.users.messages.get({
                userId: "me",
                id: msg.id,
                format: "full"
            });

            const headers = email.data.payload.headers;
            const subjectHeader = headers.find(h => h.name === "Subject");
            const fromHeader = headers.find(h => h.name === "From");
            const dateHeader = headers.find(h => h.name === "Date");

            const form = fromHeader ? fromHeader.value : "";
            const { name, senderEmail } = extractNameAndEmail(form);

            return {
                messageID: email.data.id,
                name: name,
                senderEmail: senderEmail,
                subject: subjectHeader ? subjectHeader.value : "",
                date: dateHeader ? dateHeader.value : "",
                summary: email.data.snippet
            }
        })
    )

    // Sending data to ML service in flask to classify emails
    const classifiedEmails = await classify(emails);

    // Storing the mapping received from Flask Model to DB temporarily till user prompts and select the labels he want to delete
    await tempStoreMapping(classifiedEmails, req.user._id);

    // Generate summary for mapping and return to frontend
    const summary = labelSummary(classifiedEmails)
    res.json(summary);
}

const classify = async(emails) => {
    const classifiedEmailsResponse = await fetch(process.env.ML_SERVICE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emails)
    });
    if (!classifiedEmailsResponse.ok) {
        return res.status(classifiedEmailsResponse.status).json({ error: "Error from ML service" });
    }
    const classifiedEmails = await classifiedEmailsResponse.json()
    return classifiedEmails;
};

const tempStoreMapping = async(classifiedEmails, userID) => {
    // Using batch processing
    // const emailsWithUserID = classifiedEmails.map((email) => {
    //     return{
    //         userID: userID,
    //         ...email,
    //     }
    // })
    // await ClassifiedMapping.insertMany(emailsWithUserID, { ordered: false })
    
    for (const email of classifiedEmails) {
        try {
            await ClassifiedMapping.create({
                userID: userID,
                ...email
            });
        } catch (error) {
            if (error.code === 11000) {
                // Duplicate key error, just ignore
                console.log(`Duplicate messageID ${email.messageID}, skipping.`);
            } else {
                // Log other errors
                console.error("Error saving email:", error);
            }
        }
    }
}

const labelSummary = (classifiedEmails) => {
    const labelStats = {};
    for(const email of classifiedEmails){
        const label = email.predictedLabel;
        // Calculating Count
        if(!labelStats[label]){
            labelStats[label] = {
                count: 0,
                examples: []
            }
        }
        labelStats[label].count += 1;
        // Selecting few examples for preview in frontend
        if(labelStats[label].examples.length < 3){
            labelStats[label].examples.push(email);
        }
    }
    return labelStats;
}

function extractNameAndEmail(rawStr){
    const match = rawStr.match(/^(.*)<(.+)>$/);
    if(match){
        return {
            name: match[1].trim().replace(/"/g, ""),
            senderEmail: match[2].trim()
        }
    }else{
        return{
            name: "",
            senderEmail: rawStr.trim()
        }
    }
}

module.exports = {
    fetchEmails
}