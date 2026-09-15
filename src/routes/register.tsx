import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Field, inputCls } from "@/components/site/form";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "ثبت‌نام | اقای خودرو" },
      { name: "description", content: "ساخت حساب کاربری در سالن اقای خودرو برای رزرو بازدید." },
      { property: "og:title", content: "ثبت‌نام | اقای خودرو" },
      { property: "og:description", content: "ساخت حساب کاربری برای رزرو بازدید حضوری خودرو." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName, phone },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message === "User already registered" ? "این ایمیل قبلاً ثبت شده." : "ثبت‌نام انجام نشد.");
      return;
    }
    if (data.session) {
      toast.success("حساب شما ساخته شد.");
      navigate({ to: "/", replace: true });
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="container mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">ایمیل خود را تأیید کنید</h1>
        <p className="mt-3 leading-8 text-muted-foreground">
          لینک تأیید برای شما ارسال شد. پس از تأیید، وارد حساب شوید.
        </p>
        <Link to="/login" className="mt-6 inline-block text-gold">
          رفتن به صفحه ورود
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md px-6 py-24">
      <p className="eyebrow">Sign up</p>
      <h1 className="mt-3 text-3xl font-semibold">ساخت حساب</h1>
      <form onSubmit={submit} className="mt-8 space-y-5 rounded-xl bg-surface p-6 hairline">
        <Field label="نام">
          <input className={inputCls} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </Field>
        <Field label="موبایل">
          <input
            className={`${inputCls} ltr-num text-left`}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </Field>
        <Field label="ایمیل">
          <input
            type="email"
            className={`${inputCls} ltr-num text-left`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field label="رمز عبور">
          <input
            type="password"
            className={`${inputCls} text-left`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </Field>
        <button
          disabled={busy}
          className="w-full rounded-full bg-gold py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {busy ? "در حال ساخت…" : "ساخت حساب"}
        </button>
        <p className="text-sm text-muted-foreground">
          حساب دارید؟{" "}
          <Link to="/login" className="text-gold">
            ورود
          </Link>
        </p>
      </form>
    </div>
  );
}
