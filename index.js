const express = require("express");
const dotenv = require("dotenv");
//import connectDB from "./db.js";
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(session({ secret: "secret" }));

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.status(200).send(`<h1>Welcome to tehcxmail</h1>`);
});

app.get("*", (req, res) => {
  res.status(200).send(`<b>Not found</b>`);
});
app.post("/sendmail", (req, res) => {
  const { mail, subject, text, html, name } = req.body;
  if (!mail || !subject || !name) {
    res.status(400).send({ message: "incomplete data" });
    return;
  }
  var transporter = nodemailer.createTransport({
    service: "gmail", //name of email provider
    auth: {
      user: "aguchris740@gmail.com", // sender's gmail id
      pass: process.env.pass, // sender password
    },
  });
  const from = `Techx Mail Service `;
  var mailOptions = {
    from: from,
    to: mail,
    subject: `${subject} `,
    text: text || null,
    html: html || null,
  };

  try {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).send({ message: error });
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (e) {
    console.log(e);
  }
  res.status(200).send({ message: "Email sent successfully" });
});
const port = process.env.PORT || 8080;

app.listen(port, console.log(`Server running on port ${port}`));
