import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export interface JWTPayload {
    userId: number;
    role: "USER" | "OWNER" | "ADMIN";
}

export const verifyAccessToken = (incomingToken: string): JWTPayload => {
    try {
        const decoded = jwt.verify(incomingToken, ACCESS_SECRET);
        return decoded as JWTPayload;
    } catch (error) {
        throw new Error("INVALID_TOKEN");
    }
};

export const signAccessToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: "15m", // short expiry
    });
};

export const signRefreshToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: "7d", // longer expiry
    });
};
export const verifyRefreshToken = (incomingToken: string): JWTPayload => {
    try {
        const decoded = jwt.verify(incomingToken, REFRESH_SECRET);
        return decoded as JWTPayload;
    } catch (error) {
        throw new Error("INVALID_REFRESH_TOKEN");
    }
};