const request = require("supertest");
const app = require("../app.js");
const { default: mongoose } = require("mongoose");

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017");
})

afterAll(async () => {
    await mongoose.connection.close();
})

test("", async () => {
    const response = await request(app).get("/api/product/all/products");
    expect(response.statusCode).toBe(200);
})