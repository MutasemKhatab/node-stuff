import { ApiError } from "../common/api-error.ts";
import {
  RegisterModel,
  RegisterResponse,
  UserModel,
} from "../services/auth/auth.types.ts";
import dbconn from "./db.ts";

/**
 * @function create
 * Inserts a new user into the database.
 * @param {RegisterModel} user - The user data to insert.
 * @returns id != 0 if the user was created successfully, otherwise id = 0.
 */
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

/**
 * @function findByEmail
 * Retrieves a user by their email address.
 * @param {string} email - The email address to search for.
 * @returns {Promise<UserModel | null>} A promise that resolves to the user data or null if not found.
 * @throws {ApiError} If there is a database error while finding the user.
 */
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

export async function updatePassword(
  email: string,
  newPassword: string
): Promise<void> {
  try {
    const db = await dbconn();
    await db.run(`UPDATE users SET password = ? WHERE email = ?;`, [
      newPassword,
      email,
    ]);
  } catch (err) {
    throw new ApiError("Database error while updating password", 500, err);
  }
}
