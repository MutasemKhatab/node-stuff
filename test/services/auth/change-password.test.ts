import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { app } from "../../../main";
import getconn from "../../../src/db/db";

describe("POST /auth/change-password", () => {
  let token: string;

  beforeEach(async () => {
    // Register and login a user to get a valid token
    await request(app)
      .post("/auth/register")
      .send({ email: "test@example.com", password: "OldPass123!" });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "OldPass123!" });

    token = res.body.data.token;
  });

  afterEach(async () => {
    const db = await getconn();
    await db.run(`DELETE FROM users WHERE email = 'test@example.com';`);
  });

  it("should change the password with valid data", async () => {
    const res = await request(app)
      .post("/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        oldPassword: "OldPass123!",
        newPassword: "NewPass456!",
      });

    expect(res.status).toBe(204);
  });

  it("should not change password with incorrect old password", async () => {
    const res = await request(app)
      .post("/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        oldPassword: "WrongOldPass!",
        newPassword: "NewPass456!",
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBeDefined();
  });

  it("should not change password if not authenticated", async () => {
    const res = await request(app).post("/auth/change-password").send({
      oldPassword: "OldPass123!",
      newPassword: "NewPass456!",
    });

    expect(res.status).toBe(401);
  });

  it("should not change password if new password is too weak", async () => {
    const res = await request(app)
      .post("/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        oldPassword: "OldPass123!",
        newPassword: "123",
      });

    expect(res.status).toBe(400);
  });

  it("should not change password if new password is missing", async () => {
    const res = await request(app)
      .post("/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        oldPassword: "OldPass123!",
      });

    expect(res.status).toBe(400);
  });
});
