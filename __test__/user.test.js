const request = require("supertest");
const app = require("../app.js");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const User = require("../model/User.js");
const { SECRET_KEY } = require("../config/config.js");

let user = "";

beforeEach(async () => {
  await mongoose.connect("mongodb://localhost:27017");
});

afterEach(async () => {
  await mongoose.connection.close();
});

describe("User Registeration and Authentication", () => {
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

  test("user login", async () => {
    const payload = {
      email: "tugrp@example.com",
      password: "testing",
    };
    const response = await request(app).post("/api/client/login").send(payload);
    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.token).not.toBeUndefined();

    user = await User.findOne({ email: payload.email });
  });
});

async function loginUser(email, password) {
  const payload = {
    email,
    password,
  };
  const response = await request(app).post("/api/client/login").send(payload);
  return response.body.token;
}

// Reading User
describe("Read, Update and Delete a User", () => {
  test("Reading the User", async () => {
    let data = {
      user: {
        id: user._id,
      },
    };
    let privateKey = SECRET_KEY;

    const response = await request(app)
      .get("/api/client")
      .set("Authorization", `Bearer ${jwt.sign(data, privateKey)}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user).not.toBeUndefined();
    expect(response.body.user.first_name).toBe("test");
    expect(response.body.user.last_name).toBe("test2");
    expect(response.body.user.email).toBe("tugrp@example.com");
  });

  // Updating User
  test("Updating the User", async () => {
    let data = {
      user: {
        id: user._id,
      },
    };
    let privateKey = SECRET_KEY;

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
      .set("Authorization", `Bearer ${jwt.sign(data, privateKey)}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user).not.toBeUndefined();
  });

  // Delete User
  test("Delete the User", async () => {
    let data = {
      user: {
        id: user._id,
      },
    };
    let privateKey = SECRET_KEY;

    const response = await request(app)
      .delete("/api/client/delete")
      .set("Authorization", `Bearer ${jwt.sign(data, privateKey)}`);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User Successfully Deleted.");
  });
});
