const request = require("supertest");
const app = require("../server"); // Ensure this is the correct path to your Express app
const mongoose = require("mongoose");

let authToken; // Will store the token for authentication

beforeAll(async () => {
  // Login as an existing user to get a token
  await mongoose.connect(process.env.MONGO_URL)
  const res = await request(app)
    .post("/users/login")
    .send({ email: "john@example.com", password: "password123" });

  authToken = res.body.token; // Store the JWT token
});

afterAll(async () => {
  await mongoose.connection.close(); // Close MongoDB connection after tests
});

describe("Ticket Booking API", () => {
  test("Should book a new ticket", async () => {
    const res = await request(app)
      .post("/ticket/book")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        dateOfTravel: "2025-03-15",
        modeOfTravel: "bus",
        perHeadPrice: 100,
        from: "New York",
        to: "Los Angeles",
        numberOfPassengers: 2
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("ticket");
    expect(res.body.ticket.totalPrice).toBe(200);
  });

  test("Should not allow booking without authentication", async () => {
    const res = await request(app)
      .post("/ticket/book")
      .send({
        dateOfTravel: "2025-03-15",
        modeOfTravel: "bus",
        perHeadPrice: 100,
        from: "New York",
        to: "Los Angeles",
        numberOfPassengers: 2
      });

    expect(res.statusCode).toBe(401);
   // expect(res.body.message).toBe("Unauthorized");
  });
});
