import { hashSync, compareSync } from 'bcrypt';
import { createHash } from 'crypto';

/**
 * Hash password string using 13 round salts
 * @param pass string password to hash
 * @returns hashed password
 */
export const hash = (pass: string): string => hashSync(pass, 13);

/**
 * Compare informed password with saved hashPassword
 * @param pass string password
 * @param hashedPass hashed password
 * @returns if pass === to hashedPassword
 */
export const hashCompare = (pass: string, hashedPass: string): boolean =>
  compareSync(pass, hashedPass);

export const generateUniqueHash = (uuid1, uuid2) =>
  createHash('sha256')
    .update(String(uuid1 + uuid2))
    .digest('base64');
