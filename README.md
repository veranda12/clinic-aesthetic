# AURELIA Skin & Aesthetic

Company profile premium untuk klinik aesthetic (skin clinic) di Jakarta Selatan.
Dibangun sebagai portfolio demo — struktur, desain, dan CMS-nya siap dipakai
untuk klinik sungguhan.

**Stack:** Next.js 14 (App Router) · TypeScript · React · Prisma · PostgreSQL ·
Tailwind CSS.

---

## Fitur

**Public site**
- Home editorial (bukan template hero → cards → CTA)
- `/treatments` — 12 perawatan dalam 3 kategori, layout editorial berselang-seling
- `/treatments/[slug]` — detail lengkap: proses, aftercare, FAQ, related, CTA
- `/doctors` — profil dokter editorial
- `/about` — brand story, filosofi, nilai, galeri interior
- `/journal` + `/journal/[slug]` — editorial magazine
- `/contact` — info klinik, jam operasional, peta, form booking (prefill WhatsApp), FAQ

**Admin CMS (`/admin`)**
- Login (session cookie JWT, bcrypt)
- Dashboard ringkasan
- CRUD Treatments, Doctors, Articles, Testimonials, FAQ
- Manage informasi klinik
- Publish / unpublish treatment & artikel

**Teknis**
- Server Components untuk rendering konten; konten bersumber dari database
- SEO: metadata per halaman, Open Graph, canonical, `sitemap.xml`, `robots.txt`,
  structured data (MedicalClinic / MedicalProcedure / Article)
- `next/image` + `next/font`, reduced-motion support, keyboard focus states

---

## Requirements

- **Node.js** 18.18+ (direkomendasikan 20+)
- **PostgreSQL** 14+ berjalan secara lokal (native, tanpa Docker)
- npm

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Siapkan PostgreSQL

Pastikan PostgreSQL berjalan, lalu buat database:

```bash
createdb aurelia
# atau via psql:
# psql -U postgres -c "CREATE DATABASE aurelia;"
```

### 3. Environment variables

Salin `.env.example` menjadi `.env` dan sesuaikan:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/aurelia?schema=public"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ADMIN_EMAIL="admin@aurelia.id"
ADMIN_PASSWORD="aurelia-admin"
AUTH_SECRET="ganti-dengan-string-acak-yang-panjang"
```

> Ganti `PASSWORD` dengan password PostgreSQL Anda, dan `AUTH_SECRET` dengan
> string acak minimal 16 karakter.

### 4. Prisma: generate + migrate

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Seed data demo

```bash
npm run seed
```

Seed membuat 3 kategori + 12 treatment, 3 dokter, 4 artikel, testimonial, FAQ,
informasi klinik, dan **1 akun admin** (dari `ADMIN_EMAIL` / `ADMIN_PASSWORD`).

### 6. Jalankan

```bash
npm run dev
```

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin
  (login dengan `ADMIN_EMAIL` / `ADMIN_PASSWORD` dari `.env`)

---

## Scripts

| Command               | Fungsi                                      |
| --------------------- | ------------------------------------------- |
| `npm run dev`         | Development server                          |
| `npm run build`       | Production build (`prisma generate` + next) |
| `npm start`           | Jalankan hasil build                        |
| `npm run seed`        | Isi database dengan data demo               |
| `npm run lint`        | ESLint                                      |
| `npm run typecheck`   | TypeScript check                            |
| `npm run prisma:studio` | Buka Prisma Studio                        |
| `npm run prisma:deploy` | Terapkan migrasi ke DB produksi (Supabase) |
| `npm run setup:storage` | Buat bucket Supabase Storage (publik)     |

---

## Production build

```bash
npm run build
npm start
```

---

## Deploy ke Supabase + Vercel

Supabase adalah PostgreSQL — jadi Prisma & schema tetap sama. Yang berbeda hanya
string koneksi dan penyimpanan gambar (Vercel filesystem read-only).

### 1. Database (Supabase)

1. Buat project di [supabase.com]. Ambil **Project Settings → Database → Connection string**.
2. Set env (di `.env` lokal untuk migrasi, dan di Vercel untuk runtime):

   ```env
   # Pooled (PgBouncer, 6543) — dipakai runtime serverless
   DATABASE_URL="postgresql://postgres.<ref>:<pw>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
   # Direct (5432) — dipakai prisma migrate
   DIRECT_URL="postgresql://postgres.<ref>:<pw>@aws-0-<region>.pooler.supabase.com:5432/postgres"
   ```

3. Jalankan migrasi + seed ke Supabase (dari lokal):

   ```bash
   npx prisma migrate deploy
   npm run seed
   ```

### 2. Storage gambar (Supabase Storage)

Vercel tidak bisa menulis ke `public/uploads`, jadi upload diarahkan ke Supabase
Storage secara otomatis **jika** env berikut terisi (kalau kosong → fallback ke
disk lokal saat dev):

```env
NEXT_PUBLIC_SUPABASE_URL="https://<ref>.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"   # Settings → API
SUPABASE_STORAGE_BUCKET="media"
```

Buat bucket publiknya sekali (atau lewat dashboard Storage):

```bash
npm run setup:storage
```

### 3. Vercel

1. Import repo ke Vercel (framework: Next.js — terdeteksi otomatis).
2. Tambahkan semua env di atas + `NEXT_PUBLIC_SITE_URL`, `ADMIN_EMAIL`,
   `ADMIN_PASSWORD`, `AUTH_SECRET` di **Project Settings → Environment Variables**.
3. Build command default (`npm run build`) sudah menjalankan `prisma generate`.
   Migrasi dijalankan manual dari lokal (`prisma migrate deploy`), bukan saat build.

> Uploaded image URLs otomatis: Supabase Storage (`https://<ref>.supabase.co/...`)
> di production, atau `/media/...` di dev — sudah dikonfigurasi di
> `next.config.mjs` dan `app/api/upload/route.ts`.

---

## Struktur project

```
app/
  (site)/            # Halaman publik (navbar + footer)
  admin/             # CMS: login + (dashboard) group ter-proteksi
  sitemap.ts, robots.ts, layout.tsx, globals.css
components/           # UI reusable (Navbar, Footer, TreatmentRow, dst.)
features/admin/       # Form, server actions, guard untuk CMS
lib/                  # db, auth, queries, utils, site config
prisma/               # schema.prisma + seed.ts
types/                # tipe konten bersama
```

---

## Catatan desain

Setiap form di admin (Treatment, Doctor, Journal, Certificate, Facility)
mendukung **upload gambar langsung dari perangkat** — berkas disimpan ke
`public/uploads/` dan disajikan sebagai path lokal `/uploads/…` (lihat
`app/api/upload/route.ts`). Opsi tempel URL tetap tersedia untuk gambar remote.
Gambar demo bawaan memakai Unsplash (dikonfigurasi di `next.config.mjs`). Ganti
`mapEmbedUrl` di **Admin → Informasi Klinik** dengan embed Google Maps lokasi
sebenarnya.

> Folder `public/uploads/` di-`.gitignore` (isinya tidak ikut commit). Untuk
> deploy, gunakan host yang menyediakan filesystem persisten atau ganti target
> penyimpanan di route upload.
