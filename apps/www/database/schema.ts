import { relations } from "drizzle-orm";
import {
  integer,
  json,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const blocks = pgTable("blocks", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 100 }).unique().notNull(),
  description: text("description"),
  config: json("config").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => {
    return new Date();
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const files = pgTable("files", {
  id: serial("id").primaryKey().notNull(),
  path: varchar("path", { length: 100 }).notNull(),
  filename: varchar("filename", { length: 100 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  size: integer("size").notNull(),
  blockId: integer("block_id")
    .references(() => blocks.id)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => {
    return new Date();
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const blockRelations = relations(blocks, ({ many }) => ({
  files: many(files),
}));
