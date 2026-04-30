import { app } from "./app.js";

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`🛒 Cart service listening on port ${PORT}`)
});
