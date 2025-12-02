"use client";

import React, { useState } from 'react';
import { Plus, X, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

export interface ProductTag {
  id: string;
  x: number; 
  y: number; 
  product: {
    name: string;
    price: number;
    brand: string;
    image: string;
    link: string;
  };
}

interface ShoppableImageProps {
  imageUrl: string;
  alt: string;
  tags: ProductTag[];
}

export const ShoppableImage = ({ imageUrl, alt, tags }: ShoppableImageProps) => {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  return (
    <div className="relative w-full h-[600px] bg-gray-100 rounded-xl overflow-hidden group">
      <Image 
        src={imageUrl} 
        alt={alt} 
        fill 
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        priority
      />
      <div className="absolute inset-0 bg-black/10 transition-opacity opacity-0 group-hover:opacity-100" />

      {tags.map((tag) => (
        <div
          key={tag.id}
          className="absolute z-10"
          style={{ left: `${tag.x}%`, top: `${tag.y}%` }}
        >
          <button
            onClick={() => setActiveTag(activeTag === tag.id ? null : tag.id)}
            className={`relative -ml-3 -mt-3 w-8 h-8 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 
              ${activeTag === tag.id ? 'bg-white text-black rotate-45' : 'bg-white/90 text-emerald-600 hover:bg-white hover:scale-110'}
            `}
          >
            {activeTag === tag.id ? <Plus size={20} /> : <div className="w-3 h-3 bg-emerald-600 rounded-full animate-pulse" />}
            {!activeTag && (
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20 animate-ping"></span>
            )}
          </button>

          {/* O Card do Produto (Tooltip) */}
          {activeTag === tag.id && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-4 w-64 bg-white p-4 rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200 border border-gray-100">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-100"></div>
              
              <div className="relative z-10 flex gap-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <Image src={tag.product.image} alt={tag.product.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{tag.product.brand}</span>
                  <h4 className="font-semibold text-gray-900 text-sm leading-tight">{tag.product.name}</h4>
                  <span className="text-emerald-600 font-bold text-sm mt-1">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tag.product.price)}
                  </span>
                </div>
              </div>
              
              <button className="mt-3 w-full bg-black text-white text-xs font-bold py-2.5 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2">
                <ShoppingBag size={14} />
                Comprar Agora
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};