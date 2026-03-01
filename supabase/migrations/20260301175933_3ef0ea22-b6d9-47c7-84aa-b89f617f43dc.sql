-- Create storage bucket for member avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('member-avatars', 'member-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload member avatars
CREATE POLICY "Authenticated users can upload member avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'member-avatars');

-- Allow public read access to member avatars
CREATE POLICY "Public read access to member avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'member-avatars');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update member avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'member-avatars');

-- Allow authenticated users to delete member avatars
CREATE POLICY "Authenticated users can delete member avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'member-avatars');