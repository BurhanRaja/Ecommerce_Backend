const express = require("express");
const cors = require("cors");
const connectToMongoDB = require("./db");
const { PORT } = require("./config/config");
const dotenv = require("dotenv");
dotenv.config();

connectToMongoDB();

const app = express();
const port = PORT;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(cors());
app.use(express.json());

app.use("/api/client", require("./routes/client/index")); // Client or User
app.use("/api/user/address", require("./routes/useraddress/index")); // User Address

app.use("/api/seller", require("./routes/seller/index")); // Admin or company or seller
app.use("/api/seller/info", require("./routes/sellerinfo/index")); // Seller Info

app.use("/api/parentcategory", require("./routes/parentcategory/index")); // Parent Category
app.use("/api/category", require("./routes/category/index")); // Category
app.use("/api/subcategory", require("./routes/subcategory/index")); // Subcategory

app.use("/api/product", require("./routes/product/index")); // Products

app.use("/api/discount", require("./routes/discount/index")); // Discount

app.use("/api/cart", require("./routes/cart/index")); // Cart

app.use("/api/order", require("./routes/order/index")); // Order

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

// TODO:

// Subtract Quantity from Product info
// Add Orders to SellerOrders
// Cancel Order

// ! Completed
// Seller
// User

// Seller Info
// User Address

// Parent Category
// Category
// Subcategory
// Product
