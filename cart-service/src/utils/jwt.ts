import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

export interface JWTPayload {
  userId: string;
  role: string;
}

export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, ACCESS_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error("INVALID_TOKEN");
  }
};
