const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const dbUrl =
  "mongodb+srv://deffinder:pyB10mCQbpgGz4Qv@cluster0.ewpqtiz.mongodb.net/Elecdhan?retryWrites=true&w=majority";

const Schema = mongoose.Schema;
const loginSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: { type: Date, default: Date.now },
});

const Login = mongoose.model("login", loginSchema);

mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

router.get("/", (req, res) => {
  res.send("login is working");
});

router.post("/save", async (req, res) => {
  try {
    const login = new Login(req.body);
    await login.save();
    res.sendStatus(200);
    console.log(req.body);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.post("/", async (req, res) => {
  try {
    const emails = await Login.find({ email: req.body.email });

    if (emails.length > 0) {
      const passwords = emails.map((email) => email.password);
      const result = passwords.includes(req.body.password);

      if (result) {
        res.status(200).json({ message: "Login successful" });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(400).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
