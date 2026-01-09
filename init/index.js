require("dotenv").config(); // ✅ load env

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// ✅ use MongoDB Atlas from .env
const MONGO_URL = process.env.MONGO_URL;

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    // clear old data
    await Listing.deleteMany({});
    console.log("Old listings deleted");

    // insert sample data
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");

    await mongoose.connection.close();
  } catch (err) {
    console.log(err);
  }
}

main();
