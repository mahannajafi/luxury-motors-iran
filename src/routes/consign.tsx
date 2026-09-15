import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/consign")({
  head: () => ({
    meta: [
      { title: "سپردن ماشین | اقای خودرو" },
      {
        name: "description",
        content: "ماشین خود را به صورت امانی به سالن اقای خودرو بسپارید؛ کارشناسی، نمایش و فروش.",
      },
      { property: "og:title", content: "سپردن ماشین | اقای خودرو" },
      {
        property: "og:description",
        content: "سپردن خودرو به صورت امانی؛ کارشناسی، نمایش در سالن و تسویه امن.",
      },
    ],
  }),
  component: Consign,
});

function Consign() {
  const { user, profile } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("visit_requests").insert({
      car_id: null,
      user_id: user?.id ?? null,
      guest_name: name || profile?.full_name || null,
      guest_phone: phone || profile?.phone || null,
      message: `سپردن ماشین: ${message}`,
    });
    setSaving(false);
    if (error) {
      toast.error("ارسال نشد، دوباره تلاش کنید.");
      return;
    }
    toast.success("درخواست شما ثبت شد؛ همکاران ما تماس می‌گیرند.");
    setName("");
    setPhone("");
    setMessage("");
  };

  return (
    <div className="container mx-auto max-w-3xl px-6 py-24">
      <p className="eyebrow">Consignment</p>
      <h1 className="mt-3 text-4xl font-semibold">ماشینت را بسپار</h1>
      <p className="mt-4 leading-8 text-muted-foreground">
        مشخصات خودرو را بنویسید؛ پس از کارشناسی، ماشین در سالن نمایش داده می‌شود.
      </p>

      <form onSubmit={submit} className="mt-10 space-y-5 rounded-xl bg-surface p-6 hairline">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="نام و نام خانوادگی">
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="شماره موبایل">
            <input
              className={`${inputCls} ltr-num text-left`}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </Field>
        </div>
        <Field label="درباره ماشین (برند، مدل، سال، کارکرد، قیمت پیشنهادی)">
          <textarea
            className={`${inputCls} min-h-32`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </Field>
        <button
          disabled={saving}
          className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {saving ? "در حال ارسال…" : "ارسال درخواست"}
        </button>
      </form>
    </div>
  );
}

export const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-gold";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
