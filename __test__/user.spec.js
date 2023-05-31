const request = require("supertest");
const app = require("../app.js");
const { default: mongoose } = require("mongoose");
const { MONGO_URL } = require("../config/config.js");

let token = "";

describe("User Registeration and Authentication", () => {
  beforeAll(async () => {
    await mongoose.connect(MONGO_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Register Success
  test("Register User", async () => {
    const response = await request(app).post("/api/client/register").send({
      fname: "test",
      lname: "test2",
      email: "tugrp@example.com",
      password: "testing",
      phone: 8766383933,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Successfully Registered!");
    expect(response.body.token).toBeDefined();
  });

  // Register Fail if User already exists
  test("Register User Fail if User already exists", async () => {
    const response = await request(app).post("/api/client/register").send({
      fname: "test",
      lname: "test2",
      email: "tugrp@example.com",
      password: "testing",
      phone: 8766383933,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("User already exists");
  });

  // Login
  test("user login", async () => {
    const payload = {
      email: "tugrp@example.com",
      password: "testing",
    };
    const response = await request(app).post("/api/client/login").send(payload);
    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.token).not.toBeUndefined();
    token += response.body.token;
  });

  // Test Login if user not exists
  test("user login if user not exists", async () => {
    const payload = {
      email: "tugrp123@example.com",
      password: "testing",
    };
    const response = await request(app).post("/api/client/login").send(payload);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid Credentials.");
  });

  // Test Login if password is not correct
  test("user login if password is not correct", async () => {
    const payload = {
      email: "tugrp@example.com",
      password: "testing123",
    };
    const response = await request(app).post("/api/client/login").send(payload);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid Credentials.");
  });
});

describe("Read, Update and Delete a User", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Reading User
  test("Reading the User", async () => {
    const response = await request(app)
      .get("/api/client")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user).not.toBeUndefined();
    expect(response.body.user.first_name).toBe("test");
    expect(response.body.user.last_name).toBe("test2");
    expect(response.body.user.email).toBe("tugrp@example.com");
  });

  // Check if User does not found while Update
  test("Check if User does not found while Update", async () => {
    let data = {
      user: {
        id: "12345",
      },
    };
    let authToken = jwt.sign(data, process.env.SECRET_KEY);
    const response = await request(app)
      .get("/api/client/update")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("404 Not Found.");
  });

  // Updating User
  test("Updating the User", async () => {
    const payload = {
      fname: "Arnold",
      lname: "Schwarzenegger",
      email: "arnold1234@gmail.com",
      password: "Arnold@123",
      phone: 9758374932,
    };
    const response = await request(app)
      .put("/api/client/update")
      .send(payload)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user).not.toBeUndefined();
  });

  // Check if User does not found while deletion
  test("Check if User does not found while deletion", async () => {
    let data = {
      user: {
        id: "12345",
      },
    };
    let authToken = jwt.sign(data, process.env.SECRET_KEY);
    const response = await request(app)
      .delete("/api/client/delete")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("404 Not Found.");
  });

  // Delete User
  test("Delete the User", async () => {
    const response = await request(app)
      .delete("/api/client/delete")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User Successfully Deleted.");
  });
});
