require("dotenv").config();
const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "DomzzSite",
});

db.connect((err) => {
  if (err) {
    console.log("Error in Connection");
    console.log(err);
  } else {
    console.log("Connected");
  }
});
const express = require("express");
const app = express();

const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const { CONNREFUSED } = require("dns");
const { Console } = require("console");
const { maxHeaderSize } = require("http");
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
app.get("/getData", (req, res) => {
  const Pizza_Sql = "SELECT * FROM pizza";
  const Sides_Sql = "SELECT * FROM sides";
  const Drinks_Sql = "SELECT * FROM drinks";
  let Pizza = [];
  let Drinks = [];
  let Sides = [];

  db.query(Pizza_Sql, (err, result) => {
    if (err) return res.json({ Error: "Pizza Table error in sql" });
    else {
      Pizza = result;
    }
  });
  db.query(Drinks_Sql, (err, result) => {
    if (err) return res.json({ Error: "Drinks Table error in sql" });
    else {
      Drinks = result;
    }
  });
  db.query(Sides_Sql, (err, result) => {
    if (err) return res.json({ Error: "Sides Table error in sql" });
    else {
      Sides = result;
      return res.json({ Status: "Success", Result: [Pizza, Sides, Drinks] });
    }
  });
});
const fs = require("fs");
app.post("/setData", (req, res) => {
  const json = fs.readFileSync("count.json", "utf-8");
  const obj = JSON.parse(json);
  obj.counter = obj.counter + 1;
  const newJSON = JSON.stringify(obj);
  fs.writeFileSync("count.json", newJSON);

  const { Customer_info, Trans_info, Order_info } = req.body;
  Customer_info["Customer_id"] = `Cs${obj.counter}`;
  Trans_info["Trans_id"] = `Tr${obj.counter}`;
  Order_info["Order_id"] = `Or${obj.counter}`;
  Order_info["Customer_id"] = `Cs${obj.counter}`;
  Order_info["Trans_id"] = `Tr${obj.counter}`;

  console.log(
    Trans_info["Trans_id"],
    Trans_info["Pay_mode"],
    Trans_info["Confirmation"]
  );
  const setCustomer = `INSERT INTO Customer (Cust_id,Customer_name, Customer_ph_no,Customer_email_id,Customer_location) VALUES('${Customer_info["Customer_id"]}','${Customer_info["Customer_name"]}','${Customer_info["Customer_ph_no"]}','${Customer_info["Customer_email_id"]}','${Customer_info["Customer_location"]}')`;

  const setOrder = `INSERT INTO order_details (Order_id,Trans_id,Customer_id,Product_id,Order_date,Total,Pay_mode) VALUES('${Order_info["Order_id"]}','${Order_info["Trans_id"]}','${Order_info["Customer_id"]}','${Order_info["Product_id"]}','${Order_info["Order_date"]}',${Order_info["Total"]},'${Order_info["Pay_mode"]}')`;

  const setTrans = `INSERT INTO trans_details (Trans_id,Pay_mode,Confirmation) VALUES('${Trans_info["Trans_id"]}','${Trans_info["Pay_mode"]}',${Trans_info["Confirmation"]})`;

  db.query(setCustomer, (err, result) => {
    if (err) {
      console.log(err);
    }
  });
  db.query(setOrder, (err, result) => {
    if (err) {
      console.log(err);
    }
  });
  db.query(setTrans, (err, result) => {
    if (err) {
      console.log(err);
    }
  });
});

app.listen(port, () => {});
