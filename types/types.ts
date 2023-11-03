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

export interface InventoryItem {
  id: string;
  name: string;
  description: string | null;
  images: Image[] | [];
  brand: Brand["id"] | null;
  category: Category["id"] | [];
  variants: Variant[];
}

export type Inventory = InventoryItem[];

export interface Variant {
  id: string;
  price: number;
  quantity: number;
  sku: string | null;
  values: VariantValue[];
}

export interface VariantValue {
  id: string;
  label: string;
  value: string;
  type: string;
  variantType: string;
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
  price: number;
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
