-- Create suppliers table
create table if not exists suppliers (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) on delete cascade not null,
  brand_name text not null,
  sales_person_name text,
  sales_person_mobile text,
  manager_name text,
  manager_mobile text,
  distributor_name text,
  service_center_details text,
  service_center_number text,
  product_categories text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table suppliers enable row level security;

-- Create policies
create policy "Users can view their own suppliers"
  on suppliers for select
  using (auth.uid() = user_id);

create policy "Users can insert their own suppliers"
  on suppliers for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own suppliers"
  on suppliers for update
  using (auth.uid() = user_id);

create policy "Users can delete their own suppliers"
  on suppliers for delete
  using (auth.uid() = user_id);

-- Create index for faster lookups
create index suppliers_user_id_idx on suppliers(user_id);
create index suppliers_brand_name_idx on suppliers(brand_name);
