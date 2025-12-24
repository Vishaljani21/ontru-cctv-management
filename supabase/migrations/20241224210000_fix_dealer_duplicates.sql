-- Ontru CCTV Management System - Remove Duplicates & Enforce Uniqueness
-- Migration: 20241224_cleanup_dealer_duplicates.sql

-- 1. Remove duplicate dealer_info rows, keeping the most recently created one
DELETE FROM dealer_info
WHERE id IN (
    SELECT id FROM (
        SELECT id,
               ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as r_num
        FROM dealer_info
    ) t
    WHERE t.r_num > 1
);

-- 2. Add UNIQUE constraint to user_id to prevent future duplicates
-- Using ALTER TABLE ... ADD CONSTRAINT is safer than CREATE UNIQUE INDEX for logical constraints
ALTER TABLE dealer_info 
ADD CONSTRAINT dealer_info_user_id_key UNIQUE (user_id);
