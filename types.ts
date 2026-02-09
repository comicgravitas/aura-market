
export interface Item {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  price: number;
}

export interface CartItem extends Item {
  quantity: number;
}
