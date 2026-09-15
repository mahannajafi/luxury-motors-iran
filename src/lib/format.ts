const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toFa(value: string | number): string {
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)]!);
}

export function formatNumber(value: number): string {
  return toFa(value.toLocaleString("en-US"));
}

export function formatToman(value: number): string {
  if (!value) return "توافقی";
  return `${formatNumber(value)} تومان`;
}

export function formatKm(value: number): string {
  return `${formatNumber(value)} کیلومتر`;
}

export const BODY_TYPES: Record<string, string> = {
  sedan: "سدان",
  suv: "شاسی‌بلند",
  hatchback: "هاچ‌بک",
  coupe: "کوپه",
  pickup: "وانت",
};

export const TRANSMISSIONS: Record<string, string> = {
  manual: "دنده‌ای",
  automatic: "اتوماتیک",
};

export const FUELS: Record<string, string> = {
  gasoline: "بنزینی",
  diesel: "دیزل",
  hybrid: "هیبرید",
  electric: "برقی",
};

export const STATUSES: Record<string, string> = {
  available: "موجود",
  reserved: "زیر قولنامه",
  sold: "فروخته شد",
};
