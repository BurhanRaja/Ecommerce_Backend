const request = require("supertest");
const app = require("../index.js");
const mongoose = require("mongoose");

let token = "";

describe("User Auth check", () => {
  beforeAll(async (done) => {
    await mongoose.connect("mongodb://localhost:27017");
    done();
  });
  afterAll(async (done) => {
    await mongoose.connection.close();
    done();
  });

  test("user registeration", async () => {
    const payload = {
      fname: "Arnold",
      lname: "Schwarzenegger",
      email: "arnold@gmail.com",
      password: "Arnold@123",
      phone: 9758374932,
    };
    const response = await request(app)
      .post("/api/client/register")
      .send(payload);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).not.toBeUndefined();
  });

  test("user login", async () => {
    const payload = {
      email: "arnold@gmail.com",
      password: "Arnold@123",
    };
    const response = await request(app).post("/api/client/login").send(payload);
    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.token).not.toBeUndefined();
    token = response.body.token;
  });
});
