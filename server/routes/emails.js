const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/verify-token.js");
const { fetchEmails } = require("../controllers/gmail-controller.js");
const { handleDeletion } = require("../controllers/handle-deletion.js");

router.post("/", verifyToken, fetchEmails);
router.post("/handle-deletion", verifyToken, handleDeletion);

module.exports = router;