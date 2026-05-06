import { desc, eq, sql } from "drizzle-orm"

import { db } from "@/db"
import { inventoryItems, menuItems, orderItems } from "@/db/schema/cafe"

export type CafeMenuItem = {
  name: string
  category: string
  priceCents: number
  sold: number
  stock: number
}

export type CafeOrder = {
  table: string
  items: string
  totalCents: number
  status: string
}

export type CafeInventoryItem = {
  item: string
  remaining: string
  status: "Safe" | "Low"
}

export type CafeDashboardData = {
  menuItems: CafeMenuItem[]
  activeOrders: CafeOrder[]
  inventory: CafeInventoryItem[]
}

export const fallbackCafeDashboardData: CafeDashboardData = {
  menuItems: [
    { name: "Espresso", category: "Coffee", priceCents: 1800000, sold: 42, stock: 34 },
    { name: "Cafe Latte", category: "Coffee", priceCents: 2800000, sold: 58, stock: 21 },
    { name: "Iced Americano", category: "Coffee", priceCents: 2400000, sold: 37, stock: 18 },
    { name: "Matcha Cream", category: "Non Coffee", priceCents: 3200000, sold: 26, stock: 12 },
    { name: "Butter Croissant", category: "Pastry", priceCents: 2200000, sold: 31, stock: 7 },
  ],
  activeOrders: [
    { table: "Meja 03", items: "2 Latte, 1 Croissant", totalCents: 7800000, status: "Preparing" },
    { table: "Takeaway", items: "1 Iced Americano", totalCents: 2400000, status: "Ready" },
    { table: "Meja 07", items: "1 Matcha, 2 Espresso", totalCents: 6800000, status: "Queued" },
  ],
  inventory: [
    { item: "Coffee beans", remaining: "3.5 kg", status: "Safe" },
    { item: "Fresh milk", remaining: "4 liter", status: "Low" },
    { item: "Butter pastry", remaining: "7 pcs", status: "Low" },
    { item: "Paper cup", remaining: "120 pcs", status: "Safe" },
  ],
}

export async function getCafeDashboardData(): Promise<CafeDashboardData> {
  if (!process.env.DATABASE_URL) {
    return fallbackCafeDashboardData
  }

  try {
    const [menuRows, orderRows, inventoryRows] = await Promise.all([
      db
        .select({
          name: menuItems.name,
          category: menuItems.category,
          priceCents: menuItems.priceCents,
          stock: menuItems.stock,
          sold: sql<number>`coalesce(sum(${orderItems.quantity}), 0)`,
        })
        .from(menuItems)
        .leftJoin(orderItems, eq(orderItems.menuItemId, menuItems.id))
        .where(eq(menuItems.isActive, true))
        .groupBy(menuItems.id)
        .orderBy(desc(sql`coalesce(sum(${orderItems.quantity}), 0)`))
        .limit(5),
      db.query.orders.findMany({
        where: (order, { inArray }) => inArray(order.status, ["queued", "preparing", "ready"]),
        with: {
          items: {
            with: {
              menuItem: true,
            },
          },
        },
        orderBy: (order, { desc }) => [desc(order.createdAt)],
        limit: 3,
      }),
      db.select().from(inventoryItems).orderBy(inventoryItems.name).limit(6),
    ])

    if (menuRows.length === 0 && orderRows.length === 0 && inventoryRows.length === 0) {
      return fallbackCafeDashboardData
    }

    return {
      menuItems: menuRows.map((item) => ({
        ...item,
        sold: Number(item.sold),
      })),
      activeOrders: orderRows.map((order) => ({
        table: order.tableName ?? (order.orderType === "takeaway" ? "Takeaway" : order.code),
        items: order.items
          .map((item) => `${item.quantity} ${item.menuItem.name}`)
          .join(", "),
        totalCents: order.totalCents,
        status: toTitleCase(order.status),
      })),
      inventory: inventoryRows.map((item) => ({
        item: item.name,
        remaining: `${item.quantity} ${item.unit}`,
        status: item.quantity <= item.lowStockThreshold ? "Low" : "Safe",
      })),
    }
  } catch (error) {
    console.warn("Using fallback cafe dashboard data:", error)
    return fallbackCafeDashboardData
  }
}

function toTitleCase(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
}
