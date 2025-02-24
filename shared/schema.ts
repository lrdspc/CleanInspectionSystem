import { pgTable, text, serial, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const tileSpecSchema = z.object({
  model: z.string().optional(),
  thickness: z.string().optional(),
  dimensions: z.string().optional(),
  count: z.string().optional(),
});

const issueImageSchema = z.object({
  issueType: z.string(),
  imageUrl: z.string(),
  caption: z.string().optional(),
});

export const inspections = pgTable("inspections", {
  id: serial("id").primaryKey(),
  dateInspected: date("date_inspected"),
  clientName: text("client_name"),
  constructionType: text("construction_type"),
  city: text("city"),
  address: text("address"),
  protocolNumber: text("protocol_number"),
  subject: text("subject"),
  technicianName: text("technician_name"),
  department: text("department"),
  unit: text("unit"),
  coordinator: text("coordinator"),
  manager: text("manager"),
  region: text("region"),
  issues: text("issues").array(),
  tileSpecs: jsonb("tile_specs").array().$type<z.infer<typeof tileSpecSchema>[]>(),
  issueImages: jsonb("issue_images").array().$type<z.infer<typeof issueImageSchema>[]>()
});

export const insertInspectionSchema = createInsertSchema(inspections);
export type InsertInspection = z.infer<typeof insertInspectionSchema>;
export type Inspection = typeof inspections.$inferSelect;