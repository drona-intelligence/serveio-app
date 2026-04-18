import { app } from "./app.js";
import { seedAdmin } from "../prisma/seed.js";

const PORT = process.env.PORT || 3000;

await seedAdmin();
app.listen(PORT, () => console.log(`listening on ${PORT}`));