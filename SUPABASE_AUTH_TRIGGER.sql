-- Create profiles table for Supabase Auth users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  name TEXT,
  role TEXT DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'admin')),
  telegram TEXT,
  facebook TEXT,
  instagram TEXT,
  whatsapp TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, telegram, facebook, instagram, whatsapp)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    COALESCE(new.raw_user_meta_data->>'role', 'buyer'),
    new.raw_user_meta_data->>'telegram',
    new.raw_user_meta_data->>'facebook',
    new.raw_user_meta_data->>'instagram',
    new.raw_user_meta_data->>'whatsapp'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update profile when user metadata changes
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    name = COALESCE(new.raw_user_meta_data->>'name', old.raw_user_meta_data->>'name'),
    role = COALESCE(new.raw_user_meta_data->>'role', old.raw_user_meta_data->>'role'),
    telegram = COALESCE(new.raw_user_meta_data->>'telegram', old.raw_user_meta_data->>'telegram'),
    facebook = COALESCE(new.raw_user_meta_data->>'facebook', old.raw_user_meta_data->>'facebook'),
    instagram = COALESCE(new.raw_user_meta_data->>'instagram', old.raw_user_meta_data->>'instagram'),
    whatsapp = COALESCE(new.raw_user_meta_data->>'whatsapp', old.raw_user_meta_data->>'whatsapp'),
    updated_at = timezone('utc'::text, now())
  WHERE id = new.id;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update profile on user metadata update
CREATE OR REPLACE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
