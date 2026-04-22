import { prisma } from "../utils/prismaClient.js";
import {
    verifyRefreshToken,
    signAccessToken,
    signRefreshToken,
} from "../utils/jwt.js";

export const refreshService = async (incomingRefreshToken: string) => {
    const payload = verifyRefreshToken(incomingRefreshToken);

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, role: true, refreshToken: true },
    });

    if (!user) {
        const error = new Error("USER_NOT_FOUND");
        (error as any).statusCode = 404;
        throw error;
    }

    if (user.refreshToken !== incomingRefreshToken) {
        const error = new Error("INVALID_REFRESH_TOKEN");
        (error as any).statusCode = 401;
        throw error;
    }

    const jwtPayload = { userId: user.id, role: user.role };
    const newAccessToken = signAccessToken(jwtPayload);
    const newRefreshToken = signRefreshToken(jwtPayload);

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};