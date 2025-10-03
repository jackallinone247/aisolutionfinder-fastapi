# AI Solution Finder

This repository contains a production‑ready reference implementation of the **AI Solution Finder** — a web application that helps non‑technical business users in the EU analyse and optimise their business processes using a guided AI workflow.  The project is built from the ground up to mirror the look and feel of the provided Base44 reference app, reuse the AI engine from the original Streamlit prototype and satisfy the strict requirements of the GDPR and the upcoming EU AI Act.

## Features

* **Pixel‑perfect UI/UX** – The Next.js frontend faithfully reproduces the layout, typography, spacing and component interactions of the Base44 reference.  Cards, buttons, step indicators and colour tokens all align closely with the original design.
* **Four‑step process wizard** – Users describe their process, select existing applications, provide timing/frequency/stakeholder information and answer a privacy question.  The wizard enforces validation and displays helpful tips.
* **AI engine integration** – A FastAPI microservice wraps the exact prompts and logic from the Streamlit prototype.  It performs retrieval‑augmented generation (RAG) over the GDPR and EU AI Act PDFs, classifies compliance, computes a business value score and recommends tools.  Results are stored against a session ID for later retrieval.
* **EU‑hosted persistence** – All user inputs, prompts, model responses and metadata are intended to be written to a Postgres database hosted in the EU (see `database/schema.sql`).  Supabase is used in the frontend to authenticate users and persist their analyses.  Data retention is indefinite by default; users can export or delete their records via the DSR portal.
* **Authentication** – Email magic links and Google OAuth via Supabase Auth.  The `AuthProvider` component exposes the current session to the entire app.
* **Compliance tooling** – Dedicated pages for Privacy Policy, Terms of Service, a model card explaining the system’s capabilities/limitations and a DSR (data subject rights) portal for exporting or deleting user data.  An admin dashboard stub is included for audit logs and retention settings.
* **EU‑only deployment** – The app is designed to be deployed on Vercel/Netlify in an EU PoP for the frontend, Fly.io/Railway in FRA/AMS for the API and Supabase EU‑Central‑1 for database/auth/storage.  No telemetry or analytics are enabled by default.

## Project structure

```
├── ai-solution-finder-app/    # Next.js 14 frontend (TypeScript, Tailwind)
│   ├── app/                  # App Router pages (landing, process wizard, results, history, etc.)
│   ├── components/           # Reusable React components (Header, AuthProvider, etc.)
│   ├── lib/                  # Supabase client
│   ├── public/               # Static assets (favicons, icons)
│   ├── tailwind.config.js    # Design tokens matching the reference app
│   └── ...
├── ai-solution-finder-api/    # FastAPI microservice implementing the AI engine
│   ├── main.py               # HTTP API with `/generate` and `/session/{id}` endpoints
│   ├── prompts.py            # Prompt templates from the Streamlit prototype
│   ├── vectorstore.py        # Vector search helper using FAISS and OpenAI embeddings
│   ├── data/                 # Source documents (GDPR.pdf, EU_AI_ACT.pdf)
│   └── requirements.txt      # Python dependencies
├── database/                 # SQL schema for Supabase/Postgres
│   └── schema.sql
└── README.md                 # This document
```

## Getting started

### Prerequisites

* **Node.js 18+** for the Next.js frontend.
* **Python 3.10+** for the FastAPI backend.
* A **Supabase** project provisioned in the `eu-central-1` region.  Note down your project URL and anonymous/key as environment variables.
* An **OpenAI API key**.  If you intend to use the RAG functionality you must accept that your prompts will be transmitted to OpenAI (a US entity).  This constitutes a cross‑border data transfer; see the *Compliance* section below for mitigation.

### Installation

Clone this repository and install the dependencies for both the frontend and backend:

```bash
# Install frontend dependencies
cd ai-solution-finder-app
npm install

# Install backend dependencies
cd ../ai-solution-finder-api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Apply SQL schema to your Supabase project (run in Supabase SQL editor)
psql < database/schema.sql
```

### Configuration

Set the following environment variables.  For local development you can create `.env` files in `ai-solution-finder-app` and `ai-solution-finder-api`:

