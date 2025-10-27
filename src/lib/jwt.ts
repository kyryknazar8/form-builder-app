import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { sub: string; email: string; role: string };
  } catch {
    return null;
  }
}
