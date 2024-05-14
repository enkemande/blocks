import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  // username: text("username").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export type User = typeof users.$inferSelect;

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const blocks = pgTable("blocks", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  ownerId: text("owner_id")
    .references(() => users.id)
    .notNull(),
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
  downloadUrl: text("download_url"),
  path: text("path"),
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

export const usersRelations = relations(users, ({ many }) => ({
  blocks: many(blocks),
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const blocksRelations = relations(blocks, ({ many, one }) => ({
  files: many(files),
  user: one(users, {
    fields: [blocks.ownerId],
    references: [users.id],
  }),
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
