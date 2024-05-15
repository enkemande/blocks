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

export const usersTable = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  username: text("username").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export type User = typeof usersTable.$inferSelect;

export const accountsTable = pgTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
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

export const sessionsTable = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokensTable = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const blocksTable = pgTable("blocks", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  framework: text("framework"),
  library: text("library"),
  description: text("description"),
  visibility: text("visibility").notNull(),
  ownerId: text("owner_id")
    .references(() => usersTable.id)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => {
    return new Date();
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const filesTable = pgTable("files", {
  id: serial("id").primaryKey().notNull(),
  downloadUrl: text("download_url"),
  path: text("path"),
  filename: varchar("filename", { length: 100 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  size: integer("size").notNull(),
  blockId: integer("block_id")
    .references(() => blocksTable.id)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => {
    return new Date();
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const modulesTable = pgTable("modules", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  fileId: integer("file_id")
    .references(() => filesTable.id)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => {
    return new Date();
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  blocks: many(blocksTable),
  accounts: many(accountsTable),
  sessions: many(sessionsTable),
}));

export const accountsRelations = relations(accountsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [accountsTable.userId],
    references: [usersTable.id],
  }),
}));

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

export const blocksRelations = relations(blocksTable, ({ many, one }) => ({
  files: many(filesTable),
  user: one(usersTable, {
    fields: [blocksTable.ownerId],
    references: [usersTable.id],
  }),
}));

export const filesRelations = relations(filesTable, ({ one, many }) => ({
  modules: many(modulesTable),
  block: one(blocksTable, {
    fields: [filesTable.blockId],
    references: [blocksTable.id],
  }),
}));

export const modulesRelations = relations(modulesTable, ({ one, many }) => ({
  file: one(filesTable, {
    fields: [modulesTable.fileId],
    references: [filesTable.id],
  }),
}));
