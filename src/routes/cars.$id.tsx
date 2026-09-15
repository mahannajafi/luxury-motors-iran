import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CarCard } from "@/components/site/CarCard";
import { StatusPill } from "@/components/site/StatusPill";
import { Field, inputCls } from "@/components/site/form";
import { fetchCar, fetchCars } from "@/lib/cars";
import { BODY_TYPES, FUELS, TRANSMISSIONS, formatKm, formatToman, toFa } from "@/lib/format";

export const Route = createFileRoute("/cars/$id")({
  head: () => ({
    meta: [
      { title: "خودرو | اقای خودرو" },
      { name: "description", content: "مشخصات کامل، گالری تصاویر و رزرو بازدید حضوری خودرو." },
      { property: "og:title", content: "خودرو | اقای خودرو" },
      { property: "og:description", content: "مشخصات کامل و رزرو بازدید حضوری خودرو در سالن." },
    ],
  }),
  component: CarDetail,
});

function CarDetail() {
  const { id } = Route.useParams();
  const { user, profile } = useAuth();
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const { data: car, isLoading } = useQuery({ queryKey: ["car", id], queryFn: () => fetchCar(id) });
  const { data: related = [] } = useQuery({
    queryKey: ["cars", "related", id],
    queryFn: () => fetchCars({ statuses: ["available"] }),
  });

  if (isLoading) {
    return <div className="container mx-auto max-w-6xl px-6 py-24 text-muted-foreground">در حال بارگذاری…</div>;
  }
  if (!car) {
    return (
      <div className="container mx-auto max-w-6xl px-6 py-24">
        <p className="text-muted-foreground">این خودرو پیدا نشد.</p>
        <Link to="/inventory" className="mt-4 inline-block text-gold">
          بازگشت به موجودی
        </Link>
      </div>
    );
  }

  const sold = car.status === "sold";
  const specs = [
    ["سال", toFa(car.year)],
    ["کارکرد", formatKm(car.mileage_km)],
    ["بدنه", BODY_TYPES[car.body_type] ?? car.body_type],
    ["گیربکس", TRANSMISSIONS[car.transmission] ?? car.transmission],
    ["سوخت", FUELS[car.fuel] ?? car.fuel],
    ["رنگ", car.color ?? "—"],
    ["وضعیت رنگ", car.body_paint_status ?? "—"],
    ["شاسی", car.chassis_status ?? "—"],
    ["سند", car.document_status ?? "—"],
    ["بیمه", car.insurance ?? "—"],
  ];

  return (
    <div className="container mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="relative overflow-hidden rounded-xl bg-surface hairline">
            <img
              src={car.photos[active]}
              alt={`${car.brand} ${car.model}`}
              className="aspect-[4/3] w-full cursor-zoom-in object-cover"
              onClick={() => setLightbox(true)}
            />
            {sold && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/55">
                <span className="rounded-full border border-gold/50 px-8 py-3 text-lg tracking-widest text-gold">
                  فروخته شد
                </span>
              </div>
            )}
          </div>
          {car.photos.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {car.photos.map((p, i) => (
                <button
                  key={p}
                  onClick={() => setActive(i)}
                  className={`h-20 w-28 shrink-0 overflow-hidden rounded-lg border transition-colors ${
                    i === active ? "border-gold" : "border-border"
                  }`}
                >
                  <img src={p} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {car.description && (
            <div className="mt-10">
              <h2 className="text-xl font-medium">درباره این ماشین</h2>
              <p className="mt-3 leading-8 text-muted-foreground">{car.description}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="lg:sticky lg:top-24">
            <StatusPill status={car.status} />
            <h1 className="mt-4 text-3xl font-semibold">
              {car.brand} {car.model} {car.trim ?? ""}{" "}
              <span className="text-muted-foreground">{toFa(car.year)}</span>
            </h1>
            <p className="mt-4 text-2xl text-gold">{formatToman(car.price_toman)}</p>
            <p className="mt-1 text-sm text-muted-foreground">{formatKm(car.mileage_km)}</p>

            <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-border hairline">
              {specs.map(([k, v]) => (
                <div key={k} className="bg-surface p-4">
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="mt-1 text-sm">{v}</p>
                </div>
              ))}
            </div>

            {!sold && (
              <button
                onClick={() => setFormOpen((v) => !v)}
                className="mt-6 w-full rounded-full bg-gold py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-gold-soft"
              >
                رزرو بازدید حضوری
              </button>
            )}
            <div className="mt-3 flex gap-3">
              <a
                href="tel:+982100000000"
                className="flex-1 rounded-full border border-border py-3 text-center text-sm"
              >
                تماس
              </a>
              <a
                href="https://wa.me/989120000000"
                target="_blank"
                rel="noreferrer"
                className="flex-1 rounded-full border border-border py-3 text-center text-sm"
              >
                واتساپ
              </a>
            </div>

            {formOpen && !sold && (
              <VisitForm
                carId={car.id}
                userId={user?.id ?? null}
                defaultName={profile?.full_name ?? ""}
                defaultPhone={profile?.phone ?? ""}
                onDone={() => setFormOpen(false)}
              />
            )}
          </div>
        </div>
      </div>

      {related.filter((c) => c.id !== car.id).length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-semibold">ماشین‌های دیگر سالن</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related
              .filter((c) => c.id !== car.id)
              .slice(0, 3)
              .map((c) => (
                <CarCard key={c.id} car={c} />
              ))}
          </div>
        </section>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/95 p-6"
          onClick={() => setLightbox(false)}
        >
          <button className="absolute left-6 top-6" aria-label="بستن">
            <X className="size-6" />
          </button>
          <img src={car.photos[active]} alt="" className="max-h-full max-w-full rounded-lg object-contain" />
        </div>
      )}
    </div>
  );
}

function VisitForm({
  carId,
  userId,
  defaultName,
  defaultPhone,
  onDone,
}: {
  carId: string;
  userId: string | null;
  defaultName: string;
  defaultPhone: string;
  onDone: () => void;
}) {
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [time, setTime] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("visit_requests").insert({
      car_id: carId,
      user_id: userId,
      guest_name: name,
      guest_phone: phone,
      preferred_time: time,
    });
    setSaving(false);
    if (error) {
      toast.error("ثبت نشد، دوباره تلاش کنید.");
      return;
    }
    toast.success("درخواست بازدید ثبت شد.");
    onDone();
  };

  return (
    <form onSubmit={submit} className="mt-4 space-y-4 rounded-xl bg-surface p-5 hairline">
      <Field label="نام">
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} required />
      </Field>
      <Field label="شماره تماس">
        <input
          className={`${inputCls} ltr-num text-left`}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </Field>
      <Field label="زمان پیشنهادی بازدید">
        <input className={inputCls} value={time} onChange={(e) => setTime(e.target.value)} required />
      </Field>
      <button
        disabled={saving}
        className="w-full rounded-full bg-gold py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {saving ? "در حال ثبت…" : "ثبت درخواست بازدید"}
      </button>
    </form>
  );
}
