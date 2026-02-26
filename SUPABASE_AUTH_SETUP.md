# Supabase Auth Setup Guide

This guide explains how to set up automatic profile creation for new users using Supabase Auth triggers.

## Overview

When a user signs up through Supabase Auth, we want to automatically create a profile record in the `profiles` table with their user information and default role.

## Setup Steps

### 1. Run the SQL Script

Execute the SQL script in `SUPABASE_AUTH_TRIGGER.sql` in your Supabase SQL Editor:

```sql
-- Go to Supabase Dashboard -> SQL Editor
-- Copy and paste the contents of SUPABASE_AUTH_TRIGGER.sql
-- Click "Run" to execute
```

This script will:
- Create the `profiles` table
- Create a trigger function that runs when a new user signs up
- Set up Row Level Security (RLS) policies
- Grant necessary permissions

### 2. Update Environment Variables

Make sure your `.env` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Use the New Registration Endpoint

Update your registration form to use the new Supabase Auth endpoint:

**Frontend:** `/auth/supabase-register/page.tsx`
**API:** `/api/auth/supabase-register/route.ts`

### 4. Update Navbar Logic

The navbar should now query the `profiles` table instead of the `User` table:

```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('uuid', session.user.id)  // Use uuid field
  .single()
```

## How It Works

### Registration Flow

1. User submits registration form
2. Supabase Auth creates the user in `auth.users`
3. Database trigger automatically creates a profile record
4. Default role is set to 'buyer' unless specified
5. User can immediately log in

### Trigger Details

**Trigger Name:** `on_auth_user_created`
**Function:** `handle_new_user()`
**When it runs:** After INSERT on `auth.users`

**What it does:**
- Extracts user data from `auth.users`
- Inserts into `profiles` table with:
  - `id`: auth.users.id
  - `email`: user email
  - `name`: from user metadata
  - `role`: from user metadata (defaults to 'buyer')

### Profile Table Structure

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  name TEXT,
  role TEXT DEFAULT 'buyer',
  telegram TEXT,
  facebook TEXT,
  instagram TEXT,
  whatsapp TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Testing

1. Go to `/auth/supabase-register`
2. Fill out the registration form
3. Submit the form
4. Check the `profiles` table in Supabase - you should see a new record
5. Try logging in with the new account

## Migration Notes

If you're migrating from the old Prisma-based auth system:

1. Keep the old registration endpoint for backward compatibility
2. Update existing users to have profile records
3. Gradually migrate users to the new system

## Troubleshooting

### Profile Not Created

- Check the Supabase logs for trigger errors
- Verify the SQL script was executed successfully
- Ensure RLS policies allow the trigger to insert

### Role Not Set Correctly

- Check the user metadata in `auth.users`
- Verify the trigger function is extracting the role correctly
- Ensure the role value matches the allowed values ('buyer', 'seller', 'admin')

### Permission Errors

- Ensure the trigger function has `SECURITY DEFINER` permissions
- Check that RLS policies are properly configured
- Verify the service role has necessary permissions

## Security Considerations

- The trigger runs with elevated privileges (`SECURITY DEFINER`)
- RLS policies ensure users can only access their own profiles
- Input validation is handled by Supabase Auth
- Profile data is sanitized before insertion
