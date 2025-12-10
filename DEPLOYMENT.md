# Deployment Guide

This guide explains how to deploy the Finance Manager application and properly configure it to work in a production environment.

## 1. Prerequisites

- A GitHub account.
- A Vercel account (for Frontend).
- A Render account (or similar for Backend, although this guide focuses on the Vercel connection).

## 2. Backend Deployment (FastAPI)

Ensure your backend is running and accessible. If you are deploying the backend to a separate service (like Render, Railway, or AWS), make sure you have the **Public URL** of your backend.

Example Backend URL: `https://finance-manager-backend.onrender.com`

### Backend Environment Variables

For the AI features to work, you must add the following environment variable to your **Backend** deployment (Vercel or Render):

-   **Name**: `GEMINI_API_KEY`
-   **Value**: `Your Actual Gemini API Key` (Starts with `AIza...`)



> [!NOTE]
> If you are deploying the backend as a Serverless Function on Vercel along with the frontend, your Backend URL will be the same as your Frontend URL, but this usually requires placing backend code in `api/` or configuring `vercel.json` rewrites. **Based on your project structure, it seems you are treating them as separate deployments.**

## 3. Frontend Deployment (Vercel)

1.  Push your code to GitHub.
2.  Import your project into Vercel.
3.  **CRITICAL STEP**: Configure Environment Variables.

### Setting the Environment Variable

In your Vercel Project Settings, you **MUST** add the following environment variable:

-   **Name**: `NEXT_PUBLIC_API_URL`
-   **Value**: `YOUR_BACKEND_URL` (e.g., `https://your-backend-service.com` or `https://finance-manager.vercel.app` if hosted together via rewrites, but typically it's the full backend URL without a trailing slash).

> [!IMPORTANT]
> Do not include a trailing slash `/` at the end of the URL.
> Correct: `https://my-api.com`
> Incorrect: `https://my-api.com/`

4.  **Redeploy**: If you added the variable after the initial deployment, you must go to the **Deployments** tab and **Redeploy** the latest commit for changes to take effect.

## 4. Database on Vercel (Important)

If you are deploying the backend to **Vercel**, we have updated the code to use a temporary database (`/tmp/finance.db`).

> [!WARNING]
> **Ephemeral Data**: The database will **RESET** every time the backend restarts or redeploys. Your transaction data will effectively be lost after a short period.
> For permanent storage, you MUST connect to an external database (like Neon, Turso, or Supabase) by setting the `DATABASE_URL` environment variable in Vercel.

## 5. Verification

1.  Open your deployed Vercel URL.
2.  Open the Browser Console (F12).
3.  Check if network requests (like `FETCH_TRANSACTIONS`) are going to your Backend URL and NOT `localhost`.
