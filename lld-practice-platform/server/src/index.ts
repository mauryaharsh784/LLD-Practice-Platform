import "dotenv/config";
import express from "express";
import cors from "cors";
import problemsRoutes from "./routes/problems.routes";
import attemptsRoutes from "./routes/attempts.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { seedSampleAttempts } from "./data/seed";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    dbMode: process.env.DB_MODE || "memory",
    aiProvider: process.env.AI_PROVIDER || "mock",
  });
});

app.use("/api/problems", problemsRoutes);
app.use("/api/attempts", attemptsRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

if (process.env.SEED_SAMPLE_DATA !== "false") {
  seedSampleAttempts();
}

app.listen(PORT, () => {
  console.log(`LLD Practice Platform API listening on http://localhost:${PORT}`);
  console.log(`DB_MODE=${process.env.DB_MODE || "memory"} AI_PROVIDER=${process.env.AI_PROVIDER || "mock"}`);
});
