// Vercel serverless function to proxy chat to OpenAI without exposing your key in the browser.
// 1) Set env var OPENAI_API_KEY in Vercel/Netlify.
// 2) Optionally adjust the default system prompt to your company’s needs.
export default async function handler(req, res){
  if(req.method !== 'POST'){ res.status(405).json({error:'Method not allowed'}); return; }
  try{
    const { model='gpt-4o-mini', system, messages=[] } = req.body || {};
    const apiKey = process.env.OPENAI_API_KEY;
    if(!apiKey){ res.status(500).json({error:'Missing OPENAI_API_KEY'}); return; }

    const finalMessages = [];
    if(system){
      finalMessages.push({ role:'system', content: system });
    }else{
      finalMessages.push({ role:'system', content: 'You are a Safety Director/Manager for a concrete subcontractor in Arizona. Focus on OSHA 29 CFR 1926, ADOSH, ANSI. Give concise, field-ready steps and bare-minimum compliant answers. Cite specific standards when relevant.' });
    }
    // Append user/assistant history
    for(const m of messages){
      if(m.role==='user' || m.role==='assistant'){
        finalMessages.push({ role: m.role, content: m.content });
      }
    }

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: finalMessages,
        temperature: 0.2
      })
    });
    if(!resp.ok){
      const t = await resp.text();
      res.status(resp.status).send(t);
      return;
    }
    const data = await resp.json();
    const answer = data.choices?.[0]?.message?.content || '';
    res.status(200).json({ answer });
  }catch(e){
    res.status(500).json({ error: e.message });
  }
}
