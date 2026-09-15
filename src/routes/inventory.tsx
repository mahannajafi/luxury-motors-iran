import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, X } from "lucide-react";
import { CarCard } from "@/components/site/CarCard";
import { Field, inputCls } from "@/components/site/form";
import { fetchBrands, fetchCars, type CarFilters } from "@/lib/cars";
import { BODY_TYPES, STATUSES, TRANSMISSIONS, toFa } from "@/lib/format";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "موجودی سالن | اقای خودرو" },
      {
        name: "description",
        content: "همه خودروهای موجود سالن اقای خودرو با فیلتر برند، قیمت، سال، کارکرد و وضعیت.",
      },
      { property: "og:title", content: "موجودی سالن | اقای خودرو" },
      { property: "og:description", content: "ماشین‌هایی که الان در سالن اقای خودرو هستند." },
    ],
  }),
  component: Inventory,
});

const emptyFilters: CarFilters = { statuses: ["available"], sort: "newest" };

function Inventory() {
  const [filters, setFilters] = useState<CarFilters>(emptyFilters);
  const [drawer, setDrawer] = useState(false);

  const { data: brands = [] } = useQuery({ queryKey: ["brands"], queryFn: fetchBrands });
  const { data: cars = [], isLoading } = useQuery({
    queryKey: ["cars", filters],
    queryFn: () => fetchCars(filters),
  });

  const set = <K extends keyof CarFilters>(key: K, value: CarFilters[K]) =>
    setFilters((f) => ({ ...f, [key]: value }));

  const toggleStatus = (status: string) => {
    const current = filters.statuses ?? [];
    const next = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    set("statuses", next.length ? next : ["available"]);
  };

  const panel = useMemo(
    () => (
      <div className="space-y-5">
        <Field label="برند">
          <select
            className={inputCls}
            value={filters.brand ?? ""}
            onChange={(e) => set("brand", e.target.value || undefined)}
          >
            <option value="">همه برندها</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="حداقل قیمت">
            <input
              type="number"
              className={`${inputCls} ltr-num text-left`}
              value={filters.priceMin ?? ""}
              onChange={(e) => set("priceMin", e.target.value ? Number(e.target.value) : undefined)}
            />
          </Field>
          <Field label="حداکثر قیمت">
            <input
              type="number"
              className={`${inputCls} ltr-num text-left`}
              value={filters.priceMax ?? ""}
              onChange={(e) => set("priceMax", e.target.value ? Number(e.target.value) : undefined)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="از سال">
            <input
              type="number"
              className={`${inputCls} ltr-num text-left`}
              value={filters.yearMin ?? ""}
              onChange={(e) => set("yearMin", e.target.value ? Number(e.target.value) : undefined)}
            />
          </Field>
          <Field label="تا سال">
            <input
              type="number"
              className={`${inputCls} ltr-num text-left`}
              value={filters.yearMax ?? ""}
              onChange={(e) => set("yearMax", e.target.value ? Number(e.target.value) : undefined)}
            />
          </Field>
        </div>

        <Field label="حداکثر کارکرد (کیلومتر)">
          <input
            type="number"
            className={`${inputCls} ltr-num text-left`}
            value={filters.mileageMax ?? ""}
            onChange={(e) => set("mileageMax", e.target.value ? Number(e.target.value) : undefined)}
          />
        </Field>

        <Field label="نوع بدنه">
          <select
            className={inputCls}
            value={filters.bodyType ?? ""}
            onChange={(e) => set("bodyType", e.target.value || undefined)}
          >
            <option value="">همه</option>
            {Object.entries(BODY_TYPES).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Field>

        <Field label="گیربکس">
          <select
            className={inputCls}
            value={filters.transmission ?? ""}
            onChange={(e) => set("transmission", e.target.value || undefined)}
          >
            <option value="">همه</option>
            {Object.entries(TRANSMISSIONS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </Field>

        <div className="space-y-2">
          <span className="text-sm text-muted-foreground">وضعیت</span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(STATUSES).map(([k, v]) => {
              const active = (filters.statuses ?? []).includes(k);
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => toggleStatus(k)}
                  className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
                    active
                      ? "border-gold/60 bg-gold/10 text-gold"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </div>

        <Field label="مرتب‌سازی">
          <select
            className={inputCls}
            value={filters.sort ?? "newest"}
            onChange={(e) => set("sort", e.target.value as CarFilters["sort"])}
          >
            <option value="newest">جدیدترین</option>
            <option value="price_asc">ارزان‌ترین</option>
            <option value="price_desc">گران‌ترین</option>
            <option value="mileage_asc">کم‌کارکردترین</option>
            <option value="year_desc">سال بالاتر</option>
          </select>
        </Field>

        <button
          type="button"
          onClick={() => setFilters(emptyFilters)}
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          پاک کردن فیلترها
        </button>
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters, brands],
  );

  return (
    <div className="container mx-auto max-w-6xl px-6 py-16">
      <p className="eyebrow">Inventory</p>
      <h1 className="mt-3 text-4xl font-semibold">موجودی سالن</h1>
      <p className="mt-3 text-muted-foreground">ماشین‌هایی که الان این‌جا هستند.</p>

      <div className="mt-10 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "در حال بارگذاری…" : `${toFa(cars.length)} خودرو`}
        </p>
        <button
          onClick={() => setDrawer(true)}
          className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm lg:hidden"
        >
          <SlidersHorizontal className="size-4" />
          فیلترها
        </button>
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl bg-surface p-5 hairline">{panel}</div>
        </aside>

        <div>
          {cars.length === 0 && !isLoading ? (
            <div className="rounded-xl bg-surface p-12 text-center hairline">
              <p className="text-muted-foreground">ماشینی با این فیلترها در سالن نیست.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="flex-1 bg-background/70" onClick={() => setDrawer(false)} />
          <div className="h-full w-[85%] max-w-sm overflow-y-auto bg-surface p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg">فیلترها</span>
              <button onClick={() => setDrawer(false)} aria-label="بستن">
                <X className="size-5" />
              </button>
            </div>
            {panel}
            <button
              onClick={() => setDrawer(false)}
              className="mt-6 w-full rounded-full bg-gold py-3 text-sm font-medium text-primary-foreground"
            >
              نمایش نتایج
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
