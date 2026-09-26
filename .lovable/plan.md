## Phase 2: Auth + Three-Role Platform Scaffold

Move from landing-only to a full multi-role platform with authentication, role-based dashboards, and core flows for Customer, Designer/Tailor, and Admin.

### 1. Backend (Lovable Cloud)

- Enable Lovable Cloud.
- Auth: Email/password + Google sign-in.
- Tables (with RLS + GRANTs):
  - `profiles` (id → auth.users, full_name, phone, avatar_url, bio)
  - `app_role` enum (`customer`, `designer`, `admin`) + `user_roles` table + `has_role()` security-definer function
  - `designers` (profile_id, specialties, years_experience, rating, portfolio_images[], hourly_rate, bio)
  - `services` (title, description, base_price, category, image_url)
  - `orders` (customer_id, designer_id, service_id, status enum, measurements jsonb, notes, budget, deadline, progress_percent)
  - `order_updates` (order_id, stage, note, image_url) — timeline
  - `appointments` (customer_id, designer_id, date, time_slot, type, status)
  - `messages` (order_id, sender_id, body, attachment_url)
  - `design_uploads` (customer_id, order_id, image_url, notes)
- Trigger: auto-create `profiles` row + default `customer` role on signup.
- Storage buckets: `avatars`, `designs`, `portfolio`, `order-progress`.

### 2. Auth UI

- `/auth` — public sign in / sign up (email+password, Google via Lovable broker).
- `_authenticated/` protected layout (integration-managed).
- Root header shows session-aware CTA (Sign in ↔ account menu with role-based dashboard link + sign out).

### 3. Role-Based Dashboards (under `_authenticated/`)

- `/dashboard` — router that redirects to role-specific home.
- **Customer**: browse designers, service catalog, book appointment, upload design, place order, track orders (progress bar + timeline), messages, profile.
- **Designer**: incoming orders queue, calendar of appointments, update order stage + upload progress photos, portfolio manager, earnings summary.
- **Admin**: users list (assign roles), orders overview, designers approval, analytics (charts: orders/revenue/status distribution), services CRUD.

### 4. Shared UI

- Sidebar shell for dashboards, reusable data tables, loading skeletons, empty states, order status pill, progress bar, timeline component, drag-and-drop uploader (react-dropzone), booking calendar (react-day-picker already in shadcn), recharts for analytics.

### 5. Public Additions

- `/designers` — browse designers grid (public read).
- `/services` — service catalog (public read).
- `/designers/$id` — designer profile with portfolio + "Book" CTA.

### Technical Notes

- Uploads via Supabase Storage; signed URLs where private.
- Server functions (`createServerFn` + `requireSupabaseAuth`) for mutations; browser client for realtime messages & auth.
- `_authenticated/route.tsx` is integration-managed; do not author.
- Sample seed data via migration for services + a demo designer profile.

### Delivery Order

1. Enable Cloud + migrations + auth UI + session-aware header.
2. Dashboard shell + role router + Customer dashboard (browse, book, order, track).
3. Designer dashboard (queue, calendar, progress updates).
4. Admin dashboard (users, roles, analytics).
5. Public `/designers` + `/services` pages.

This is a large build; I'll ship it in the order above, verifying each slice before moving on.
