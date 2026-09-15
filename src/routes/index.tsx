import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SplineHero } from "@/components/site/SplineHero";
import { CarCard } from "@/components/site/CarCard";
import { fetchCars } from "@/lib/cars";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "اقای خودرو | سالن امانی خودرو در تهران" },
      {
        name: "description",
        content:
          "سالن خصوصی اقای خودرو: موجودی خودروهای کارشناسی‌شده، سپردن ماشین به صورت امانی و تحریریه خودرو.",
      },
      { property: "og:title", content: "اقای خودرو | سالن امانی خودرو" },
      {
        property: "og:description",
        content: "موجودی خودروهای کارشناسی‌شده و سپردن ماشین به صورت امانی در تهران.",
      },
    ],
  }),
  component: Home,
});

function Section({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative bg-background">
      <div className="container mx-auto max-w-6xl px-6 py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function Home() {
  const { data: cars = [] } = useQuery({ queryKey: ["cars", "home"], queryFn: () => fetchCars() });

  const available = cars.filter((c) => c.status !== "sold").slice(0, 6);
  const sold = cars.filter((c) => c.status === "sold").slice(0, 3);

  return (
    <div>
      <SplineHero />

      <Section
        eyebrow="Inventory"
        title="موجودی سالن"
        subtitle="ماشین‌هایی که الان این‌جا هستند."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {available.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
        <div className="mt-10">
          <Link
            to="/inventory"
            className="rounded-full border border-gold/40 px-6 py-3 text-sm text-gold transition-colors hover:bg-gold/10"
          >
            دیدن همه خودروها
          </Link>
        </div>
      </Section>

      {sold.length > 0 && (
        <Section eyebrow="Archive" title="فروخته‌شده‌ها" subtitle="کارنامه سالن.">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sold.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </Section>
      )}

      <Section
        eyebrow="Consignment"
        title="ماشینت را بسپار"
        subtitle="ماشین را امانی می‌پذیریم، کارشناسی می‌کنیم و در سالن می‌فروشیم."
      >
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { n: "۰۱", t: "کارشناسی", d: "بدنه، شاسی، موتور و سند کامل بررسی می‌شود." },
            { n: "۰۲", t: "نمایش در سالن", d: "عکاسی استودیویی و نمایش حضوری به مشتری." },
            { n: "۰۳", t: "تسویه امن", d: "قولنامه رسمی و تسویه در همان روز فروش." },
          ].map((s) => (
            <div key={s.n} className="rounded-xl bg-surface p-6 hairline">
              <p className="text-sm text-gold">{s.n}</p>
              <h3 className="mt-3 text-lg">{s.t}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link
            to="/consign"
            className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            شروع سپردن ماشین
          </Link>
        </div>
      </Section>

      <Section eyebrow="Editorial" title="تحریریه" subtitle="یادداشت‌های سالن درباره بازار خودرو.">
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            { t: "چطور قیمت واقعی یک خودروی دست‌دوم را بفهمیم؟", d: "به‌زودی" },
            { t: "پنج نکته پیش از خرید خودروی وارداتی", d: "به‌زودی" },
          ].map((p) => (
            <article key={p.t} className="rounded-xl bg-surface p-6 hairline">
              <p className="eyebrow">{p.d}</p>
              <h3 className="mt-3 text-lg leading-8">{p.t}</h3>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}
