const request = require("supertest");
const app = require("../app.js");
const { default: mongoose } = require("mongoose");

let token = "";

describe("Register and Login of Seller", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("Register Seller", async () => {
    const response = await request(app).post("/api/seller/register").send({
      fname: "Burhan",
      lname: "Raja",
      email: "burhan@raja.com",
      password: "Burhan@123",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).not.toBeUndefined();
    expect(response.body.message).toBe("Successfully Registered!");
  });

  test("Login Seller", async () => {
    const response = await app.response(app).post("/api/seller/login").send({
      email: "burhan@raja.com",
      password: "Burhan@123",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).not.toBeUndefined();
    expect(response.body.message).toBe("Successfully Logged In!");

    token += response.body.token;
  });
});

describe("CRUD on seller", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("update the Seller", async () => {
    const response = await request(app)
      .put("/api/seller/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fname: "Burhan",
        lname: "Raja",
        email: "burhan@raja.com",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.seller).toBe(typeof Object);
  });

  test("delete the User", async () => {
    const response = await request(app)
      .delete("/api/seller/delete")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("User Successfully Deleted.");
    expect(response.body.success).toBe(true);
  });
});
