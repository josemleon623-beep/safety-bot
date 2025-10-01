# B&B Safety Assistant (Web Chatbot)

A clean, professional safety chatbot you can deploy **free** on Vercel. It answers OSHA/ADOSH/concrete safety questions in a field-friendly format.

## Why this?
- Professional UI (no ChatGPT look)
- Your **API key stays on the server** (not in the browser)
- Mobile friendly for job sites
- Customize title, color, and system prompt

## Quick Deploy (Vercel – free)
1. Create a free account at vercel.com and install the Vercel CLI (optional) or use the web UI.
2. Upload this folder as a new project (or push to GitHub and “Import Project” in Vercel).
3. In **Project Settings → Environment Variables**, add:
   - `OPENAI_API_KEY` = your OpenAI API key
4. Deploy. You’ll get a URL like `https://your-safety-bot.vercel.app`

## Netlify (also free)
- Create a new site from this folder. Add `OPENAI_API_KEY` in Site settings → Environment variables.
- Use a Netlify function compatible adapter (this repo uses Vercel function naming). Easiest path is Vercel.

## Customize
- **Logo**: replace `public/logo.png`
- **Favicon**: replace `public/favicon.png`
- **Title/Color**: change in the left sidebar at runtime (persists in localStorage)
- **System prompt**: put your own rules (e.g., cite specific OSHA numbers, keep it short, etc.)

## Notes
- This template routes chat via `/api/chat` to keep your key private.
- For a private knowledge base (RAG), pair this with a vector DB (Pinecone) later.
- Always verify site-specific rules. This is general guidance only.
