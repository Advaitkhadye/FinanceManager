# Deployment Secrets Guide

When deploying to Vercel (Frontend) and Render/Railway (Backend), you must configure these Environment Variables.
**DO NOT commit these values to GitHub.**

## 1. Backend (FastAPI)
*Configure these in your Hosting Provider (e.g., Render, Railway, Vercel)*

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | Connection string for your Supabase/PostgreSQL DB | `postgresql://postgres:[PASSWORD]@db.supabase.co:5432/postgres` |
| `GEMINI_API_KEY` | API Key for Google Gemini AI | `AIzaSy...` |
| `SUPABASE_URL` | URL of your Supabase project | `https://[project-id].supabase.co` |
| `SUPABASE_KEY` | Service Role Key (for backend verification) | `eyJ...` |

## 2. Frontend (Next.js)
*Configure these in Vercel Project Settings*

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL of your Supabase project | `https://[project-id].supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anonymous/Public Key for Supabase | `eyJ...` |
| `NEXT_PUBLIC_API_URL` | URL of your deployed Backend | `https://your-backend-app.onrender.com` |

> [!IMPORTANT] 
> Ensure `NEXT_PUBLIC_API_URL` does NOT end with a slash `/` to avoid double-slash issues.
