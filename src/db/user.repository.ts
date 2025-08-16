import {
  RegisterModel,
  RegisterResponse,
  UserModel,
} from "../services/auth/auth.types.ts";
import dbconn from "./db.ts";
const db = await dbconn();

/**
 * add user to the database
 * return the id on success
 * return 0 on fail
 */
export async function create({
  email,
  password,
}: RegisterModel): Promise<RegisterResponse> {
  try {
    const result = await db.run(
      `
                              INSERT INTO users
                              (email, password)
                              VALUES (?, ?);
                              `,
      [email, password]
    );
    return { id: result.lastID };
  } catch {
    return { id: 0 };
  }
}

export async function findByEmail(email: string): Promise<UserModel | null> {
  try {
    const row = await db.get<UserModel>(
      `SELECT id, email, password FROM users WHERE email = ?;`,
      [email]
    );
    return row ?? null;
  } catch (err) {
    console.error("findByEmail error:", err);
    return null;
  }
}
