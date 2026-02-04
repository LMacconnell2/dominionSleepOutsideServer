export interface ItemModifier {
  name: string;
  priceChange?: number;
}

export interface CartItem {
  _itemId: number;
  itemName: string;
  itemAmount: number;
  itemModifiers: ItemModifier[];
  itemLink: string;
  itemPrice: number;
  itemDiscount: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemNumber: number;
}

export interface OrderItem {
  _itemId: number;
  itemName: string;
  itemAmount: number;
  itemModifiers: ItemModifier[];
  itemPrice: number;
  itemDiscount: number;
}

export interface Order {
  _orderId: number;
  items: OrderItem[];
  datetime: Date;
  subtotal: number;
  total: number;
  address: string;
}

export interface User {
  _id: number;
  username: string;
  email: string;
  password: string;
  cart: Cart;
  address?: string;
}

export interface Review {
  _reviewId: number;
  rating: number;
  reviewTitle: string;
  reviewBody: string;
  date: string;
}

export interface Product {
  _productId: number;
  productName: string;
  productBrand: string;
  productPrice: number;
  productColor: string;
  productDiscount: number;
  productFinalPrice: number;
  productDescription: string;
  productStock: number;
  productInStock: boolean;
  productCategories: string[];
  overallRating: number;
  reviews: Review[];
}