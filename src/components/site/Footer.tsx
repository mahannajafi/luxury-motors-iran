import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="container mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-gold">اقای خودرو</p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            سالن امانی خودرو؛ هر ماشین پیش از پذیرش کارشناسی می‌شود.
          </p>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <Link to="/inventory" className="block hover:text-foreground">
            موجودی سالن
          </Link>
          <Link to="/consign" className="block hover:text-foreground">
            سپردن ماشین
          </Link>
          <Link to="/editorial" className="block hover:text-foreground">
            تحریریه
          </Link>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>تهران، بزرگراه مدرس</p>
          <p>
            تلفن: <span className="ltr-num">021-0000 0000</span>
          </p>
          <p>
            واتساپ: <span className="ltr-num">+98 912 000 0000</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
