import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export interface JWTPayload {
    userId: number;
    role: "USER" | "OWNER" | "ADMIN";
}

export const verifyAccessToken = (token: string): JWTPayload => {
    try {
        return jwt.verify(token, ACCESS_SECRET) as JWTPayload;
    } catch {
        throw new Error("INVALID_TOKEN");
    }
};

export const verifyRefreshToken = (incomingToken: string): JWTPayload => {
    try {
        const decoded = jwt.verify(incomingToken, REFRESH_SECRET);
        return decoded as JWTPayload;
    } catch (error) {
        throw new Error("INVALID_REFRESH_TOKEN");
    }
};