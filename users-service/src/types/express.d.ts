import type { Request } from "express";
import { Express } from "express";
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                role: "USER" | "OWNER" | "ADMIN";
            };
        }
    }
}