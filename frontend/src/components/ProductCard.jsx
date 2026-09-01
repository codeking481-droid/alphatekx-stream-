import React from "react";

export default function ProductCard({ product, onBuy, onView }) {
  const fee = +(product.price * 0.20).toFixed(2);
  const sellerGets = +(product.price - fee).toFixed(2);
  const icon = product.iconType === "cpu" ? "🧠" : product.iconType === "video" ? "🎬" : "✨";
  return (
    <div className="glass-card p-4 flex flex-col gap-3 border border-white/10 hover:border-[#FFD700]/30 transition-colors">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-[#FFD700]/20 flex items-center justify-center text-lg">{icon}</div>
        {product.badge && <span className="text-[10px] font-bold bg-[#FFD700] text-black px-2 py-1 rounded-full">{product.badge}</span>}
      </div>
      <div>
        <h3 className="font-bold text-white text-sm line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-400 line-clamp-2 mt-1">{product.description}</p>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="font-bold text-white">${product.price}</span>
        <span className="text-gray-500">• Seller ${sellerGets} • Fee ${fee} (20%)</span>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onBuy && onBuy(product)} className="flex-1 min-h-[44px] bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold text-xs rounded-xl">Buy via Stripe</button>
        {onView && <button onClick={() => onView(product)} className="px-4 min-h-[44px] bg-[#272727] text-white text-xs font-bold rounded-xl">View</button>}
      </div>
      <p className="text-[11px] text-gray-500">{product.salesCount} sales • {product.category} • {product.sellerEmail}</p>
    </div>
  );
}
