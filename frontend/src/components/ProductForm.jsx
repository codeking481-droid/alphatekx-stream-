import React, { useState } from "react";

export default function ProductForm({ onSuccess }) {
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "app", fileUrl: "", sellerEmail: "creator@alphatekx.ai" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || Number(form.price) <= 0) { setError("Name and valid price required"); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/marketplace/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to list product");
      setForm({ name: "", description: "", price: "", category: "app", fileUrl: "", sellerEmail: "creator@alphatekx.ai" });
      onSuccess && onSuccess(data.product);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="glass-card p-5 space-y-4 border border-white/10">
      <h3 className="font-bold text-white">List Digital Product</h3>
      <p className="text-xs text-gray-400">Alphatekx takes 20% — you keep 80%. Stripe test card 4242 4242 4242 4242</p>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Product name" className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white" />
      <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} placeholder="Description" rows={3} className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white" />
      <div className="grid grid-cols-2 gap-3">
        <input type="number" step="0.01" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} placeholder="Price $9.99" className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white" />
        <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})} className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white">
          <option value="app">App</option>
          <option value="course">Course</option>
          <option value="plugin">Plugin</option>
        </select>
      </div>
      <input value={form.fileUrl} onChange={e=>setForm({...form, fileUrl:e.target.value})} placeholder="File URL (https://.../product.zip)" className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white" />
      <input value={form.sellerEmail} onChange={e=>setForm({...form, sellerEmail:e.target.value})} placeholder="Seller email" className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white" />
      {form.price && (
        <div className="bg-black/40 rounded-xl p-3 text-xs flex justify-between">
          <span className="text-gray-400">You receive (80%)</span>
          <span className="text-[#00FF88] font-bold">${(Number(form.price)*0.8).toFixed(2)}</span>
          <span className="text-gray-400">Fee (20%)</span>
          <span className="text-[#FFD700] font-bold">${(Number(form.price)*0.2).toFixed(2)}</span>
        </div>
      )}
      <button type="submit" disabled={loading} className="w-full min-h-[44px] bg-gradient-to-r from-[#00FF88] to-[#00D9FF] text-black font-bold text-sm rounded-xl">
        {loading ? "Listing..." : "List Product"}
      </button>
    </form>
  );
}
