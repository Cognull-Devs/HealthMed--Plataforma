import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const MUX_TOKEN_ID = Deno.env.get('MUX_TOKEN_ID');
    const MUX_TOKEN_SECRET = Deno.env.get('MUX_TOKEN_SECRET');

    if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
      console.error('MUX credentials not configured');
      throw new Error('MUX credentials not configured');
    }

    const { action, uploadId } = await req.json();
    console.log('MUX Upload action:', action, 'uploadId:', uploadId);

    // Create authorization header
    const authHeader = btoa(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`);

    if (action === 'create-upload') {
      // Create a direct upload URL
      console.log('Creating MUX direct upload...');
      
      const response = await fetch('https://api.mux.com/video/v1/uploads', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          new_asset_settings: {
            playback_policy: ['public'],
            encoding_tier: 'baseline',
          },
          cors_origin: '*',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('MUX API error:', response.status, errorText);
        throw new Error(`MUX API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('MUX upload created successfully:', data.data.id);

      return new Response(JSON.stringify({
        uploadId: data.data.id,
        uploadUrl: data.data.url,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'check-status') {
      if (!uploadId) {
        throw new Error('uploadId is required for check-status');
      }

      console.log('Checking upload status for:', uploadId);

      // Get upload status
      const uploadResponse = await fetch(`https://api.mux.com/video/v1/uploads/${uploadId}`, {
        headers: {
          'Authorization': `Basic ${authHeader}`,
        },
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('MUX API error:', uploadResponse.status, errorText);
        throw new Error(`MUX API error: ${uploadResponse.status}`);
      }

      const uploadData = await uploadResponse.json();
      const upload = uploadData.data;
      
      console.log('Upload status:', upload.status);

      // If upload is complete, get the asset details
      if (upload.status === 'asset_created' && upload.asset_id) {
        console.log('Getting asset details for:', upload.asset_id);
        
        const assetResponse = await fetch(`https://api.mux.com/video/v1/assets/${upload.asset_id}`, {
          headers: {
            'Authorization': `Basic ${authHeader}`,
          },
        });

        if (!assetResponse.ok) {
          const errorText = await assetResponse.text();
          console.error('MUX Asset API error:', assetResponse.status, errorText);
          throw new Error(`MUX Asset API error: ${assetResponse.status}`);
        }

        const assetData = await assetResponse.json();
        const asset = assetData.data;
        
        console.log('Asset ready, playback_ids:', asset.playback_ids);

        return new Response(JSON.stringify({
          status: upload.status,
          assetId: upload.asset_id,
          playbackId: asset.playback_ids?.[0]?.id || null,
          duration: asset.duration,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({
        status: upload.status,
        assetId: upload.asset_id || null,
        playbackId: null,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action. Use "create-upload" or "check-status"');

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in mux-upload function:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
