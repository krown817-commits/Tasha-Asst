const DEFAULT_ENDPOINT = 'https://apis.davidcyril.name.ng/ai/deepseek-v3';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { text, sessionId, systemPrompt } = req.body || {};
    if (!text || typeof text !== 'string') return res.status(400).json({ error: 'Message is required.' });

    const endpoint = process.env.AI_ENDPOINT || DEFAULT_ENDPOINT;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        text: text.slice(0, 12000),
        systemPrompt: systemPrompt || 'You are Tasha Asst, created by Developer Shazam, owner of Meta Tech. You are a helpful, intelligent, natural AI assistant. Give accurate, useful answers. Be concise unless the user asks for detail.',
        sessionId: sessionId || 'tasha-web'
      })
    });

    const raw = await response.text();
    let data;
    try { data = JSON.parse(raw); } catch { data = { result: raw }; }

    if (!response.ok) {
      return res.status(502).json({ error: data?.message || data?.error || `AI provider returned ${response.status}` });
    }

    return res.status(200).json({
      success: true,
      result: data?.result ?? data?.response ?? data?.answer ?? data?.message ?? data,
      timestamp: data?.timestamp || new Date().toISOString()
    });
  } catch (error) {
    return res.status(502).json({ error: 'Tasha could not reach the AI service. Please try again.' });
  }
      }
