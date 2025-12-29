-- Enable read access for admin
CREATE POLICY "Enable all access for admin" ON "public"."dealer_info"
AS PERMISSIVE FOR ALL
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);
