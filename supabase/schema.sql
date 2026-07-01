-- Aureus Trade Capital — Supabase schema (database only; auth via Clerk)
-- Run in Supabase SQL Editor

create table if not exists public.licenses (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  plan text not null default 'atc_bot',
  period text not null default 'three',
  license_key text unique not null,
  status text not null default 'active',
  purchased_at timestamp with time zone default now(),
  expires_at timestamp with time zone,
  razorpay_order_id text,
  razorpay_payment_id text,
  amount_paid integer default 0
);

create table if not exists public.tickets (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  subject text not null,
  category text not null default 'General Inquiry',
  message text not null,
  status text default 'open',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.licenses disable row level security;
alter table public.tickets disable row level security;

create index if not exists licenses_user_id_idx on public.licenses(user_id);
create index if not exists tickets_user_id_idx on public.tickets(user_id);

-- Migration: if upgrading from uuid user_id, run:
-- alter table public.licenses alter column user_id type text using user_id::text;
-- alter table public.tickets alter column user_id type text using user_id::text;
-- drop table if exists public.profiles;
