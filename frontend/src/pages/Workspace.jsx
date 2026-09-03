import { useState } from 'react';

function WorkspaceAIChat(){
  const params=new URLSearchParams(window.location.search);
  const buildFrom=params.get('buildFrom')||params.get('text');
  const initMsg=buildFrom ? `Build this from Jot: ${decodeURIComponent(buildFrom).slice(0,500)}` : 'Alphatekx AI Workspace 120B ready. Describe what you want to build.';
  const [msgs, setMsgs]=useState([{role:'ai', content:initMsg}]);
  const [input, setInput]=useState(buildFrom ? decodeURIComponent(buildFrom).slice(0,200) : '');
  const [loading, setLoading]=useState(false);
  const send=async(qOverride)=>{
    const q=(qOverride||input).trim(); if(!q) return;
    setMsgs(m=>[...m, {role:'user', content:q}]);
    setInput(''); setLoading(true);
    try{
      const userKey=localStorage.getItem('user_groq_key')||localStorage.getItem('byok_groq_key')||"";
      const headers={'Content-Type':'application/json'}; if(userKey) headers['x-user-groq-key']=userKey;
      const res=await fetch('/api/ai', {method:'POST', headers, body:JSON.stringify({messages:[{role:'user', content:q}], workspaceType:'workspace'})});
      const data=await res.json();
      if(!data.success) throw new Error(data.error);
      setMsgs(m=>[...m, {role:'ai', content:data.message}]);
      // If response contains code, try to extract and preview
      const m=data.message.match(/<create_file[^>]*>([\s\S]*?)<\/create_file>/);
      if(m){
        const code=m[1].trim();
        // Dispatch to parent WorkspacePage's code state via custom event
        window.dispatchEvent(new CustomEvent('workspace-code', {detail: code}));
      }
    }catch(e){ setMsgs(m=>[...m, {role:'ai', content:'Error: '+e.message}]); }
    finally{ setLoading(false); }
  };
  // Auto-build if buildFrom
  React.useEffect(()=>{ if(buildFrom) setTimeout(()=>send(decodeURIComponent(buildFrom)), 500); }, []);
  return (
    <div className="w-full flex-1 min-h-[50vh] flex flex-col p-3 gap-3">
      <div className="flex-1 overflow-auto space-y-2">
        {msgs.map((m,i)=>(<div key={i} className={`p-3 rounded-xl text-sm ${m.role==='user'?'bg-[#FFD700] text-black ml-auto max-w-[80%]':'bg-white/5 text-gray-200 border border-white/10'}`}>{m.content}</div>))}
        {loading && <div className="text-xs text-[#FFD700] animate-pulse">120B thinking...</div>}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask 120B to build..." className="flex-1 bg-black border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white" />
        <button onClick={send} className="px-4 py-2.5 bg-[#FFD700] text-black font-bold text-sm rounded-xl">Send</button>
      </div>
      <div className="text-[10px] text-gray-500">Model: openai/gpt-oss-120b via GROQ • Workspace</div>
    </div>
  );
}
function safeDecode(str) {
  if (!str || !str.includes('&')) return str;
  // only decode if entities present — preserves raw <tags>
  if (!str.includes('&lt;') && !str.includes('&gt;') && !str.includes('&amp;')) return str;
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

export default function WorkspacePage() {
  const path = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  const watchId = searchParams.get('v');
  const match = path.match(/\/workspace\/([^/]+)/);
  const videoId = watchId || (match ? match[1] : 'jvXEkm27XOE');

  const [code, setCode] = useState('');
  const [tab, setTab] = useState('Code');
  const tabs = ['Code', 'Preview', 'AI', 'Terminal'];

  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    const decoded = safeDecode(text);
    const ta = e.target;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const next = code.slice(0, start) + decoded + code.slice(end);
    setCode(next);
    // restore cursor
    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = start + decoded.length;
    });
  };

  React.useEffect(()=>{
    const h=(e)=>{ if(e.detail) { setCode(e.detail); setTab('Preview'); } };
    window.addEventListener('workspace-code', h);
    return ()=>window.removeEventListener('workspace-code', h);
  }, []);
  const decodedCode = safeDecode(code);
  const trimmed = decodedCode.trim();
  const isFullDoc = trimmed.toLowerCase().startsWith('<!doctype') || trimmed.toLowerCase().startsWith('<html');
  const srcDoc = isFullDoc && trimmed
    ? trimmed
    : `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;padding:24px;font-family:system-ui,sans-serif;background:#0A0A0F;color:#fff;line-height:1.6}img{max-width:100%;height:auto}</style></head><body>${trimmed}</body></html>`;

  return (
    <div className="min-h-screen bg-[#0B0215] text-white">
      <div className="max-w-[1440px] mx-auto p-4 lg:p-6">
        {/* back link */}
        <a href="/" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-[#FFD700] mb-4">← Back</a>

        <div className="grid grid-cols-1 lg:grid-cols-[52%_48%] gap-6">
          {/* Left: Video — strict 16:9, 4K crisp, mobile full-bleed comfortable */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div
              className="w-full bg-black overflow-hidden border border-white/10 sm:rounded-2xl rounded-none"
              style={{ aspectRatio: "16 / 9", position: "relative", background: "#000" }}
            >
              <iframe
                className="absolute inset-0 w-full h-full border-0 block"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, display: "block" }}
                src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&fs=1&controls=1&vq=hd2160&hd=1&origin=${encodeURIComponent(typeof window !== "undefined" ? window.location.origin : "https://alphatekx.stream")}`}
                title="Workspace Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                loading="eager"
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <span className="pointer-events-none absolute top-2 left-2 bg-[#0B0215]/70 backdrop-blur text-[#FFD700] text-[10px] font-bold px-2 py-1 rounded-full border border-[#FFD700]/20">AlphaTekx • 4K</span>
            </div>
          </div>

          {/* Right: Workspace panel */}
          <div className="bg-[#151025] border border-white/10 rounded-2xl p-3 lg:p-5 flex flex-col gap-4 min-h-[70vh] lg:min-h-[70vh]">
            {/* Tabs: single row, nowrap, scrollable */}
            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`shrink-0 px-3 py-1.5 text-sm rounded-full border transition ${tab === t ? 'bg-[#FFD700] text-black font-bold border-[#FFD700]' : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'}`}
                >
                  {t}
                </button>
              ))}
              <button onClick={() => setCode('')} className="ml-auto shrink-0 px-3 py-1.5 text-xs rounded-full border border-white/10 bg-white/5 hover:bg-white/10">Clear</button>
            </div>

            {/* Content */}
            <div className="flex-1 bg-[#0A0A0F] rounded-xl border border-white/5 overflow-hidden flex flex-col min-h-[50vh]">
              {tab === 'Code' && (
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onPaste={handlePaste}
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  className="w-full flex-1 min-h-[50vh] lg:min-h-[60vh] bg-[#0A0A0F] text-white font-mono text-sm p-4 outline-none resize-none leading-relaxed"
                  placeholder="Paste your HTML here — e.g. Digital Clock code..."
                />
              )}

              {tab === 'Preview' && (
                <iframe
                  key={srcDoc}
                  title="Preview"
                  srcDoc={srcDoc}
                  className="w-full flex-1 min-h-[50vh] lg:min-h-[60vh] border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
                />
              )}

              {tab === 'AI' && (
                <WorkspaceAIChat />
              )}

              {tab === 'Terminal' && (
                <div className="w-full flex-1 min-h-[50vh] p-4 font-mono text-xs text-green-400 bg-[#0A0A0F] space-y-1">
                  <div>~ $ run build</div>
                  <div>Building workspace...</div>
                  <div>Done. 0 errors.</div>
                  <div>~ $ _</div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 gap-3">
              <span className="text-xs text-white/40">{code.length} chars {isFullDoc ? '• full doc' : '• snippet'}</span>
              <button
                onClick={() => setTab('Preview')}
                className="px-6 py-2.5 bg-[#FFD700] text-black font-extrabold rounded-xl hover:brightness-110 transition"
              >
                Run
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
