import { supabase } from "@/integrations/supabase/client";
import sedanImg from "@/assets/car-sedan.jpg";
import suvImg from "@/assets/car-suv.jpg";
import hatchbackImg from "@/assets/car-hatchback.jpg";
import pickupImg from "@/assets/car-pickup.jpg";
import heroImg from "@/assets/hero-car.jpg";

export const PHOTO_BUCKET = "car-photos";

export type Car = {
  id: string;
  brand: string;
  model: string;
  trim: string | null;
  year: number;
  mileage_km: number;
  price_toman: number;
  body_type: string;
  transmission: string;
  fuel: string;
  color: string | null;
  body_paint_status: string | null;
  chassis_status: string | null;
  document_status: string | null;
  insurance: string | null;
  description: string | null;
  status: string;
  featured: boolean;
  created_at: string;
};

export type CarWithPhotos = Car & { photos: string[] };

export function fallbackPhoto(bodyType: string): string {
  switch (bodyType) {
    case "suv":
      return suvImg;
    case "hatchback":
      return hatchbackImg;
    case "pickup":
      return pickupImg;
    case "coupe":
      return heroImg;
    default:
      return sedanImg;
  }
}

async function resolvePaths(paths: string[]): Promise<Record<string, string>> {
  const map: Record<string, string> = {};
  const storagePaths = paths.filter((p) => !/^https?:\/\//.test(p));
  paths
    .filter((p) => /^https?:\/\//.test(p))
    .forEach((p) => {
      map[p] = p;
    });
  if (storagePaths.length) {
    const { data } = await supabase.storage
      .from(PHOTO_BUCKET)
      .createSignedUrls(storagePaths, 60 * 60);
    data?.forEach((item) => {
      if (item.path && item.signedUrl) map[item.path] = item.signedUrl;
    });
  }
  return map;
}

type PhotoRow = { url: string; sort_order: number };

async function decorate(rows: (Car & { car_photos?: PhotoRow[] })[]): Promise<CarWithPhotos[]> {
  const all = rows.flatMap((r) => (r.car_photos ?? []).map((p) => p.url));
  const map = await resolvePaths(all);
  return rows.map(({ car_photos, ...car }) => {
    const photos = (car_photos ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((p) => map[p.url])
      .filter((u): u is string => Boolean(u));
    return { ...(car as Car), photos: photos.length ? photos : [fallbackPhoto(car.body_type)] };
  });
}

export type CarFilters = {
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  mileageMax?: number;
  bodyType?: string;
  transmission?: string;
  statuses?: string[];
  sort?: "newest" | "price_asc" | "price_desc" | "mileage_asc" | "year_desc";
};

export async function fetchCars(filters: CarFilters = {}): Promise<CarWithPhotos[]> {
  let query = supabase.from("cars").select("*, car_photos(url, sort_order)");

  if (filters.brand) query = query.eq("brand", filters.brand);
  if (filters.bodyType) query = query.eq("body_type", filters.bodyType);
  if (filters.transmission) query = query.eq("transmission", filters.transmission);
  if (filters.priceMin) query = query.gte("price_toman", filters.priceMin);
  if (filters.priceMax) query = query.lte("price_toman", filters.priceMax);
  if (filters.yearMin) query = query.gte("year", filters.yearMin);
  if (filters.yearMax) query = query.lte("year", filters.yearMax);
  if (filters.mileageMax) query = query.lte("mileage_km", filters.mileageMax);
  if (filters.statuses?.length) query = query.in("status", filters.statuses);

  switch (filters.sort) {
    case "price_asc":
      query = query.order("price_toman", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price_toman", { ascending: false });
      break;
    case "mileage_asc":
      query = query.order("mileage_km", { ascending: true });
      break;
    case "year_desc":
      query = query.order("year", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return decorate((data ?? []) as never);
}

export async function fetchCar(id: string): Promise<CarWithPhotos | null> {
  const { data, error } = await supabase
    .from("cars")
    .select("*, car_photos(url, sort_order)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const [car] = await decorate([data as never]);
  return car ?? null;
}

export async function fetchBrands(): Promise<string[]> {
  const { data } = await supabase.from("cars").select("brand");
  return Array.from(new Set((data ?? []).map((r) => r.brand))).sort();
}
