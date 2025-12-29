ADBridgeDZ -- website repo

## Admin Dashboard (Recommended)

- Use the Next.js admin dashboard route: `/admin/dashboard`.
- Admin API is served from the backend under `/api/admin/*` and requires an Admin JWT.

## Note about `admin-dashboard/`

This repo also contains a separate Vite app in `admin-dashboard/`.
If you are standardizing on Next.js for admin, treat the Vite app as deprecated/internal to avoid duplicating features.
