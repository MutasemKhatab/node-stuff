import { AsyncDatabase } from "promised-sqlite3";

/**
 * @function getconn
 * Opens a connection to the SQLite database and ensures the users table exists.
 * @returns {Promise<AsyncDatabase>} A promise that resolves to the database connection.
 */
export default async function getconn() {
  const db = await AsyncDatabase.open("mydb.sqlite");

  await db.run(`
             CREATE TABLE IF NOT EXISTS users (
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               email TEXT NOT NULL UNIQUE,
               password TEXT NOT NULL
             )
`);

  return db;
}
