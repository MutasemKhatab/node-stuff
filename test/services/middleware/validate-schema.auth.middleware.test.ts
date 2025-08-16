import express from "express";
import request from "supertest";
import { describe, expect, test } from "vitest";
import {
  loginSchema,
  registerSchema,
} from "../../../src/services/auth/auth.validators.ts";
import { validateSchema } from "../../../src/services/middleware/auth.middleware.ts";

describe("Auth Middleware", () => {
  const app = express();
  app.use(express.json());

  app.post("/login", validateSchema(loginSchema), (req, res) => {
    res.status(200).send("Login successful");
  });
  app.post("/register", validateSchema(registerSchema), (req, res) => {
    res.status(200).send("Registration successful");
  });

  test("should validate login request", async () => {
    const response = await request(app).post("/login").send({
      email: "testloginvalidator@example.com",
      password: "12345678",
    });
    expect(response.status).toBe(200);
    expect(response.text).toBe("Login successful");
  });

  test("should validate register request", async () => {
    const response = await request(app).post("/register").send({
      email: "testregistervalidator@example.com",
      password: "12345678",
    });
    expect(response.status).toBe(200);
    expect(response.text).toBe("Registration successful");
  });

  test("should return 400 for invalid login request", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "invalidemail", password: "12345678" });
    expect(response.status).toBe(400);
  });

  test("should return 400 for invalid register request", async () => {
    const response = await request(app)
      .post("/register")
      .send({ email: "invalidemail", password: "12345678" });
    expect(response.status).toBe(400);
  });
});
