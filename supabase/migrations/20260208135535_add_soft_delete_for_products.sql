alter table "public"."teams" disable row level security;

set check_function_bodies = off;

create or replace view "public"."active_products" as  SELECT id,
    team_id,
    created_by,
    title,
    description,
    image_url,
    status,
    fts,
    created_at,
    updated_at
   FROM public.products
  WHERE ((status <> 'Deleted'::public.product_status) OR (status IS NULL));


CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
    new.updated_at = now();
    return new;
end;
$function$
;


  create policy "Restrict deleted products from selection"
  on "public"."products"
  as restrictive
  for select
  to public
using ((status <> 'Deleted'::public.product_status));


CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


  create policy "Allow authenticated uploads"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'products'::text));



  create policy "Allow public viewing"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'products'::text));



