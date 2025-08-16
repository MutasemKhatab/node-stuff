import { afterEach, expect, test } from "vitest";
import dbconn from "../../../src/db/db.ts";

//remove the registered users
afterEach(async () => {
  const db = await dbconn();
  await db.run(`
               DELETE FROM users WHERE email = 'testregister@example.com';
               `);
});

test("testing simple register should return true", async () => {
  const res = await sendRegisterRequest();

  expect(res.status).toBe(200);
});

test("testing 2 register op should fail", async () => {
  const res1 = await sendRegisterRequest();

  const res2 = await sendRegisterRequest();

  const result1 = await res1.json();
  const result2 = await res2.json();

  expect(res1.status).toBe(200);
  expect(res2.status).toBe(200);
  expect(result1.id).not.toBe(0);
  expect(result1.id).not.toBeNull();
  expect(result2.id).toBe(0);
});

async function sendRegisterRequest() {
  return await fetch("http://localhost:3000/auth/register", {
    method: "POST",
    headers: { "Content-Type": "Application/json" },
    body: JSON.stringify({
      email: "testregister@example.com",
      password: "12345678",
    }),
  });
}


