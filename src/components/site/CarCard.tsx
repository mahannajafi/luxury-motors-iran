import { Link } from "@tanstack/react-router";
import type { CarWithPhotos } from "@/lib/cars";
import { formatKm, formatToman, toFa } from "@/lib/format";
import { StatusPill } from "./StatusPill";

export function CarCard({ car }: { car: CarWithPhotos }) {
  return (
    <Link
      to="/cars/$id"
      params={{ id: car.id }}
      className="group block overflow-hidden rounded-xl bg-surface hairline transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-plate"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-background">
        <img
          src={car.photos[0]}
          alt={`${car.brand} ${car.model} ${toFa(car.year)}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <StatusPill status={car.status} className="absolute right-3 top-3" />
        {car.status === "sold" && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/55">
            <span className="rounded-full border border-gold/40 px-5 py-2 text-sm tracking-widest text-gold">
              فروخته شد
            </span>
          </div>
        )}
      </div>
      <div className="space-y-3 p-5">
        <h3 className="text-lg font-medium">
          {car.brand} {car.model}{" "}
          <span className="text-muted-foreground">{toFa(car.year)}</span>
        </h3>
        <p className="text-sm text-muted-foreground">
          {car.trim ? `${car.trim} · ` : ""}
          {formatKm(car.mileage_km)}
        </p>
        <div className="gold-line" />
        <p className="text-base text-gold">{formatToman(car.price_toman)}</p>
      </div>
    </Link>
  );
}
