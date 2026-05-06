import Link from "next/link"
import {
  Banknote,
  Coffee,
  CreditCard,
  Minus,
  Plus,
  ReceiptText,
  Search,
  ShoppingBag,
  Sparkles,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCafeDashboardData } from "@/lib/cafe-dashboard"

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
})

const cartItems = [
  { name: "Cafe Latte", quantity: 2, priceCents: 2800000 },
  { name: "Butter Croissant", quantity: 1, priceCents: 2200000 },
  { name: "Iced Americano", quantity: 1, priceCents: 2400000 },
]

const orderTimeline = ["Queued", "Brewing", "Quality check", "Ready"]

export default async function PosPage() {
  const { menuItems, activeOrders } = await getCafeDashboardData()
  const subtotal = cartItems.reduce(
    (total, item) => total + item.priceCents * item.quantity,
    0
  )
  const service = Math.round(subtotal * 0.05)
  const total = subtotal + service

  return (
    <main className="min-h-[calc(100vh-var(--header-height))] bg-[#f7efe3] text-stone-950 dark:bg-[#110d09] dark:text-stone-50">
      <div className="mx-auto grid w-full max-w-7xl gap-6 p-4 md:p-6 xl:grid-cols-[1fr_400px]">
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-amber-200/70 bg-white/80 p-5 shadow-sm dark:border-amber-900/40 dark:bg-stone-950/70">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <Badge className="w-fit rounded-full bg-stone-950 text-amber-100 hover:bg-stone-900 dark:bg-amber-300 dark:text-stone-950">
                  <Sparkles className="size-4" /> Premium cashier mode
                </Badge>
                <div>
                  <h1 className="font-parkinsans text-3xl font-semibold tracking-tight md:text-5xl">POS cepat untuk peak hour.</h1>
                  <p className="text-muted-foreground mt-2 max-w-2xl">Pilih menu, cek stok, susun cart, lalu checkout dengan flow kasir yang jelas dan nyaman di desktop maupun tablet.</p>
                </div>
              </div>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/dashboard">Kembali dashboard</Link>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative md:w-96">
              <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input className="h-12 rounded-full bg-white pl-10 shadow-sm dark:bg-stone-950" placeholder="Cari espresso, latte, pastry..." />
            </div>
            <Tabs defaultValue="all" className="overflow-x-auto">
              <TabsList className="h-12 rounded-full bg-white p-1 shadow-sm dark:bg-stone-950">
                <TabsTrigger value="all" className="rounded-full px-4">Semua</TabsTrigger>
                <TabsTrigger value="coffee" className="rounded-full px-4">Coffee</TabsTrigger>
                <TabsTrigger value="non-coffee" className="rounded-full px-4">Non Coffee</TabsTrigger>
                <TabsTrigger value="pastry" className="rounded-full px-4">Pastry</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {menuItems.map((item, index) => (
              <Card key={item.name} className="group overflow-hidden border-stone-200/80 bg-white/85 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-950/10 dark:border-stone-800 dark:bg-stone-950/75">
                <div className="h-28 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.55),transparent_28%),linear-gradient(135deg,#3b2417,#120d09)] p-4 text-white">
                  <div className="flex items-start justify-between">
                    <div className="grid size-12 place-items-center rounded-2xl bg-white/12 backdrop-blur"><Coffee className="size-6" /></div>
                    <Badge className="rounded-full bg-white/15 text-white hover:bg-white/20">Stock {item.stock}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription>{item.category}</CardDescription>
                    </div>
                    <div className="text-right font-semibold">{rupiah.format(item.priceCents / 100)}</div>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-3">
                  <div className="text-sm text-muted-foreground">Terjual {item.sold} hari ini</div>
                  <Button className="rounded-full bg-stone-950 text-white hover:bg-amber-700 dark:bg-amber-300 dark:text-stone-950 dark:hover:bg-amber-200">
                    <Plus className="size-4" /> Tambah
                  </Button>
                </CardContent>
                <div className="h-1 bg-stone-100 dark:bg-stone-900"><div className="h-full bg-amber-400" style={{ width: `${Math.max(28, 88 - index * 10)}%` }} /></div>
              </Card>
            ))}
          </div>
        </section>

        <aside className="xl:sticky xl:top-[calc(var(--header-height)+1.5rem)] xl:h-[calc(100vh-var(--header-height)-3rem)]">
          <Card className="flex h-full flex-col overflow-hidden rounded-[2rem] border-stone-200/80 bg-stone-950 text-white shadow-2xl shadow-amber-950/20 dark:border-stone-800">
            <CardHeader className="border-b border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.32),transparent_32%)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Order #CD-1024</CardTitle>
                  <CardDescription className="text-stone-300">Meja 05 - Dine in</CardDescription>
                </div>
                <div className="grid size-12 place-items-center rounded-2xl bg-amber-300 text-stone-950"><ShoppingBag className="size-5" /></div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-5 p-5">
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.name} className="rounded-3xl border border-white/10 bg-white/8 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-stone-400">{rupiah.format(item.priceCents / 100)}</div>
                      </div>
                      <div className="font-semibold">{rupiah.format((item.priceCents * item.quantity) / 100)}</div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" className="size-8 rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"><Minus className="size-3" /></Button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <Button size="icon" variant="outline" className="size-8 rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"><Plus className="size-3" /></Button>
                      </div>
                      <Badge className="rounded-full bg-emerald-400/15 text-emerald-200 hover:bg-emerald-400/20">Ready</Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/8 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium"><ReceiptText className="size-4 text-amber-300" /> Timeline barista</div>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px] text-stone-400">
                  {orderTimeline.map((step, index) => (
                    <div key={step} className="space-y-2">
                      <div className={`mx-auto h-1.5 rounded-full ${index < 2 ? "bg-amber-300" : "bg-white/15"}`} />
                      <div>{step}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto space-y-4">
                <Separator className="bg-white/10" />
                <div className="space-y-2 text-sm">
                  <PriceRow label="Subtotal" value={rupiah.format(subtotal / 100)} />
                  <PriceRow label="Service 5%" value={rupiah.format(service / 100)} />
                  <PriceRow label="Total" value={rupiah.format(total / 100)} strong />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-12 rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"><Banknote className="size-4" /> Cash</Button>
                  <Button variant="outline" className="h-12 rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"><CreditCard className="size-4" /> Card</Button>
                </div>
                <Button className="h-14 w-full rounded-full bg-amber-300 text-base font-semibold text-stone-950 hover:bg-amber-200">Checkout order</Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-6 md:px-6">
        <div className="rounded-3xl border border-amber-200/70 bg-white/80 p-4 text-sm text-muted-foreground dark:border-amber-900/40 dark:bg-stone-950/70">
          Live queue: {activeOrders.length} order aktif. Halaman ini masih UI statis untuk checkout; data menu sudah memakai adapter dashboard database/fallback.
        </div>
      </div>
    </main>
  )
}

function PriceRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${strong ? "text-lg font-semibold text-white" : "text-stone-300"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}
