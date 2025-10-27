import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'dev_secret_change_me';

export type JwtPayload = {
  sub: string; 
  email: string;
  role: 'ADMIN' | 'USER';
};

export function signJwt(payload: JwtPayload, expiresIn: string = '7d'): string {
  const options = { expiresIn } as unknown as SignOptions;
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}


export function verifyJwtEdge(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    return payload as JwtPayload;
  } catch (err) {
    console.error('❌ verifyJwtEdge error:', err);
    return null;
  }
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
