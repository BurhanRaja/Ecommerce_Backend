const express = require("express");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerJson = require("./swagger.json");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/api-docs", swaggerUI.serve);
app.get(
  "/api-docs",
  swaggerUI.setup(swaggerJson, {
    customCssUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.js",
  })
);

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to Burhan's Ecommerce App",
  });
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

app.use("/api/sellerorder", require("./routes/sellerorder/index")); // Seller Order

app.use("/api/payments", require("./routes/payment/index")); // Payment

module.exports = app;
