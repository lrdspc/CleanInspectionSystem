import { pgTable, text, serial, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const tileSpecSchema = z.object({
  model: z.string().optional(),
  thickness: z.string().optional(),
  dimensions: z.string().optional(),
  count: z.string().optional(),
});

export const inspections = pgTable("inspections", {
  id: serial("id").primaryKey(),
  dateInspected: date("date_inspected").notNull(),
  clientName: text("client_name").notNull(),
  constructionType: text("construction_type").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  protocolNumber: text("protocol_number").notNull(),
  subject: text("subject").notNull(),
  technicianName: text("technician_name").notNull(),
  department: text("department").notNull(),
  unit: text("unit").notNull(),
  coordinator: text("coordinator").notNull(),
  manager: text("manager").notNull(),
  region: text("region").notNull(),
  issues: text("issues").array(),
  tileSpecs: jsonb("tile_specs").array().$type<z.infer<typeof tileSpecSchema>[]>()
});

export const insertInspectionSchema = createInsertSchema(inspections);
export type InsertInspection = z.infer<typeof insertInspectionSchema>;
export type Inspection = typeof inspections.$inferSelect;