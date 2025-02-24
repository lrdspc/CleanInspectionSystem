import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInspectionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/inspections", async (_req, res) => {
    const inspections = await storage.listInspections();
    res.json(inspections);
  });

  app.get("/api/inspections/:id", async (req, res) => {
    const inspection = await storage.getInspection(Number(req.params.id));
    if (!inspection) {
      res.status(404).json({ message: "Inspection not found" });
      return;
    }
    res.json(inspection);
  });

  app.post("/api/inspections", async (req, res) => {
    const result = insertInspectionSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid inspection data", errors: result.error });
      return;
    }
    const inspection = await storage.createInspection(result.data);
    res.status(201).json(inspection);
  });

  const httpServer = createServer(app);
  return httpServer;
}
