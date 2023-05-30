const request = require("supertest");
const app = require("../app.js");
const { default: mongoose } = require("mongoose");

let token = "";

describe("Register and Login of Seller", () => {
  test("Register Seller", async () => {
    const response = await request(app).post("/api/admin/register").send({
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
});
