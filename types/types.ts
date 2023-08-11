export interface Category {
  id: string;
  name: string;
  parentCategoryId: string | null;
  active?: boolean;
  image: string | null;
  subCategories?: Category[] | null;
}

export interface Type {
  id: string;
  label: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  currency: string;
}

export interface Session {
  id: string;
  createdAt: string;
  expiresAt: string;
  token: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  sessionId?: string;
  storeId: string;
  user?: string;
}
[];

export interface CartItem {
  product: string;
  quantity: number;
  price: number;
}
