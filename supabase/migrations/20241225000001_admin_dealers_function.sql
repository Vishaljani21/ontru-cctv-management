-- Secure function to get all dealers with their auth email/phone
CREATE OR REPLACE FUNCTION get_admin_dealers()
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT row_to_json(t)
  FROM (
    SELECT 
      d.*,
      u.email as auth_email,
      -- Fetch phone from metadata since it's stored there during signup
      COALESCE(u.phone, (u.raw_user_meta_data->>'phone')::text) as auth_phone
    FROM dealer_info d
    LEFT JOIN auth.users u ON d.user_id = u.id
    ORDER BY d.created_at DESC
  ) t;
END;
$$;

GRANT EXECUTE ON FUNCTION get_admin_dealers() TO authenticated;
