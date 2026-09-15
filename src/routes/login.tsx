import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Field, inputCls } from "@/components/site/form";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "ورود | اقای خودرو" },
      { name: "description", content: "ورود به حساب کاربری سالن اقای خودرو." },
      { property: "og:title", content: "ورود | اقای خودرو" },
      { property: "og:description", content: "ورود به حساب کاربری سالن اقای خودرو." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error("ایمیل یا رمز عبور درست نیست.");
      return;
    }
    toast.success("خوش آمدید.");
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="container mx-auto max-w-md px-6 py-24">
      <p className="eyebrow">Sign in</p>
      <h1 className="mt-3 text-3xl font-semibold">ورود</h1>
      <form onSubmit={submit} className="mt-8 space-y-5 rounded-xl bg-surface p-6 hairline">
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
            required
          />
        </Field>
        <button
          disabled={busy}
          className="w-full rounded-full bg-gold py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {busy ? "در حال ورود…" : "ورود"}
        </button>
        <p className="text-sm text-muted-foreground">
          حساب ندارید؟{" "}
          <Link to="/register" className="text-gold">
            ساخت حساب
          </Link>
        </p>
      </form>
    </div>
  );
}
