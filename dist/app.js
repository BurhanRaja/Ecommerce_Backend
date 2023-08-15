import express from "express";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerJson from "./swagger.json" assert { type: "json" };
import bodyParser from "body-parser";
import { userRouter } from "./routes/client.js";
import { userAddressRouter } from "./routes/useraddress.js";
import { sellerRouter } from "./routes/seller.js";
import { sellerInfoRouter } from "./routes/sellerinfo.js";
import { cartRouter } from "./routes/cart.js";
import { categoryRouter } from "./routes/category.js";
import { parentCategoryRouter } from "./routes/parentcategory.js";
import { subCategoryRouter } from "./routes/subcategory.js";
import { productRouter } from "./routes/product.js";
import { orderRouter } from "./routes/order.js";
import { discountRouter } from "./routes/discount.js";
import { sellerOrderRouter } from "./routes/sellerorder.js";
import { paymentRouter } from "./routes/payment.js";
const appExp = express();
appExp.use(bodyParser.urlencoded({ extended: false }));
appExp.use(express.static("public"));
appExp.use("/api-docs", swaggerUI.serve);
appExp.get("/api-docs", swaggerUI.setup(swaggerJson, {
    customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.css",
}));
appExp.get("/", (req, res) => {
    res.send({
        message: "Welcome to Burhan's Ecommerce appExp",
    });
});
appExp.use(cors());
appExp.use(express.json());
appExp.use("/api/client", userRouter); // Client or User
appExp.use("/api/user/address", userAddressRouter); // User Address
appExp.use("/api/seller", sellerRouter); // Admin or company or seller
appExp.use("/api/seller/info", sellerInfoRouter); // Seller Info
appExp.use("/api/parentcategory", parentCategoryRouter); // Parent Category
appExp.use("/api/category", categoryRouter); // Category
appExp.use("/api/subcategory", subCategoryRouter); // Subcategory
appExp.use("/api/product", productRouter); // Products
appExp.use("/api/discount", discountRouter); // Discount
appExp.use("/api/cart", cartRouter); // Cart
appExp.use("/api/order", orderRouter); // Order
appExp.use("/api/sellerorder", sellerOrderRouter); // Seller Order
appExp.use("/api/payments", paymentRouter); // Payment
export default appExp;
