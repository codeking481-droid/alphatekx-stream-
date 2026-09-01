import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard.jsx";
import ProductForm from "../components/ProductForm.jsx";

export default function Marketplace({ isPro, onBuy }) {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const res = await fetch(`/api/marketplace/products?category=${filter}`);
    const data = await res.json();
    setProducts(data.products || []);
  };
  useEffect(() => { load(); }, [filter]);

  const handleBuy = async (product) => {
    const buyerEmail = "buyer@alphatekx.ai";
    const res = await fetch("/api/marketplace/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, buyerEmail })
    });
    const data = await res.json();
    if (data.success) {
      alert(`${data.message}\nSeller gets $${data.fees.sellerRevenue}, Alphatekx fee $${data.fees.platformFee}`);
      load();
      onBuy && onBuy(data);
    } else {
      alert(data.error || "Purchase failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Marketplace</h1>
          <p className="text-xs text-gray-400">Apps, courses, video assets — Alphatekx 20% fee on every sale. Stripe test mode.</p>
        </div>
        <button onClick={()=>setShowForm(!showForm)} className="min-h-[44px] px-5 py-2.5 bg-[#FFD700] text-black font-bold text-sm rounded-xl">
          {showForm ? "Close" : "+ List Product"}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {["all","app","course","plugin"].map(c => (
          <button key={c} onClick={()=>setFilter(c)} className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-bold ${filter===c ? "bg-[#FFD700] text-black" : "bg-[#272727] text-gray-300"}`}>{c}</button>
        ))}
      </div>

      {showForm && <ProductForm onSuccess={()=>{ setShowForm(false); load(); }} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => <ProductCard key={p.id} product={p} onBuy={handleBuy} />)}
      </div>

      {products.length===0 && <p className="text-center text-gray-500 text-sm py-12">No products yet. List your first product!</p>}
    </div>
  );
}
