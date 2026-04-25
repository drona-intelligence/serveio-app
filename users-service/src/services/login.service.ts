import bcrypt from "bcrypt";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import type { JWTPayload } from "../utils/jwt.js";
import { prisma } from "../utils/prismaClient.js";

export const loginService = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const payload: JWTPayload = {
        userId: user.id,
        role: user.role,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });

    const { password: _, refreshToken: __, ...safeUser } = user;

    return {
        accessToken,
        refreshToken,
        user: safeUser,
    };
};