const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadPath = path.join(__dirname, '../../src/images/');
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Add your Cloudinary credentials here
          
cloudinary.config({ 
  cloud_name: 'dkz9hgabc', 
  api_key: '248158938386447', 
  api_secret: '2zUvGw3X6edfttNck5xylQqUc2k' 
});

const Schema = mongoose.Schema;

const voterSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

const Voter = mongoose.model("voter", voterSchema);

router.get("/", async (req, res, next) => {
  try {
    // Fetch all documents from MongoDB
    const voters = await Voter.find();

    if (!voters || voters.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }

    // Convert image data to base64
    const dataWithBase64 = voters.map(item => {
      if (item.image && item.image.data) {
        const imgBase64 = item.image.data.toString('base64');
        item.image.data = imgBase64;
      }
      return item;
    });

    res.json(dataWithBase64);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Check if an image was uploaded
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    const { name, phoneNumber, age, gender, address } = req.body;

    const newVoter = new Voter({
      name,
      phoneNumber,
      age,
      gender,
      address,
      image: result.secure_url,  // Save the Cloudinary URL
    });

    await newVoter.save();
    res.sendStatus(200);
    console.log("Voter data saved successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;