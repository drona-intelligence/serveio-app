import bcrypt from "bcrypt";
import { prisma } from "../src/utils/prismaClient.js";

export async function seedAdmin() {
    const existing = await prisma.user.findUnique({
        where: { email: "admin@gmail.com" },
    });

    if (existing) return;

    const hashedPassword = await bcrypt.hash("AdminPassword123", 10);

    await prisma.user.create({
        data: {
            name: "Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            phoneNumber: "0000000000",
            role: "ADMIN",
        },
    });

    console.log("Admin seeded successfully.");
}
