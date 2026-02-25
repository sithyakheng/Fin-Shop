# Fin Shop

A modern e-commerce platform built with Next.js, Prisma, and Supabase Storage.

## Features

- Product management with image uploads
- User authentication with NextAuth
- Seller and buyer interfaces
- Multi-currency support (USD/KHR)
- QR code integration
- **Supabase Storage** for image hosting

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Storage**: Supabase Storage
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Supabase account (for image storage)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
4. Configure your environment variables (see `.env.example`)

5. Set up Supabase Storage:
   - See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions

6. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

7. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/finshop"

# NextAuth
NEXTAUTH_SECRET="replace-with-strong-secret"
NEXTAUTH_URL="http://localhost:3000"

# Supabase Storage
VITE_SUPABASE_URL="your_supabase_project_url"
VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"
```

## Project Structure

```
app/
  api/           # API routes
  auth/          # Authentication pages
  buyer/         # Buyer interface
  seller/        # Seller interface
  admin/         # Admin interface
  products/      # Product pages
lib/
  auth.ts        # Authentication configuration
  prisma.ts      # Database client
  supabase.js    # Supabase client and upload helpers
prisma/
  schema.prisma  # Database schema
```

## Recent Changes

✅ **Migrated from Cloudinary to Supabase Storage**
- Replaced Cloudinary SDK with Supabase client
- Updated image upload forms to use file inputs
- Added image preview and management
- Configured Supabase Storage buckets and policies

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run typecheck` - Run TypeScript type checking

## License

MIT
