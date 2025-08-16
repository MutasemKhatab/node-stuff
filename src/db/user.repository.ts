import { ApiError } from "../common/api-error.ts";
import {
  RegisterModel,
  RegisterResponse,
  UserModel,
} from "../services/auth/auth.types.ts";
import dbconn from "./db.ts";

export async function create({
  email,
  password,
}: RegisterModel): Promise<RegisterResponse> {
  try {
    const db = await dbconn(); // Get fresh connection
    const result = await db.run(
      `INSERT INTO users (email, password) VALUES (?, ?);`,
      [email, password]
    );
    return { id: result.lastID };
  } catch {
    return { id: 0 };
  }
}

export async function findByEmail(email: string): Promise<UserModel | null> {
  try {
    const db = await dbconn(); // Get fresh connection
    const row = await db.get<UserModel>(
      `SELECT id, email, password FROM users WHERE email = ?;`,
      [email]
    );
    return row ?? null;
  } catch (err) {
    throw new ApiError("Database error while finding user by email", 500, err);
  }
}
