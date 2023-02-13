const express = require("express");
const cors = require("cors");
const connectToMongoDB = require("./db");

connectToMongoDB();

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(cors());
app.use(express.json())

app.use("/api/client", require("./routes/client/index"));
app.use("/api/seller", require("./routes/seller/index"));

// TODO:

// Database Tables:-

// Products
// Categories
// Sub-Categories
// User
// User Address
// Seller
// Company
// Orders
// Discount

// Client API

// On Every Purchase send a notification

// Authentication
// Login
// Register

// Get User Related Details
// Get User Profile
// Get the Past Purchase

// Fashion and Electronics
// Get All Items
// Get Filtered Items based on sub-category like bags, watches, men, women
// Get Filtered Items based on Price
// Get Top Products
// Get Featured Products
// Get Individual Item Card, Reviews, Description

// Categories
// Get All Categories
// Get sub-category of a particular Category

// Cart
// Post/Add product to cart
// Get the Products for Cart
// Get the calculated amount by adding gst and shipping charges

// Buy Now
// Flow :- Add to Cart, Redirect to Checkout
// Get Existing Address if yes OR display a form to add address.
// Payment Integration

// After Payment
// POST/Add the order to the Order table.

// Seller API

// Authentication
// Register a Brand or Company
// Login

// Products
// CRUD on Products
// CRUD on Sub-categories

// Orders
// Get All Orders that you get
// POST/Add to order (Delivered or Pending)

// Earnings
// Get Payment after client Pay

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
