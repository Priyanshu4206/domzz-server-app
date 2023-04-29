require("dotenv").config();

const express = require("express");
const app = express();

const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const acc_id = process.env.Acc_Id;
const authToken = process.env.AuthToken;
const twilioNum = process.env.TwilioNum;

const client = require("twilio")(acc_id, authToken);
const port = 5000;
app.get("/sendConfirmMsg", (req, res) => {
  const { phone } = req.query;
  res.send(`Messaging Page of Server ${typeof phone}`);
  client.messages
    .create({
      body: `Ordered placed successfully and will be delivered shortly. Call will made to confirm your location for further reference.`,
      to: "+" + phone,
      from: twilioNum,
    })
    .then((messages) => {
      console.log(messages.body);
    });
});
app.get("/", (req, res) => {
  res.send("Home Page of Server");
});
app.listen(port, () => {
  console.log(`Listening on ${port} \n ${twilioNum}`);
});
