import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  OWNER = "OWNER",
}

export interface JWTPayload {
  userId: number;
  role: UserRole | string;
}

export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, ACCESS_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error("INVALID_TOKEN");
  }
};
