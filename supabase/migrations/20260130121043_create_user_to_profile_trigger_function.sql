alter table "public"."profiles" drop column "first_name";

alter table "public"."profiles" drop column "last_name";

alter table "public"."profiles" add column "full_name" text;

set check_function_bodies = off;

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

grant delete on table "public"."profiles" to "postgres";

grant insert on table "public"."profiles" to "postgres";

grant references on table "public"."profiles" to "postgres";

grant select on table "public"."profiles" to "postgres";

grant trigger on table "public"."profiles" to "postgres";

grant truncate on table "public"."profiles" to "postgres";

grant update on table "public"."profiles" to "postgres";

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


