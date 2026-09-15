import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-car.jpg";

/**
 * Paste a published Spline scene embed URL here (Spline → Export → Public URL)
 * to swap the cinematic still for the live 3D scene. Everything else stays.
 */
const SPLINE_SCENE_URL = "";

export function SplineHero() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [scroll, setScroll] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScroll(Math.min(window.scrollY / 700, 1));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={ref}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTilt({
          x: ((e.clientX - r.left) / r.width - 0.5) * 2,
          y: ((e.clientY - r.top) / r.height - 0.5) * 2,
        });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative h-[92vh] min-h-[560px] w-full overflow-hidden"
    >
      {/* FIXED cinematic stage */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {SPLINE_SCENE_URL ? (
          <iframe
            src={SPLINE_SCENE_URL}
            title="صحنه سه‌بعدی خودرو"
            className="h-full w-full border-0"
            allow="autoplay; fullscreen"
          />
        ) : (
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-300 ease-out"
            style={{
              backgroundImage: `url(${heroImg})`,
              transform: `scale(${1.08 + scroll * 0.06}) translate3d(${tilt.x * -14}px, ${
                tilt.y * -10 - scroll * 30
              }px, 0)`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_45%,transparent_0%,oklch(0.145_0.006_75/0.55)_55%,oklch(0.145_0.006_75)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-24">
        <p className="eyebrow mb-4">بنگاه امانی · تهران</p>
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-6xl">
          اقای خودرو
          <span className="mt-3 block text-xl font-normal text-muted-foreground sm:text-2xl">
            سالن خصوصی خرید، فروش و سپردن خودرو
          </span>
        </h1>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/inventory"
            className="rounded-full bg-gold px-7 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-gold-soft"
          >
            دیدن موجودی سالن
          </Link>
          <Link
            to="/consign"
            className="rounded-full border border-gold/40 px-7 py-3 text-sm text-gold transition-colors hover:bg-gold/10"
          >
            ماشینت را بسپار
          </Link>
        </div>
      </div>
    </section>
  );
}