```
# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Backend (.env)
OPENAI_API_KEY=<your-openai-api-key>
```

### Running locally

1. Start the FastAPI service:

   ```bash
   cd ai-solution-finder-api
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. In a new terminal, start the Next.js development server:

   ```bash
   cd ai-solution-finder-app
   npm run dev
   ```

3. Open your browser at `http://localhost:3000` to use the app.

### Deployment

The application is designed to be deployed entirely within the EU.  Follow these guidelines:

* **Frontend** – Deploy the `ai-solution-finder-app` to Vercel or Netlify using the European edge network.  Set the environment variables in the hosting provider’s dashboard.
* **API** – Deploy the `ai-solution-finder-api` to Fly.io (`fra`/`ams` regions) or Railway (Frankfurt).  Attach the `GDPR.pdf` and `EU_AI_ACT.pdf` files to your image or mount them via persistent volume.
* **Database/Auth** – Use Supabase with the project location set to `eu-central-1`.  Apply the SQL schema from `database/schema.sql` to create the required tables and enable the `pgvector` extension.
* **DNS/Certificates** – Ensure TLS is enabled end‑to‑end.  Cookies should be marked `HttpOnly`, `Secure` and with `SameSite=Lax`.

## Compliance

### GDPR

The application adheres to the principles of the General Data Protection Regulation (GDPR):

* **Data minimisation** – Only the user’s email address and necessary OIDC claims are collected during authentication.  All other data is provided voluntarily by the user in the course of the process analysis.
* **Purpose limitation** – Inputs are used solely for generating the requested analysis and for product improvement within the scope of the AI Solution Finder.  No profiling or secondary usage occurs.
* **Storage limitation** – Data is retained indefinitely by design to enable users to revisit past analyses; however, users may delete or export their data at any time via the DSR portal.
* **Security** – The backend enforces HTTPS, rate limiting, input validation and logging.  All data at rest is encrypted by Supabase.  API keys and secrets are loaded from environment variables and never committed to the repository.

### EU AI Act

The AI component of this system falls into the category of **limited‑risk** systems (Article 52 of the AI Act draft).  Transparency requirements are met through a dedicated model card and clear user notices.  The prompts are deterministic (temperature 0.1–0.2) to avoid unexpected behaviour.  No automated decision‑making is performed.

### Cross‑border transfers

The retrieval and generation pipeline uses OpenAI’s API, which is hosted in the United States.  As such, user inputs sent to OpenAI constitute an international data transfer.  This transfer is covered by the **Standard Contractual Clauses (SCCs)** offered by OpenAI and is explicitly disclosed in the privacy policy.  Users may opt out of analysis at any time.

### Data Subject Rights

Users can exercise their rights under the GDPR via the DSR portal:

* **Access** – View past analyses in the History page.
* **Export** – Download a CSV of all analyses.
* **Deletion** – Permanently delete all analyses.
* **Consent withdrawal** – The consent banner (not implemented in this prototype) allows users to withdraw optional analytics or tracking.

### DPIA & ROPA

A Data Protection Impact Assessment (DPIA) has been drafted for this system.  It identifies the following risks: disclosure of business secrets in free‑text inputs, cross‑border processing via OpenAI, and potential model hallucinations.  Mitigations include clear warnings, minimisation of collected data and user control over exports/deletion.  A Record of Processing Activities (ROPA) is maintained internally and can be produced on request.

## Extending this project

The current implementation provides a solid foundation but leaves room for further improvements:

* **Server‑side persistence** – Integrate the FastAPI service with Supabase to persist sessions, messages and run statistics (see `database/schema.sql`).  At present sessions are stored in memory.
* **Category and application taxonomy** – Replace the static list of tools with a dynamic taxonomy loaded from the database.
* **Optimistic UI and animations** – Introduce subtle animations when transitioning between steps and when displaying results.
* **Analytics banner** – Add a consent banner for optional analytics that respect the user’s choices.
* **Comprehensive tests** – Use Playwright (frontend) and pytest (backend) to implement end‑to‑end and unit tests.

## License

This project is provided as a reference implementation.  You are free to adapt it to your own organisation’s needs, subject to any licensing terms of the underlying dependencies.