import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/editorial")({
  head: () => ({
    meta: [
      { title: "تحریریه | اقای خودرو" },
      { name: "description", content: "یادداشت‌ها و تحلیل‌های سالن اقای خودرو درباره بازار خودرو." },
      { property: "og:title", content: "تحریریه | اقای خودرو" },
      { property: "og:description", content: "یادداشت‌های سالن اقای خودرو درباره بازار خودرو." },
    ],
  }),
  component: Editorial,
});

function Editorial() {
  return (
    <div className="container mx-auto max-w-3xl px-6 py-24">
      <p className="eyebrow">Editorial</p>
      <h1 className="mt-3 text-4xl font-semibold">تحریریه</h1>
      <p className="mt-4 leading-8 text-muted-foreground">
        یادداشت‌های سالن درباره بازار خودرو به‌زودی این‌جا منتشر می‌شود.
      </p>
    </div>
  );
}
