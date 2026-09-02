import { useState } from 'react';

export default function WorkspacePage() {
  // Fallback if router not available: extract videoId from URL path
  const path = window.location.pathname;
  const match = path.match(/\/workspace\/([^/]+)/);
  const videoId = match ? match[1] : 'jvXEkm27XOE';

  const [code, setCode] = useState('');
  const [tab, setTab] = useState('Code');

  const tabs = ['Code', 'Preview', 'AI', 'Terminal'];

  return (
    <div className="min-h-screen bg-[#0B0215] text-white">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[52%_1fr] gap-6 lg:gap-6">
          {/* Left: Video sticky */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
              <iframe
                className="w-full h-full absolute inset-0"
                src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                title="Workspace Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Right: Workspace panel */}
          <div className="bg-[#151025] border border-white/10 rounded-2xl p-4 lg:p-6 flex flex-col gap-4 min-h-[70vh] lg:min-h-0">
            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {tabs.map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-1.5 text-sm rounded-full transition border ${
                    tab === t
                      ? 'bg-[#FFD700] text-black font-bold border-[#FFD700]'
                      : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 bg-[#0A0A0F] rounded-xl border border-white/5 overflow-hidden flex flex-col">
              {tab === 'Code' && (
                <textarea
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  spellCheck={false}
                  className="w-full h-full min-h-[60vh] bg-[#0A0A0F] text-white font-mono text-sm p-4 resize-y outline-none leading-relaxed"
                  placeholder="Type HTML / code here..."
                />
              )}

              {tab === 'Preview' && (() => {
                const trimmed = code.trim();
                const isFullDoc = trimmed.toLowerCase().startsWith('<!doctype') || trimmed.toLowerCase().startsWith('<html');
                const doc = isFullDoc ? trimmed : `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>body{margin:0;padding:24px;font-family:sans-serif;background:#0A0A0F;color:#fff;line-height:1.6}img{max-width:100%;height:auto}</style>
</head>
<body>${trimmed}</body>
</html>`;
                return (
                  <iframe
                    title="Preview"
                    srcDoc={doc}
                    className="w-full h-full min-h-[60vh] border-0 bg-[#0A0A0F]"
                    sandbox="allow-scripts allow-modals"
                  />
                );
              })()}

              {tab === 'AI' && (
                <div className="w-full h-full min-h-[60vh] p-4 text-sm text-gray-300 space-y-3">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">AI Agent ready. Describe what you want to build.</div>
                  <div className="bg-[#FFD700]/10 rounded-xl p-3 border border-[#FFD700]/20 text-[#FFD700]">Suggestion: Use <code className="font-mono">&lt;img&gt;</code> tags with alt text for accessibility.</div>
                </div>
              )}

              {tab === 'Terminal' && (
                <div className="w-full h-full min-h-[60vh] p-4 font-mono text-xs text-green-400 bg-[#0A0A0F] space-y-1">
                  <div>~ $ run build</div>
                  <div>Building workspace...</div>
                  <div>Done. 0 errors.</div>
                  <div>~ $ _</div>
                </div>
              )}
            </div>

            {/* Run button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setCode(code + '\n<!-- Ran at ' + new Date().toISOString() + ' -->');
                  setTab('Preview');
                }}
                className="px-6 py-2.5 bg-[#FFD700] text-black font-extrabold rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:brightness-110 transition"
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
