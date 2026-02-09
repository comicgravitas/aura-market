
import React from 'react';
import { Item, CartItem } from '../types';
import { TrashIcon } from './IconComponents';

interface ItemCardProps {
  item: Item;
  onSelectItem: (item: Item) => void;
  onAddToCart: (item: Item) => void;
  onUpdateCartQuantity: (item: Item, delta: number) => void;
  onDelete: (id: string) => void;
  isEditMode: boolean;
  cartItem?: CartItem;
  variant: 'pink' | 'blue';
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onSelectItem, onAddToCart, onUpdateCartQuantity, onDelete, isEditMode, cartItem, variant }) => {
  const bgColor = variant === 'pink' ? 'bg-brand-pink' : 'bg-brand-blue';
  const isInCart = !!cartItem;

  return (
    <div 
      className={`relative rounded-4xl sm:rounded-5xl overflow-hidden p-4 sm:p-6 shadow-sm transition-all active:scale-95 ${bgColor}`}
      onClick={() => onSelectItem(item)}
    >
      <div className="flex flex-col h-full min-h-[220px] sm:min-h-[320px]">
        <div className="flex justify-between items-start">
          <div className="max-w-full">
            <h3 className="text-sm sm:text-xl font-extrabold text-brand-black leading-tight mb-1 sm:mb-2 line-clamp-2">
              {item.title}
            </h3>
          </div>
          {isEditMode && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
              className="bg-white/40 p-1.5 sm:p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors shrink-0"
            >
              <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>

        <div className="flex-grow flex items-center justify-center p-2 sm:p-4">
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full max-h-[120px] sm:max-h-[180px] object-contain drop-shadow-2xl"
          />
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="font-extrabold text-brand-black text-xs sm:text-sm">
            Rf {item.price.toFixed(2)}
          </span>
          
          <div className="flex items-center gap-1">
            {isInCart ? (
              <div className="flex items-center bg-brand-black rounded-full p-0.5 gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onUpdateCartQuantity(item, -1); }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white/20 text-white hover:bg-white/30 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <span className="text-white font-black text-xs sm:text-sm min-w-[12px] text-center">{cartItem.quantity}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onUpdateCartQuantity(item, 1); }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-brand-yellow text-brand-black hover:bg-yellow-300 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-brand-black text-white hover:scale-110 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M6 12h12M12 6v12"/></svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
