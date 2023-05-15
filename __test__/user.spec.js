const request = require("supertest");
const app = require("../app.js");
const mongoose = require("mongoose");

let token = "";

describe("User Auth check", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017");
  });
  afterAll(async () => {
    await mongoose.connection.close();
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

describe("Read, Update and Delete User", () => {
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

    console.log(token);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user).not.toBeUndefined();
    expect(response.body.user.first_name).toBe("Arnold");
    expect(response.body.user.last_name).toBe("Schwarzenegger");
    expect(response.body.user.email).toBe("arnold@gmail.com");
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

  // Delete User
  test("Delete the User", async () => {
    const response = await request(app)
      .delete("/api/client/delete")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User Successfully Deleted.");
  });
});
