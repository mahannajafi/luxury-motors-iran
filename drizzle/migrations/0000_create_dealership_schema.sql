-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  full_name text,
  phone text,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = _user_id AND role = 'admin');
$$;

CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.is_admin(auth.uid()));
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id AND role = 'user');

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'phone')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- CARS
CREATE TABLE public.cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  trim text,
  year int NOT NULL,
  mileage_km int NOT NULL DEFAULT 0,
  price_toman bigint NOT NULL DEFAULT 0,
  body_type text NOT NULL DEFAULT 'sedan',
  transmission text NOT NULL DEFAULT 'automatic',
  fuel text NOT NULL DEFAULT 'gasoline',
  color text,
  body_paint_status text,
  chassis_status text,
  document_status text,
  insurance text,
  description text,
  status text NOT NULL DEFAULT 'available',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cars TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cars TO authenticated;
GRANT ALL ON public.cars TO service_role;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cars public read" ON public.cars FOR SELECT USING (true);
CREATE POLICY "cars admin insert" ON public.cars FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "cars admin update" ON public.cars FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "cars admin delete" ON public.cars FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- CAR PHOTOS
CREATE TABLE public.car_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.car_photos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.car_photos TO authenticated;
GRANT ALL ON public.car_photos TO service_role;
ALTER TABLE public.car_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "photos public read" ON public.car_photos FOR SELECT USING (true);
CREATE POLICY "photos admin insert" ON public.car_photos FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "photos admin update" ON public.car_photos FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "photos admin delete" ON public.car_photos FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- VISIT REQUESTS
CREATE TABLE public.visit_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid REFERENCES public.cars(id) ON DELETE SET NULL,
  user_id uuid,
  guest_name text,
  guest_phone text,
  preferred_time text,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.visit_requests TO anon;
GRANT SELECT, INSERT ON public.visit_requests TO authenticated;
GRANT ALL ON public.visit_requests TO service_role;
ALTER TABLE public.visit_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "visit insert anyone" ON public.visit_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "visit read own or admin" ON public.visit_requests FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

-- STORAGE POLICIES (bucket car-photos, private + signed urls)
CREATE POLICY "car photos read" ON storage.objects FOR SELECT USING (bucket_id = 'car-photos');
CREATE POLICY "car photos admin insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'car-photos' AND public.is_admin(auth.uid()));
CREATE POLICY "car photos admin update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'car-photos' AND public.is_admin(auth.uid()));
CREATE POLICY "car photos admin delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'car-photos' AND public.is_admin(auth.uid()));

-- SEED
INSERT INTO public.cars (brand, model, trim, year, mileage_km, price_toman, body_type, transmission, fuel, color, body_paint_status, chassis_status, document_status, insurance, description, status, featured) VALUES
('پژو','۲۰۶','تیپ ۵',1400,62000,780000000,'hatchback','manual','gasoline','سفید','صفر رنگ','سالم و پلمب','تک برگ، آزاد','۸ ماه، ۳ سال تخفیف','پژو ۲۰۶ تیپ ۵ با بدنه کاملاً سالم، سرویس‌های دوره‌ای انجام‌شده و لاستیک‌های نو.','available',true),
('سایپا','کوییک','R پلاس',1401,38000,520000000,'hatchback','automatic','gasoline','خاکستری','صفر رنگ','سالم','تک برگ','۱۱ ماه، ۲ سال تخفیف','کوییک اتوماتیک کم‌کارکرد، مناسب شهر، بیمه بلندمدت.','available',false),
('تویوتا','کمری','GLX هیبرید',1396,118000,4350000000,'sedan','automatic','hybrid','مشکی','دو لکه رنگ','سالم و پلمب','تک برگ، آزاد','۶ ماه','کمری هیبرید وارداتی با سرویس نمایندگی، داخل کاملاً تمیز.','available',true),
('هیوندای','توسان','IX35 فول',1395,142000,3250000000,'suv','automatic','gasoline','سفید صدفی','دور رنگ','سالم','تک برگ','۴ ماه','توسان فول آپشن با سانروف، لاستیک‌ها ۸۰٪.','reserved',false),
('کیا','اسپورتیج','GT Line',1397,96000,3900000000,'suv','automatic','gasoline','نقره‌ای','صفر رنگ','سالم و پلمب','تک برگ، آزاد','۱۰ ماه، ۵ سال تخفیف','اسپورتیج بسیار تمیز، بدون کوچک‌ترین خط و خش.','available',true),
('ایران خودرو','دنا پلاس','توربو اتوماتیک',1402,21000,1120000000,'sedan','automatic','gasoline','مشکی','صفر رنگ','سالم','تک برگ','۱۲ ماه، ۱ سال تخفیف','دنا پلاس توربو در حد صفر، تحویل با گارانتی سلامت فنی سالن.','available',false),
('مزدا','۳','تیپ ۴ صندوق‌دار',1391,205000,1650000000,'sedan','automatic','gasoline','سفید','گلگیر رنگ','سالم','تک برگ، آزاد','۳ ماه','مزدا ۳ ایران خودرویی، موتور و گیربکس بدون ایراد.','sold',false),
('شورولت','سیلورادو','Z71',1390,178000,2850000000,'pickup','automatic','gasoline','قرمز','دو لکه رنگ','سالم','تک برگ','منقضی','پیکاپ کلکسیونی با موتور V8، وارداتی.','sold',false);
