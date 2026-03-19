const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: 'Method Not Allowed' };

  try {
    const { action, email, password } = JSON.parse(event.body);

    if (action === 'signup') {
      const r = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
        body: JSON.stringify({ email, password })
      });
      const d = await r.json();
      if (d.error) return { statusCode: 400, headers, body: JSON.stringify({ error: d.error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ token: d.access_token, user: d.user }) };
    }

    if (action === 'login') {
      const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
        body: JSON.stringify({ email, password })
      });
      const d = await r.json();
      if (d.error) return { statusCode: 400, headers, body: JSON.stringify({ error: d.error.message }) };
      return { statusCode: 200, headers, body: JSON.stringify({ token: d.access_token, user: d.user }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Geçersiz işlem' }) };
  } catch(err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
