require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
const MAILCHIMP_DC = process.env.MAILCHIMP_DC;

app.post("/subscribe", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        const response = await axios.post(
            `https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members/`,
            {
                email_address: email,
                status: "subscribed"
            },
            {
                headers: {
                    Authorization: `apikey ${MAILCHIMP_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.status(200).json({ message: "Subscription successful", data: response.data });
    } catch (error) {
        res.status(error.response.status).json({
            error: error.response.data.detail || "Failed to subscribe"
        });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
