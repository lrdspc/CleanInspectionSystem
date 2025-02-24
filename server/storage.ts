import { inspections, type Inspection, type InsertInspection } from "@shared/schema";

export interface IStorage {
  getInspection(id: number): Promise<Inspection | undefined>;
  createInspection(inspection: InsertInspection): Promise<Inspection>;
  listInspections(): Promise<Inspection[]>;
}

export class MemStorage implements IStorage {
  private inspections: Map<number, Inspection>;
  private currentId: number;

  constructor() {
    this.inspections = new Map();
    this.currentId = 1;
  }

  async getInspection(id: number): Promise<Inspection | undefined> {
    return this.inspections.get(id);
  }

  async createInspection(insertInspection: InsertInspection): Promise<Inspection> {
    const id = this.currentId++;
    const inspection: Inspection = { ...insertInspection, id };
    this.inspections.set(id, inspection);
    return inspection;
  }

  async listInspections(): Promise<Inspection[]> {
    return Array.from(this.inspections.values());
  }
}

export const storage = new MemStorage();
