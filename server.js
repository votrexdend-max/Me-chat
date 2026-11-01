// Meta AI (Llama) proxy server. Keep the API key on the server, never in index.html.
import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app=express();
app.use(express.json({limit:"1mb"}));
app.use(express.static("."));
app.post("/api/meta-ai",async(req,res)=>{
  try{
    const key=process.env.META_AI_API_KEY;
    if(!key)return res.status(503).json({error:"Set META_AI_API_KEY in your .env file."});
    const messages=Array.isArray(req.body?.messages)?req.body.messages:[];
    const safe=messages.filter(m=>["user","assistant"].includes(m?.role)&&typeof m?.content==="string").slice(-20);
    if(!safe.length)return res.status(400).json({error:"Send at least one message."});
    // Meta's Llama API-compatible endpoint. Set META_AI_URL if your approved provider uses another URL.
    const url=process.env.META_AI_URL||"https://api.llama.com/v1/chat/completions";
    const response=await fetch(url,{method:"POST",headers:{"Authorization":`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({model:process.env.META_AI_MODEL||"Llama-4-Maverick-17B-128E-Instruct-FP8",messages:[{role:"system",content:"You are Meta AI, a helpful, safe assistant. Be clear and friendly."},...safe],temperature:0.7,max_tokens:900})});
    const data=await response.json();
    if(!response.ok)return res.status(response.status).json({error:data?.error?.message||"AI provider request failed."});
    const reply=data?.choices?.[0]?.message?.content||data?.completion_message?.content?.text;
    if(!reply)return res.status(502).json({error:"AI provider returned an unexpected response."});
    res.json({reply});
  }catch(e){console.error(e);res.status(500).json({error:"Server error while contacting the AI provider."})}
});
const port=process.env.PORT||3000;
app.listen(port,()=>console.log(`Phantom Chat running at http://localhost:${port}`));
