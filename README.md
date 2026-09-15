# Luxury Motors Iran

Continue (or build) a luxury RTL Persian site for [اقای خودرو]: automotive media + physical consignment used-car lot (بنگاه امانی) in Iran.

Keep the existing homepage: dark studio, FIXED cinematic Spline 3D car hero (wow-factor 3D matters more than which car), then inventory/sold/consign/editorial. Do not put news above cars.

Stack: React + Vite + TypeScript + Tailwind + React Router. Font Vazirmatn. dir="rtl" lang="fa". Prices in تومان. Connect Supabase: Auth, Postgres, Storage.

Visual: near-black, warm off-white, muted champagne-gold accent. Private dealership, not classifieds. No Stripe, no Google login required (email+password is fine). Phone numbers ltr.

ROUTES

- / homepage

- /inventory inventory + filters

- /cars/:id car detail

- /login

- /register

- /admin inventory manager (protected)

- /admin/cars/new

- /admin/cars/:id/edit

ROLES

- Guest: can browse /inventory and /cars/:id

- User (authenticated): can submit visit request on a car

- Admin: role in profiles.role === "admin" — full CRUD on cars + photo upload

Do not gate browsing behind login.

DATA: table `cars`

id, brand, model, trim, year, mileage_km, price_toman, body_type (sedan/suv/hatchback/coupe/pickup), transmission (manual/automatic), fuel (gasoline/diesel/hybrid/electric), color, body_paint_status (text, e.g. صفر رنگ), chassis_status, document_status, insurance, description, status (available | reserved | sold), featured (bool), created_at

Photos in Supabase Storage, table `car_photos` (car_id, url, sort_order).

Table `profiles` (id=auth user, full_name, phone, role default "user").

Table `visit_requests` (car_id, user_id or guest name/phone, message, created_at).

Seed 8 realistic Iranian-market used cars (تومان, mixed available/sold).

PAGE /inventory

Title: موجودی سالن

Subtitle: ماشین‌هایی که الان این‌جا هستند.

Layout: sticky filter bar (desktop right in RTL / mobile drawer).

Filters: brand, price min-max, year min-max, max mileage, body type, transmission, status (default available; user can include reserved/sold), sort.

Results as the same car cards as homepage: photo, brand/model/year, mileage, price, status pill.

Empty state: ماشینی با این فیلترها در سالن نیست.

Card click → /cars/:id

Show result count: ۱۲ خودرو

PAGE /cars/:id

- Gallery: large main photo, thumbnails, lightbox. If sold, persistent «فروخته شد» overlay. No 3D here.

- Title: brand model trim year

- Price تومان, mileage, status

- Spec grid: سال، کارکرد، بدنه، گیربکس، سوخت، رنگ، وضعیت رنگ، شاسی، سند، بیمه

- Description

- Sticky CTA: رزرو بازدید حضوری (opens form: name, phone, preferred time). Secondary: تماس / واتساپ

- If sold: hide visit CTA, keep gallery + specs

- Related: 3 other available cars

AUTH

- /register: نام، موبایل، ایمیل، رمز. Copy: ساخت حساب

- /login: ایمیل، رمز. Copy: ورود

- After login, header shows name + خروج

- Redirect unauthenticated /admin → /login

- Non-admin hitting /admin → 403 page: دسترسی فقط برای مدیر سالن

ADMIN

- /admin list of cars: thumb, title, price, status, edit, delete

- Primary button: افزودن ماشین

- Form add/edit: all car fields + multiple photo upload to Storage

- Status select: موجود / زیر قولنامه / فروخته شد

- featured checkbox: نمایش در ویژه صفحه اول

- Save / publish immediately

- Admin UI same dark luxury system, practical not colorful dashboard

HEADER on all pages: لوگو، موجودی، سپردن ماشین (can be a simple /consign form page if not built yet), تحریریه placeholder ok, تماس. Header CTA ماشینت را بسپار. Auth links: ورود / ثبت‌نام or user menu.

RLS

- cars + car_photos readable by anyone for all rows (sold stays public)

- insert/update/delete cars and photos: admin only

- profiles: user reads/updates own row; admin reads all

- visit_requests: insert by anyone; read by admin (and own user)

Do not add extra marketing pages. Keep 3D only on the homepage hero.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/898d98c7-3938-4e53-bee2-53f116e7ef4d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
