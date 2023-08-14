export interface Category {
  id: string;
  name: string;
  parentCategoryId: string | null;
  active?: boolean;
  image: string | null;
  subCategories?: Category[] | null;
}

export interface Inventory {
  id: string;
  items: {
    [key: string]: InventoryItem[];
  };
}

export interface InventoryItem {
  active: boolean;
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: Image[] | [];
  size: number;
  sizeLabel: string;
  type: string;
  variantGroupId: string;
  brand: string;
  categories:
    | {
        id: string;
      }[]
    | [];
}

interface Image {
  id: string;
  path: string;
  isPrimary: boolean;
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
