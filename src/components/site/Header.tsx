import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const NAV = [
  { to: "/inventory", label: "موجودی" },
  { to: "/consign", label: "سپردن ماشین" },
  { to: "/editorial", label: "تحریریه" },
];

export function Header() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-gold">اقای خودرو</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
          <a href="tel:+982100000000" className="transition-colors hover:text-foreground">
            تماس
          </a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground">
                  مدیریت
                </Link>
              )}
              <span className="text-sm text-foreground">{profile?.full_name ?? "کاربر"}</span>
              <button
                onClick={handleSignOut}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                خروج
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
                ورود
              </Link>
              <Link to="/register" className="text-sm text-muted-foreground hover:text-foreground">
                ثبت‌نام
              </Link>
            </>
          )}
          <Link
            to="/consign"
            className="rounded-full bg-gold px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-gold-soft"
          >
            ماشینت را بسپار
          </Link>
        </div>

        <button
          className="text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="منو"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4 text-sm">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <a href="tel:+982100000000">تماس</a>
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setOpen(false)}>
                    مدیریت
                  </Link>
                )}
                <button className="text-right" onClick={handleSignOut}>
                  خروج
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)}>
                  ورود
                </Link>
                <Link to="/register" onClick={() => setOpen(false)}>
                  ثبت‌نام
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
