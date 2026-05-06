import { relations } from "drizzle-orm"
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  priceCents: integer("price_cents").notNull(),
  stock: integer("stock").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  orderType: text("order_type").default("dine_in").notNull(),
  tableName: text("table_name"),
  status: text("status").default("queued").notNull(),
  subtotalCents: integer("subtotal_cents").default(0).notNull(),
  totalCents: integer("total_cents").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  menuItemId: integer("menu_item_id")
    .notNull()
    .references(() => menuItems.id, { onDelete: "restrict" }),
  quantity: integer("quantity").default(1).notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
  totalCents: integer("total_cents").notNull(),
})

export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  unit: text("unit").notNull(),
  quantity: integer("quantity").default(0).notNull(),
  lowStockThreshold: integer("low_stock_threshold").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  menuItem: one(menuItems, {
    fields: [orderItems.menuItemId],
    references: [menuItems.id],
  }),
}))

export const menuItemsRelations = relations(menuItems, ({ many }) => ({
  orderItems: many(orderItems),
}))
