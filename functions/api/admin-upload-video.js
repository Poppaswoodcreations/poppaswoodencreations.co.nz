// functions/api/admin-upload-video.js
// Uploads a product turntable/angle video to Supabase Storage "product-videos" bucket
// Mirrors the pattern used in admin-upload-image.js

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const productId = formData.get('productId') || 'unassigned';

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Basic validation
    const allowedTypes = ['video/mp4', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Only mp4 or webm files are allowed' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15MB hard cap
    if (file.size > MAX_SIZE_BYTES) {
      return new Response(
        JSON.stringify({ error: 'File too large. Please compress under 15MB.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = env.SUPABASE_URL;
    const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Server misconfiguration: missing Supabase env vars' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const fileExt = file.name.split('.').pop();
    const safeName = `${productId}-${Date.now()}.${fileExt}`;
    const bucket = 'product-videos';

    const arrayBuffer = await file.arrayBuffer();

    const uploadResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/${bucket}/${safeName}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${supabaseServiceKey}`,
          'Content-Type': file.type,
          'x-upsert': 'true',
        },
        body: arrayBuffer,
      }
    );

    if (!uploadResponse.ok) {
      const errText = await uploadResponse.text();
      return new Response(
        JSON.stringify({ error: `Supabase upload failed: ${errText}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${safeName}`;

    return new Response(
      JSON.stringify({ success: true, url: publicUrl }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || 'Unknown upload error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
