
import React, { useState, useEffect } from 'react';
import { Item, CartItem } from '../types';

interface ItemModalProps {
  item: Item;
  onClose: () => void;
  isEditMode: boolean;
  onUpdateItem: (item: Item) => Promise<void>;
  onAddToCart: () => void;
  onUpdateCartQuantity: (item: Item, delta: number) => void;
  onOpenCart: () => void;
  cartItem?: CartItem;
}

const ItemModal: React.FC<ItemModalProps> = ({ item, onClose, isEditMode, onUpdateItem, onAddToCart, onUpdateCartQuantity, onOpenCart, cartItem }) => {
  const [editedItem, setEditedItem] = useState<Item>(item);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditedItem(item);
  }, [item]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateItem(editedItem);
    } finally {
      setIsSaving(false);
    }
  };

  const isInCart = !!cartItem;

  return (
    <div className="fixed inset-0 z-50 bg-white animate-fade-in flex flex-col overflow-hidden">
      <header className="px-6 py-6 flex justify-between items-center shrink-0">
        <button onClick={onClose} className="w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center active:scale-90 transition-transform">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="3"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        {isEditMode && (
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-brand-black text-white rounded-full font-black text-xs uppercase tracking-widest disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </header>

      <div className="flex-grow px-8 flex flex-col items-center overflow-y-auto no-scrollbar pb-10">
        <div className="text-center mb-6 w-full max-w-sm">
          {isEditMode ? (
            <input 
              className="text-3xl font-black tracking-tight leading-none mb-2 w-full text-center border-b-2 border-brand-yellow focus:outline-none"
              value={editedItem.title}
              onChange={(e) => setEditedItem({...editedItem, title: e.target.value})}
            />
          ) : (
            <h2 className="text-3xl font-black tracking-tight leading-none mb-2">{item.title}</h2>
          )}
          
          <p className="text-brand-text-secondary font-bold text-xs uppercase tracking-widest mb-4">Aura Marketplace</p>
          
          <div className="px-4 py-3 bg-brand-bg/50 rounded-2xl w-full">
            {isEditMode ? (
              <textarea 
                className="text-sm text-brand-black leading-relaxed font-medium w-full bg-transparent border-none focus:outline-none resize-none h-24 text-center"
                value={editedItem.description}
                onChange={(e) => setEditedItem({...editedItem, description: e.target.value})}
              />
            ) : (
              <p className="text-sm text-brand-black leading-relaxed font-medium">
                {item.description}
              </p>
            )}
          </div>
        </div>

        <div className="relative w-full max-w-[280px] sm:max-w-[320px] my-4 sm:my-8 shrink-0">
          <div className="absolute inset-0 bg-brand-bg rounded-5xl -rotate-6 transform scale-110 opacity-50" />
          <img 
            src={item.imageUrl} 
            className="relative z-10 w-full h-auto drop-shadow-3xl transform rotate-3 transition-transform hover:rotate-0 duration-500" 
            alt={item.title}
          />
        </div>

        <div className="flex flex-col items-center gap-6 mt-4 shrink-0">
          <div className="bg-brand-yellow rounded-full px-10 py-4 flex items-center gap-6 shadow-xl">
             <div className="flex items-center gap-2">
                {isInCart ? (
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => onUpdateCartQuantity(item, -1)}
                      className="w-10 h-10 rounded-full bg-brand-black text-white flex items-center justify-center font-black"
                    >
                      -
                    </button>
                    <span className="text-2xl font-black min-w-[30px] text-center">{cartItem.quantity}</span>
                    <button 
                      onClick={() => onUpdateCartQuantity(item, 1)}
                      className="w-10 h-10 rounded-full bg-brand-black text-white flex items-center justify-center font-black"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <span className="text-2xl font-black">01</span>
                )}
             </div>
            <div className="h-6 w-[2px] bg-brand-black/20" />
            
            {isEditMode ? (
              <div className="flex items-center font-black text-2xl tracking-tighter">
                <span className="mr-1">Rf</span>
                <input 
                  type="number"
                  className="w-20 bg-transparent border-b border-brand-black/20 focus:outline-none"
                  value={editedItem.price}
                  onChange={(e) => setEditedItem({...editedItem, price: parseFloat(e.target.value) || 0})}
                />
              </div>
            ) : (
              <span className="text-2xl font-black tracking-tighter">Rf {item.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>

      <footer className="p-8 flex items-center gap-4 bg-white/80 backdrop-blur-md shrink-0">
        {!isInCart ? (
          <button 
            onClick={onAddToCart}
            className="flex-grow h-16 rounded-3xl font-black text-sm bg-brand-black text-white transition-all shadow-lg active:scale-95 uppercase tracking-widest"
          >
            Add to cart
          </button>
        ) : (
          <button 
            onClick={() => onUpdateCartQuantity(item, -cartItem.quantity)}
            className="flex-grow h-16 rounded-3xl font-black text-sm bg-brand-yellow text-brand-black transition-all shadow-lg active:scale-95 uppercase tracking-widest"
          >
            Remove from cart
          </button>
        )}
        <button 
          onClick={onOpenCart}
          className="w-16 h-16 bg-brand-yellow text-brand-black rounded-3xl flex items-center justify-center shadow-lg active:scale-95 transition-all"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </button>
      </footer>
    </div>
  );
};

export default ItemModal;
