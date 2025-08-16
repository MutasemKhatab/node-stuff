import { afterEach, beforeEach, expect, test } from "vitest";
import dbconn from "../../../src/db/db.ts";

beforeEach(async () => {
  await fetch("http://localhost:3000/auth/register", {
    method: "POST",
    headers: { "Content-Type": "Application/json" },
    body: JSON.stringify({
      email: "testlogin@example.com",
      password: "12345678",
    }),
  });
});

afterEach(async () => {
  const db = await dbconn();
  await db.run(`
               DELETE FROM users WHERE email = 'testlogin@example.com';
               `);
});

test("testing simple login should return token", async () => {
  const res = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "Application/json" },
    body: JSON.stringify({
      email: "testlogin@example.com",
      password: "12345678",
    }),
  });
  expect(res.status).toBe(200);
  const result = await res.json();
  expect(result.token).toBeDefined();
});

test("testing login with wrong password should fail", async () => {
  const res = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "Application/json" },
    body: JSON.stringify({
      email: "testwronglogin@example.com",
      password: "wrongpassword",
    }),
  });
  expect(res.status).toBe(500);
});
