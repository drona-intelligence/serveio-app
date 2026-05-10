import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app";

// Mock prisma
vi.mock("../src/utils/prismaClient", () => ({
    prisma: {
        menu: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
        category: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
        menuItem: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
    },
}));

// Mock authenticate middleware
vi.mock("../src/middlewares/authenticate", () => ({
    authenticate: (req: any, _res: any, next: any) => {
        req.user = { userId: 1, role: "ADMIN" };
        next();
    },
}));

// Mock requireRole middleware
vi.mock("../src/middlewares/requireRole", () => ({
    requireRole: (..._roles: string[]) => (_req: any, _res: any, next: any) => next(),
}));

import { prisma } from "../src/utils/prismaClient";

const mockMenu = {
    id: "menu-1",
    name: "Dinner Menu",
    description: "Evening specials",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
};

const mockCategory = {
    id: "cat-1",
    name: "Starters",
    description: null,
    order: 0,
    status: "active",
    menuId: "menu-1",
    createdAt: new Date(),
    updatedAt: new Date(),
};

const mockItem = {
    id: "item-1",
    name: "Spring Rolls",
    description: null,
    price: 5.99,
    isAvailable: true,
    imageUrl: null,
    displayOrder: 0,
    categoryId: "cat-1",
    createdAt: new Date(),
    updatedAt: new Date(),
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe("GET /api/v1/servio/menus", () => {
    it("should return all active menus", async () => {
        vi.mocked(prisma.menu.findMany).mockResolvedValue([mockMenu]);

        const res = await request(app).get("/api/v1/servio/menus");

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveLength(1);
    });
});

describe("GET /api/v1/servio/menus/:id", () => {
    it("should return a menu by id", async () => {
        vi.mocked(prisma.menu.findUnique).mockResolvedValue({ ...mockMenu, categories: [] } as any);

        const res = await request(app).get("/api/v1/servio/menus/menu-1");

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe("menu-1");
    });

    it("should return 404 if menu not found", async () => {
        vi.mocked(prisma.menu.findUnique).mockResolvedValue(null);

        const res = await request(app).get("/api/v1/servio/menus/nonexistent");

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });
});

describe("POST /api/v1/servio/menus/addmenu", () => {
    it("should create a menu successfully", async () => {
        vi.mocked(prisma.menu.create).mockResolvedValue(mockMenu);

        const res = await request(app)
            .post("/api/v1/servio/menus/addmenu")
            .send({ name: "Dinner Menu", status: "active" });

        expect(res.status).toBe(201);
        expect(res.body.data.name).toBe("Dinner Menu");
    });

    it("should return 400 if name is missing", async () => {
        const res = await request(app)
            .post("/api/v1/servio/menus/addmenu")
            .send({ status: "active" });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });
});

describe("PATCH /api/v1/servio/menus/updatemenu/:id", () => {
    it("should update a menu successfully", async () => {
        vi.mocked(prisma.menu.findUnique).mockResolvedValue(mockMenu);
        vi.mocked(prisma.menu.update).mockResolvedValue({ ...mockMenu, name: "Updated Menu" });

        const res = await request(app)
            .patch("/api/v1/servio/menus/updatemenu/menu-1")
            .send({ name: "Updated Menu" });

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe("Updated Menu");
    });

    it("should return 404 if menu not found on update", async () => {
        vi.mocked(prisma.menu.findUnique).mockResolvedValue(null);

        const res = await request(app)
            .patch("/api/v1/servio/menus/updatemenu/nonexistent")
            .send({ name: "Updated" });

        expect(res.status).toBe(404);
    });
});

describe("DELETE /api/v1/servio/menus/deletemenu/:id", () => {
    it("should delete a menu successfully", async () => {
        vi.mocked(prisma.menu.findUnique).mockResolvedValue(mockMenu);
        vi.mocked(prisma.menu.delete).mockResolvedValue(mockMenu);

        const res = await request(app).delete("/api/v1/servio/menus/deletemenu/menu-1");

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Menu deleted successfully");
    });
});

describe("GET /api/v1/servio/items/categories/:categoryId/items", () => {
    it("should return available items for a category", async () => {
        vi.mocked(prisma.menuItem.findMany).mockResolvedValue([mockItem]);

        const res = await request(app).get("/api/v1/servio/items/categories/cat-1/items");

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
    });
});

describe("POST /api/v1/servio/items/categories/:categoryId/items", () => {
    it("should create a menu item successfully", async () => {
        vi.mocked(prisma.category.findUnique).mockResolvedValue(mockCategory);
        vi.mocked(prisma.menuItem.create).mockResolvedValue(mockItem);

        const res = await request(app)
            .post("/api/v1/servio/items/categories/cat-1/items")
            .send({ name: "Spring Rolls", price: 5.99 });

        expect(res.status).toBe(201);
        expect(res.body.data.name).toBe("Spring Rolls");
    });

    it("should return 400 if price is missing", async () => {
        const res = await request(app)
            .post("/api/v1/servio/items/categories/cat-1/items")
            .send({ name: "Spring Rolls" });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it("should return 404 if category not found", async () => {
        vi.mocked(prisma.category.findUnique).mockResolvedValue(null);

        const res = await request(app)
            .post("/api/v1/servio/items/categories/nonexistent/items")
            .send({ name: "Spring Rolls", price: 5.99 });

        expect(res.status).toBe(404);
    });
});
