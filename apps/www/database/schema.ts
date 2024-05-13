import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const moduleTypeEnum = pgEnum("moduleType", [
  "node_module",
  "local_module",
]);

export const blocks = pgTable("blocks", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
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

export const modules = pgTable("modules", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  fileId: integer("file_id")
    .references(() => files.id)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => {
    return new Date();
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const blocksRelations = relations(blocks, ({ many }) => ({
  files: many(files),
}));

export const filesRelations = relations(files, ({ one, many }) => ({
  modules: many(modules),
  block: one(blocks, {
    fields: [files.blockId],
    references: [blocks.id],
  }),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  file: one(files, {
    fields: [modules.fileId],
    references: [files.id],
  }),
}));
