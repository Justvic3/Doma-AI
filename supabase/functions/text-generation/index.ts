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

    const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');
    
    if (!deepseekApiKey) {
      console.error('DEEPSEEK_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'API token not configured' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    console.log('Calling DeepSeek V3 model with prompt:', prompt);

    const response = await fetch(
      'https://api.deepseek.com/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${deepseekApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 100,
          temperature: 0.7
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', response.status, response.statusText, errorText);
      console.error('Request URL:', 'https://api.deepseek.com/chat/completions');
      console.error('Request headers:', {
        'Authorization': `Bearer ${deepseekApiKey?.substring(0, 10)}...`,
        'Content-Type': 'application/json',
      });
      console.error('Request body:', JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      }));
      
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
        JSON.stringify({ error: `Failed to generate text: ${response.status} ${errorText}` }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    const result = await response.json();
    console.log('DeepSeek response:', result);

    // Extract the generated text from DeepSeek's OpenAI-compatible response
    let generatedText = '';
    if (result.choices && result.choices.length > 0 && result.choices[0].message) {
      generatedText = result.choices[0].message.content || '';
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