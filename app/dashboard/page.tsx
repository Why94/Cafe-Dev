import type { ComponentType } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowUpRight,
  PackageCheck,
  ReceiptText,
  ShoppingCart,
  Sparkles,
  TrendingUp,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getCafeDashboardData } from "@/lib/cafe-dashboard"

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
})

export default async function Page() {
  const { menuItems, activeOrders, inventory } = await getCafeDashboardData()
  const totalSales = menuItems.reduce(
    (total, item) => total + item.priceCents * item.sold,
    0
  )
  const totalOrders = menuItems.reduce((total, item) => total + item.sold, 0)
  const lowStockCount = inventory.filter((item) => item.status === "Low").length
  const bestSeller = menuItems[0]

  return (
    <main className="@container/main min-h-[calc(100vh-var(--header-height))] bg-[#f8f4ec] text-stone-950 dark:bg-[#120f0b] dark:text-stone-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-stone-200/80 bg-[#24170f] p-6 text-white shadow-2xl shadow-amber-950/10 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(245,158,11,0.42),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(252,211,77,0.18),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_38%)]" />
          <div className="absolute -right-20 -top-24 size-72 rounded-full border border-white/10 bg-white/5 blur-sm" />
          <div className="relative grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div className="space-y-6">
              <Badge className="w-fit rounded-full border-white/15 bg-white/10 px-3 py-1 text-amber-100 hover:bg-white/15">
                <Sparkles className="size-4" /> Cafe Dev Pro Max
              </Badge>
              <div className="max-w-3xl space-y-3">
                <h1 className="font-parkinsans text-4xl font-semibold tracking-tight md:text-6xl">
                  Operasi cafe terasa premium, cepat, dan terukur.
                </h1>
                <p className="max-w-2xl text-base text-amber-50/75 md:text-lg">
                  Pantau revenue, order barista, menu terlaris, dan stok bahan dengan interface yang siap dipakai owner, kasir, dan manager shift.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full bg-amber-400 text-stone-950 hover:bg-amber-300">
                  <Link href="/dashboard/pos">
                    Buka POS <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white">
                  Lihat laporan
                </Button>
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="text-sm text-amber-100/80">Best seller hari ini</div>
              <div className="mt-3 flex items-end justify-between gap-4">
                <div>
                  <div className="text-2xl font-semibold">{bestSeller?.name ?? "Belum ada data"}</div>
                  <div className="mt-1 text-sm text-amber-50/70">{bestSeller?.category ?? "Menu"}</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-semibold tabular-nums">{bestSeller?.sold ?? 0}</div>
                  <div className="text-xs uppercase tracking-[0.3em] text-amber-100/70">sold</div>
                </div>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[72%] rounded-full bg-amber-300" />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Penjualan hari ini" value={rupiah.format(totalSales / 100)} description="Target shift pagi 72% tercapai" icon={TrendingUp} tone="amber" />
          <MetricCard title="Item terjual" value={totalOrders.toString()} description="Dari menu aktif hari ini" icon={ReceiptText} tone="emerald" />
          <MetricCard title="Order aktif" value={activeOrders.length.toString()} description="Masuk antrian kasir/barista" icon={ShoppingCart} tone="sky" />
          <MetricCard title="Stok menipis" value={lowStockCount.toString()} description="Perlu dicek sebelum rush hour" icon={AlertTriangle} tone="rose" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <Card className="overflow-hidden border-stone-200/80 bg-white/80 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
            <CardHeader className="border-b bg-gradient-to-r from-white to-amber-50/60 dark:from-stone-950 dark:to-amber-950/20">
              <CardTitle>Menu performance</CardTitle>
              <CardDescription>Prioritaskan menu dengan demand tinggi dan stok aman.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-stone-50/80 dark:bg-stone-900/60">
                    <TableHead className="px-4">Menu</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-right">Harga</TableHead>
                    <TableHead className="text-right">Terjual</TableHead>
                    <TableHead className="pr-4 text-right">Stok</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((item) => (
                    <TableRow key={item.name} className="hover:bg-amber-50/60 dark:hover:bg-amber-950/20">
                      <TableCell className="px-4 font-medium">{item.name}</TableCell>
                      <TableCell><Badge variant="outline" className="rounded-full">{item.category}</Badge></TableCell>
                      <TableCell className="text-right">{rupiah.format(item.priceCents / 100)}</TableCell>
                      <TableCell className="text-right font-medium">{item.sold}</TableCell>
                      <TableCell className="pr-4 text-right">{item.stock}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-stone-200/80 bg-white/80 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
            <CardHeader>
              <CardTitle>Live order board</CardTitle>
              <CardDescription>Antrian yang sedang bergerak sekarang.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeOrders.map((order, index) => (
                <div key={order.table} className="rounded-3xl border bg-gradient-to-br from-white to-stone-50 p-4 shadow-sm dark:from-stone-950 dark:to-stone-900">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 place-items-center rounded-full bg-amber-100 text-sm font-semibold text-amber-900">{index + 1}</div>
                      <div className="font-medium">{order.table}</div>
                    </div>
                    <Badge className="rounded-full">{order.status}</Badge>
                  </div>
                  <p className="text-muted-foreground mt-3 text-sm">{order.items}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total</span>
                    <span className="font-semibold">{rupiah.format(order.totalCents / 100)}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="border-stone-200/80 bg-white/80 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
            <CardHeader>
              <CardTitle>Inventory radar</CardTitle>
              <CardDescription>Stok kritis terlihat lebih cepat sebelum service peak.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {inventory.map((item) => (
                <div key={item.item} className="flex items-center justify-between rounded-3xl border bg-stone-50/70 p-4 dark:bg-stone-900/60">
                  <div>
                    <div className="font-medium">{item.item}</div>
                    <div className="text-muted-foreground text-sm">{item.remaining}</div>
                  </div>
                  <Badge variant={item.status === "Low" ? "destructive" : "secondary"} className="rounded-full">{item.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-stone-200/80 bg-[#fff7ed] shadow-sm dark:border-stone-800 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle>Next upgrade track</CardTitle>
              <CardDescription>Jalur fitur setelah visual Pro Max.</CardDescription>
              <CardAction><PackageCheck className="text-amber-700 size-5 dark:text-amber-300" /></CardAction>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <RoadmapItem title="Menu CRUD" description="Tambah/edit menu dengan foto, kategori, harga, dan status available." />
              <RoadmapItem title="POS realtime" description="Cart interaktif, checkout, payment method, dan cetak receipt." />
              <RoadmapItem title="Analytics" description="Revenue chart per jam, menu mix, COGS, dan margin kasar." />
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}

function MetricCard({ title, value, description, icon: Icon, tone }: { title: string; value: string; description: string; icon: ComponentType<{ className?: string }>; tone: "amber" | "emerald" | "sky" | "rose" }) {
  const toneClass = {
    amber: "bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200",
    emerald: "bg-emerald-100 text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-200",
    sky: "bg-sky-100 text-sky-900 dark:bg-sky-400/15 dark:text-sky-200",
    rose: "bg-rose-100 text-rose-900 dark:bg-rose-400/15 dark:text-rose-200",
  }[tone]

  return (
    <Card className="border-stone-200/80 bg-white/80 shadow-sm transition-transform hover:-translate-y-0.5 dark:border-stone-800 dark:bg-stone-950/70">
      <CardHeader>
        <div className={`mb-4 grid size-11 place-items-center rounded-2xl ${toneClass}`}><Icon className="size-5" /></div>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent><p className="text-muted-foreground text-sm">{description}</p></CardContent>
    </Card>
  )
}

function RoadmapItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-amber-200/70 bg-white/70 p-4 dark:border-amber-900/50 dark:bg-stone-950/50">
      <div className="font-medium">{title}</div>
      <p className="text-muted-foreground mt-1">{description}</p>
    </div>
  )
}
