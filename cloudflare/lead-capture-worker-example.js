function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Content-Type': 'application/json',
    },
  });
}

function pickLeadFields(payload) {
  return {
    name: typeof payload.name === 'string' ? payload.name.trim() : '',
    email: typeof payload.email === 'string' ? payload.email.trim() : '',
    message: typeof payload.message === 'string' ? payload.message.trim() : '',
    type: typeof payload.type === 'string' ? payload.type : 'contact',
    utm_source: payload.utm_source || '',
    utm_medium: payload.utm_medium || '',
    utm_campaign: payload.utm_campaign || '',
    utm_term: payload.utm_term || '',
    utm_content: payload.utm_content || '',
    landing_page: payload.landing_page || '',
    referrer: payload.referrer || '',
    page_path: payload.page_path || '',
    cta_placement: payload.cta_placement || '',
  };
}

async function verifyTurnstile(turnstileToken, ipAddress, secret) {
  if (!secret) {
    return { success: true, skipped: true };
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

async function deliverLead(lead) {
  console.log('Lead received', lead);

  // Replace this with your actual delivery logic:
  // - email via Resend/Postmark/etc.
  // - forward to CRM / Airtable / Notion / webhook
  // - persist to D1 / KV / Durable Object
  return true;
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return jsonResponse({ ok: true });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ ok: false, error: 'Method not allowed' }, 405);
    }

    const payload = await request.json().catch(() => null);
    if (!payload) {
      return jsonResponse({ ok: false, error: 'Invalid JSON payload' }, 400);
    }

    const turnstile = await verifyTurnstile(
      payload.turnstile_token,
      request.headers.get('CF-Connecting-IP'),
      env.TURNSTILE_SECRET_KEY,
    );

    if (!turnstile.success) {
      return jsonResponse({ ok: false, error: 'Turnstile validation failed', details: turnstile.errors }, 400);
    }

    const lead = pickLeadFields(payload);
    if (!lead.email || !lead.message) {
      return jsonResponse({ ok: false, error: 'Missing required lead fields' }, 400);
    }

    await deliverLead(lead);
    return jsonResponse({ ok: true });
  },
};
