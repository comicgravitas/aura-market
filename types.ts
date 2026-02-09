
export interface Item {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  isSelected: boolean; // Controls public visibility
}

export interface CartItem extends Item {
  quantity: number;
}
