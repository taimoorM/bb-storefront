export interface Category {
  id: string;
  name: string;
  parentCategoryId: string | null;
  active?: boolean;
  image: string | null;
  subCategories?: Category[] | null;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  image?: string | null;
  active: boolean;
}

export interface Inventory {
  id: string;
  items: {
    [key: string]: InventoryItem[];
  };
}
export interface InventoryMap {
  [itemId: string]: InventoryItem;
}

export interface Session {
  id: string;
  createdAt: string;
  expiresAt: string;
  token: string;
  customerId: string;
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
  subTotal: number;
}
[];

export interface CartItem {
  id: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customerId: string;
  storeId: string;
  items: OrderItem[];
  paymentIntentId: string;
  address: Address;
  currency: string;
  totals: Totals;
  user?: string | null;
  sessionId?: string;
  expiresAt: string;
  status: string;
}

export interface OrderItem {
  id: string;
  sku: string | null;
  name: string;
  size: number;
  images: Image[];
  quantity: number;
  productId: string;
  sizeLabel: string;
}

export interface Address {
  state: string;
  country: string;
  postalCode: string;
}

export interface Totals {
  total: number;
  subtotal: number;
  taxAmount: number;
}
