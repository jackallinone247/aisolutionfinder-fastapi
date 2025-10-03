-- Schema definitions for AI Solution Finder

-- Users table: stores basic user profile information. Supabase automatically
-- creates an auth schema for user accounts; this table extends that
-- information with additional metadata and role.
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user',
  created_at timestamp with time zone default current_timestamp
);

-- Ideas table: each idea corresponds to a process analysis submitted by a user.
create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  process_description text not null,
  applications text[],
  time_required text,
  frequency text,
  stakeholders text[],
  uses_personal_data boolean,
  session_id uuid references public.sessions(id),
  created_at timestamp with time zone default current_timestamp
);

-- Sessions table: stores the aggregate results for a given analysis run.
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  analysis jsonb not null,
  latency_ms integer,
  model text,
  tokens_used integer,
  created_at timestamp with time zone default current_timestamp
);

-- Messages table: stores each prompt and response exchanged with the model.
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade,
  role text not null,
  content text not null,
  tokens integer,
  created_at timestamp with time zone default current_timestamp
);

-- Runs table: capture latency and token usage for each API call.
create table if not exists public.runs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade,
  model text,
  latency_ms integer,
  tokens integer,
  created_at timestamp with time zone default current_timestamp
);

-- Consents table: records user consents to processing and tracking.
create table if not exists public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  purpose text not null,
  granted boolean not null,
  created_at timestamp with time zone default current_timestamp
);

-- DSR events table: log user requests for data export/deletion.
create table if not exists public.dsr_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  action text not null, -- e.g. EXPORT, DELETE
  status text not null default 'pending',
  created_at timestamp with time zone default current_timestamp,
  processed_at timestamp with time zone
);

-- Documents table: stores source documents for RAG (pdfs, transcripts etc.).
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid references public.collections(id) on delete cascade,
  title text not null,
  content text not null,
  metadata jsonb,
  created_at timestamp with time zone default current_timestamp
);

-- Collections table: groups of documents.
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamp with time zone default current_timestamp
);

-- Embeddings table: pgvector based storage for vector embeddings. Requires pgvector extension.
create extension if not exists vector;
create table if not exists public.embeddings (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.documents(id) on delete cascade,
  embedding vector(1536) not null,
  created_at timestamp with time zone default current_timestamp
);