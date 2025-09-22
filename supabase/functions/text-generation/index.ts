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
    const { prompt } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    const huggingFaceToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    
    if (!huggingFaceToken) {
      console.error('HUGGING_FACE_ACCESS_TOKEN not found');
      return new Response(
        JSON.stringify({ error: 'API token not configured' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    console.log('Calling Hugging Face model with prompt:', prompt);

    const response = await fetch(
      'https://api-inference.huggingface.co/models/PurpleKnight234/finetuned_eiamodel',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingFaceToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.7,
            do_sample: true,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', response.status, errorText);
      
      if (response.status === 503) {
        return new Response(
          JSON.stringify({ error: 'Model is loading, please try again in a moment' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 503 
          }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to generate text' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    const result = await response.json();
    console.log('Hugging Face response:', result);

    // Extract the generated text
    let generatedText = '';
    if (Array.isArray(result) && result.length > 0) {
      generatedText = result[0].generated_text || '';
    } else if (result.generated_text) {
      generatedText = result.generated_text;
    } else {
      generatedText = 'I apologize, but I encountered an issue generating a response. Please try again.';
    }

    return new Response(
      JSON.stringify({ generatedText: generatedText.trim() }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in text-generation function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});