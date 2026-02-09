import bcrypt from "bcrypt";

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare a plain password with a hashed password
 * @param plain - Plain text password
 * @param hashed - Hashed password
 * @returns True if passwords match
 */
export async function comparePasswords(
  plain: string,
  hashed: string
): Promise<boolean> {
  return await bcrypt.compare(plain, hashed);
}
