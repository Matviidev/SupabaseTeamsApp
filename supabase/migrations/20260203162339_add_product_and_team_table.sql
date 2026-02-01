create type "public"."product_status" as enum ('Draft', 'Active', 'Deleted');


  create table "public"."products" (
    "id" uuid not null default gen_random_uuid(),
    "team_id" uuid not null,
    "created_by" uuid not null,
    "title" text not null,
    "description" text,
    "image_url" text,
    "status" public.product_status default 'Draft'::public.product_status,
    "fts" tsvector generated always as (to_tsvector('english'::regconfig, ((title || ' '::text) || COALESCE(description, ''::text)))) stored,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."products" enable row level security;


  create table "public"."teams" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "invite_code" text default SUBSTRING(md5((random())::text) FROM 1 FOR 6),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."teams" enable row level security;

alter table "public"."profiles" add column "is_online" boolean default false;

alter table "public"."profiles" add column "last_seen" timestamp with time zone default now();

alter table "public"."profiles" add column "team_id" uuid;

alter table "public"."profiles" add column "updated_at" timestamp with time zone not null default now();

CREATE INDEX idx_products_status ON public.products USING btree (status);

CREATE INDEX products_fts_idx ON public.products USING gin (fts);

CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id);

CREATE INDEX products_team_id_idx ON public.products USING btree (team_id);

CREATE INDEX profiles_team_id_idx ON public.profiles USING btree (team_id);

CREATE UNIQUE INDEX teams_invite_code_key ON public.teams USING btree (invite_code);

CREATE UNIQUE INDEX teams_pkey ON public.teams USING btree (id);

alter table "public"."products" add constraint "products_pkey" PRIMARY KEY using index "products_pkey";

alter table "public"."teams" add constraint "teams_pkey" PRIMARY KEY using index "teams_pkey";

alter table "public"."products" add constraint "products_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) not valid;

alter table "public"."products" validate constraint "products_created_by_fkey";

alter table "public"."products" add constraint "products_team_id_fkey" FOREIGN KEY (team_id) REFERENCES public.teams(id) not valid;

alter table "public"."products" validate constraint "products_team_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_team_id_fkey" FOREIGN KEY (team_id) REFERENCES public.teams(id) not valid;

alter table "public"."profiles" validate constraint "profiles_team_id_fkey";

alter table "public"."teams" add constraint "teams_invite_code_key" UNIQUE using index "teams_invite_code_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.auth_team_id()
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT team_id 
  FROM profiles  -- <--- FIXED: Changed 'users' to 'profiles'
  WHERE id = auth.uid()
  LIMIT 1;
$function$
;

CREATE OR REPLACE FUNCTION public.check_product_edit()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin

  if old.status = 'Active' then
    if new.status = 'Deleted' then
      return new; -- Allow soft delete
    elsif new.status = 'Active' and (new.title <> old.title or new.description <> old.description or new.image_url <> old.image_url) then
      raise exception 'Cannot edit an Active product. Change status to Draft first or Delete it.';
    end if;
  end if;
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    -- Step 1: Check manual signup names. Step 2: Check Google full name. Step 3: Default.
    coalesce(
      (new.raw_user_meta_data->>'first_name') || ' ' || (new.raw_user_meta_data->>'last_name'),
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      'New User'
    ),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$function$
;

grant delete on table "public"."products" to "anon";

grant insert on table "public"."products" to "anon";

grant references on table "public"."products" to "anon";

grant select on table "public"."products" to "anon";

grant trigger on table "public"."products" to "anon";

grant truncate on table "public"."products" to "anon";

grant update on table "public"."products" to "anon";

grant delete on table "public"."products" to "authenticated";

grant insert on table "public"."products" to "authenticated";

grant references on table "public"."products" to "authenticated";

grant select on table "public"."products" to "authenticated";

grant trigger on table "public"."products" to "authenticated";

grant truncate on table "public"."products" to "authenticated";

grant update on table "public"."products" to "authenticated";

grant delete on table "public"."products" to "postgres";

grant insert on table "public"."products" to "postgres";

grant references on table "public"."products" to "postgres";

grant select on table "public"."products" to "postgres";

grant trigger on table "public"."products" to "postgres";

grant truncate on table "public"."products" to "postgres";

grant update on table "public"."products" to "postgres";

grant delete on table "public"."products" to "service_role";

grant insert on table "public"."products" to "service_role";

grant references on table "public"."products" to "service_role";

grant select on table "public"."products" to "service_role";

grant trigger on table "public"."products" to "service_role";

grant truncate on table "public"."products" to "service_role";

grant update on table "public"."products" to "service_role";

grant delete on table "public"."profiles" to "postgres";

grant insert on table "public"."profiles" to "postgres";

grant references on table "public"."profiles" to "postgres";

grant select on table "public"."profiles" to "postgres";

grant trigger on table "public"."profiles" to "postgres";

grant truncate on table "public"."profiles" to "postgres";

grant update on table "public"."profiles" to "postgres";

grant delete on table "public"."teams" to "anon";

grant insert on table "public"."teams" to "anon";

grant references on table "public"."teams" to "anon";

grant select on table "public"."teams" to "anon";

grant trigger on table "public"."teams" to "anon";

grant truncate on table "public"."teams" to "anon";

grant update on table "public"."teams" to "anon";

grant delete on table "public"."teams" to "authenticated";

grant insert on table "public"."teams" to "authenticated";

grant references on table "public"."teams" to "authenticated";

grant select on table "public"."teams" to "authenticated";

grant trigger on table "public"."teams" to "authenticated";

grant truncate on table "public"."teams" to "authenticated";

grant update on table "public"."teams" to "authenticated";

grant delete on table "public"."teams" to "postgres";

grant insert on table "public"."teams" to "postgres";

grant references on table "public"."teams" to "postgres";

grant select on table "public"."teams" to "postgres";

grant trigger on table "public"."teams" to "postgres";

grant truncate on table "public"."teams" to "postgres";

grant update on table "public"."teams" to "postgres";

grant delete on table "public"."teams" to "service_role";

grant insert on table "public"."teams" to "service_role";

grant references on table "public"."teams" to "service_role";

grant select on table "public"."teams" to "service_role";

grant trigger on table "public"."teams" to "service_role";

grant truncate on table "public"."teams" to "service_role";

grant update on table "public"."teams" to "service_role";


  create policy "Create team products"
  on "public"."products"
  as permissive
  for insert
  to public
with check (((team_id = public.auth_team_id()) AND (created_by = auth.uid())));



  create policy "Update team products"
  on "public"."products"
  as permissive
  for update
  to public
using (((team_id = public.auth_team_id()) AND ((status = 'Draft'::public.product_status) OR true)))
with check ((team_id = public.auth_team_id()));



  create policy "View team products"
  on "public"."products"
  as permissive
  for select
  to public
using ((team_id = public.auth_team_id()));



  create policy "Update own profile"
  on "public"."profiles"
  as permissive
  for update
  to public
using ((id = auth.uid()));



  create policy "View team members"
  on "public"."profiles"
  as permissive
  for select
  to public
using (((team_id = public.auth_team_id()) OR (id = auth.uid())));



  create policy "View own team"
  on "public"."teams"
  as permissive
  for select
  to public
using ((id = public.auth_team_id()));


CREATE TRIGGER protect_active_products BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.check_product_edit();


