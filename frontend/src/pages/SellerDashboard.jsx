import React, { useState, useEffect } from "react";

export default function SellerDashboard({ sellerEmail = "creator@alphatekx.ai" }) {
  const [data, setData] = useState({ sales: [], summary: { totalSales:0, totalRevenue:0, totalFees:0, totalSellerRevenue:0 } });
  const [email, setEmail] = useState(sellerEmail);

  const load = async () => {
    const res = await fetch(`/api/marketplace/sales?sellerEmail=${encodeURIComponent(email)}`);
    const j = await res.json();
    setData(j);
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl font-extrabold text-white">Seller Dashboard</h1>
      <p className="text-xs text-gray-400">Track sales and revenue — 20% Alphatekx fee applied automatically via Stripe</p>

      <div className="flex gap-2">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="seller email" className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white" />
        <button onClick={load} className="min-h-[44px] px-5 py-2.5 bg-[#00D9FF] text-black font-bold text-sm rounded-xl">Load Sales</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-extrabold text-white">{data.summary.totalSales}</p>
          <p className="text-xs text-gray-400">Total Sales</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-extrabold text-[#00FF88]">${data.summary.totalSellerRevenue}</p>
          <p className="text-xs text-gray-400">Your Revenue (80%)</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-extrabold text-[#FFD700]">${data.summary.totalFees}</p>
          <p className="text-xs text-gray-400">Alphatekx Fee (20%)</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-extrabold text-white">${data.summary.totalRevenue}</p>
          <p className="text-xs text-gray-400">Gross Revenue</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-3 border-b border-white/10 flex justify-between">
          <span className="text-xs font-bold text-white">Recent Sales</span>
          <span className="text-xs text-gray-400">{data.sales.length} records</span>
        </div>
        <div className="divide-y divide-white/5 max-h-[400px] overflow-auto">
          {data.sales.map(s => (
            <div key={s.id} className="p-3 flex justify-between text-xs">
              <div>
                <p className="font-bold text-white">{s.productName}</p>
                <p className="text-gray-400">{s.buyerEmail} → {s.sellerEmail}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">${s.price}</p>
                <p className="text-[#00FF88]">You: ${s.sellerRevenue} <span className="text-gray-500">Fee: ${s.platformFee}</span></p>
              </div>
            </div>
          ))}
          {data.sales.length===0 && <p className="p-8 text-center text-sm text-gray-500">No sales yet for {email}</p>}
        </div>
      </div>
    </div>
  );
}
