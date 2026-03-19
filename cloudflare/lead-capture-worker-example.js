const ALLOWED_METHODS = ['POST'];

function responseHeaders(extra = {}) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': `${ALLOWED_METHODS.join(', ')}, OPTIONS`,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apiKey',
    'Content-Type': 'application/json',
    ...extra,
  };
}

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: responseHeaders(extraHeaders),
  });
}

async function verifyTurnstile(turnstileToken, ipAddress, secret) {
  if (!secret) {
    return { success: false, errors: ['missing-secret'] };
  }

  if (!turnstileToken) {
    return { success: false, errors: ['missing-input-response'] };
  }

  const verificationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret,
      response: turnstileToken,
      remoteip: ipAddress || '',
    }),
  });

  const result = await verificationResponse.json();

  return {
    success: Boolean(result.success),
    errors: result['error-codes'] || [],
  };
}

function sanitizePayload(body) {
  const { phone: _PHONE, turnstile_token: _TURNSTILE_TOKEN, ...safeBody } = body;
  return safeBody;
}

export default {
  async fetch(request, env) {
    try {
      console.log('Worker started');

      if (request.method === 'OPTIONS') {
        console.log('Handling CORS preflight');
        return new Response(null, {
          status: 204,
          headers: {
            ...responseHeaders({
              'Access-Control-Max-Age': '86400',
            }),
            'Content-Type': 'text/plain',
          },
        });
      }

      if (request.method !== 'POST') {
        console.error('Method not allowed:', request.method);
        return jsonResponse({ error: 'Method not allowed' }, 405);
      }

      let body;
      try {
        body = await request.json();
        console.log('Parsed body:', body);
      } catch (error) {
        console.error('Invalid JSON:', error);
        return jsonResponse({ error: 'Invalid JSON' }, 400);
      }

      if (body.phone) {
        console.log('Bot detected - honeypot filled');
        return jsonResponse({ error: 'Invalid submission' }, 400);
      }

      const turnstile = await verifyTurnstile(
        body.turnstile_token,
        request.headers.get('cf-connecting-ip') || '',
        env.TURNSTILE_SECRET_KEY,
      );

      if (!turnstile.success) {
        console.error('Turnstile validation failed:', turnstile.errors);
        return jsonResponse(
          { error: 'Turnstile validation failed', details: turnstile.errors },
          400,
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!body.email || !emailRegex.test(body.email)) {
        console.log('Invalid email format');
        return jsonResponse({ error: 'Invalid email address' }, 400);
      }

      const supabaseUrl = env.SUPABASE_CONTACT_URL;
      const supabaseKey = env.SUPABASE_ANON_KEY;

      console.log('Supabase URL:', supabaseUrl);
      console.log('Supabase Key exists?', !!supabaseKey);

      if (!supabaseUrl || !supabaseKey) {
        console.error('Missing env variables');
        return jsonResponse({ error: 'Supabase env vars missing' }, 500);
      }

      let response;
      try {
        console.log('Sending request to Supabase...');
        response = await fetch(supabaseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabaseKey}`,
            apikey: supabaseKey,
            'x-real-ip': request.headers.get('cf-connecting-ip') || '',
          },
          body: JSON.stringify(sanitizePayload(body)),
        });
      } catch (error) {
        console.error('Fetch to Supabase FAILED:', error);
        return jsonResponse({ error: 'Failed to call Supabase' }, 500);
      }

      const text = await response.text();
      console.log('Supabase returned:', text);

      return new Response(text, {
        status: response.status,
        headers: responseHeaders(),
      });
    } catch (error) {
      console.error('Worker ERROR (outer catch):', error);
      return jsonResponse({ error: true, message: error.message }, 500);
    }
  },
};
